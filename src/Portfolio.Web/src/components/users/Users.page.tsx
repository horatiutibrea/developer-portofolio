import { axiosInstance } from '@modules';
import { useUser } from '@hooks';
import { PathEnum, UserRoleEnum } from '@types';
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Icon,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

type Role = {
  id: number,
  denumire: string,
  esteActiv: boolean,
  prioritate: number,
}

type User = {
  id: number,
  email: string,
  nume?: string,
  prenume?: string,
  listaRoluri?: Role[],
  lockoutEnabled: boolean,
  lastLogin?: string | null,
}

export const UsersPage = () => {
  const currentUser = useUser();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [email, setEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const canManageUsers = currentUser?.rol.trim().toUpperCase() === UserRoleEnum.Superadmin;

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersResponse, rolesResponse] = await Promise.all([
        axiosInstance.get<User[]>('/api/utilizatori'),
        axiosInstance.get<Role[]>('/api/roluri'),
      ]);

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        navigate(PathEnum.Home, { replace: true });
        return;
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, navigate, t]);

  useEffect(() => {
    // Initial data loading intentionally synchronizes this page with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  const addUser = async () => {
    if (!email.trim()) {
      enqueueSnackbar(t('users.emailRequired'), { variant: 'warning' });
      return;
    }

    try {
      setSaving(true);
      await axiosInstance.post('/api/utilizatori', {
        email: email.trim(),
        listaRoluri: selectedRoles.map((role) => role.id),
      });

      setEmail('');
      setSelectedRoles([]);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user: User) => {
    if (!window.confirm(t('users.confirmDelete', { email: user.email }))) {
      return;
    }

    try {
      setDeletingId(user.id);
      await axiosInstance.delete(`/api/utilizatori/${user.id}`);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 11rem)',
      }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          width: '100%',
          maxWidth: 1040,
        }}
      >
        <Stack spacing={2.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{
            alignItems: { xs: 'stretch', sm: 'center' },
          }}>
            <Stack spacing={0.5} sx={{
              flexGrow: 1,
            }}>
              <Typography variant="h5" sx={{
                fontWeight: 700,
              }}>
                {t('users.title')}
              </Typography>
            </Stack>
          </Stack>

          {canManageUsers && (
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 2,
                p: { xs: 2, md: 2.5 },
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                }}>
                  {t('users.addUser')}
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{
                  alignItems: { xs: 'stretch', md: 'center' },
                }}>
                  <TextField
                    label="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    size="small"
                    required
                    sx={{ flex: 1 }}
                  />
                  <Autocomplete
                    multiple
                    options={roles.filter((role) => role.esteActiv)}
                    value={selectedRoles}
                    getOptionLabel={(role) => role.denumire}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(_, value) => setSelectedRoles(value)}
                    renderInput={(params) => <TextField {...params} label={t('users.roles')} size="small" />}
                    sx={{ flex: 1.2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Icon>person_add</Icon>}
                    onClick={() => void addUser()}
                    disabled={saving}
                    sx={{ minWidth: 140 }}
                  >
                    {t('users.add')}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}

          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: { xs: 2, md: 2.5 },
            }}
          >
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{
                alignItems: { xs: 'stretch', sm: 'center' },
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    flexGrow: 1,
                  }}>
                  {t('users.allUsers')}
                </Typography>
                <Chip label={t('users.count', { count: users.length })} />
              </Stack>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>{t('users.name')}</TableCell>
                      <TableCell>{t('users.roles')}</TableCell>
                      <TableCell>{t('users.lastLogin')}</TableCell>
                      <TableCell>{t('users.status')}</TableCell>
                      {canManageUsers && <TableCell align="right">{t('users.actions')}</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{[user.prenume, user.nume].filter(Boolean).join(' ') || '-'}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={0.5} useFlexGap sx={{
                            flexWrap: 'wrap',
                          }}>
                            {user.listaRoluri?.length ? user.listaRoluri.map((role) => (
                              <Chip key={role.id} label={role.denumire} size="small" />
                            )) : '-'}
                          </Stack>
                        </TableCell>
                        <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString(i18n.language) : '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.lockoutEnabled ? t('users.locked') : t('users.active')}
                            color={user.lockoutEnabled ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        {canManageUsers && (
                          <TableCell align="right">
                            <Button
                              size="small"
                              color="error"
                              variant="outlined"
                              startIcon={<Icon>delete</Icon>}
                              onClick={() => void deleteUser(user)}
                              disabled={deletingId === user.id}
                            >
                              {t('users.delete')}
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={canManageUsers ? 7 : 6}>
                          <Typography
                            sx={{
                              color: 'text.secondary',
                              textAlign: 'center',
                            }}>
                            {t('users.none')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};
