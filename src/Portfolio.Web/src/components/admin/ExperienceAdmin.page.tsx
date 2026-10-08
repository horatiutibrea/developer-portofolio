import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Paper, Stack, Typography,
} from '@mui/material';
import { AdminCheck, AdminTextField } from './AdminFields';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  deleteExperience, ExperienceInput, ExperienceRecord, loadManagedExperiences, saveExperience,
} from './content.api';

const blank = (): ExperienceInput => ({
  company: '', position: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', displayOrder: 0, isPublished: true,
});

const dateValue = (value?: string | null) => value?.slice(0, 10) ?? '';

export const ExperienceAdminPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ExperienceRecord[]>([]);
  const [draft, setDraft] = useState<ExperienceInput | null>(null);
  const [editingId, setEditingId] = useState<number | undefined>();

  const reload = () => loadManagedExperiences().then(setItems).catch(() => undefined);
  useEffect(() => { reload(); }, []);

  const open = (item?: ExperienceRecord) => {
    setEditingId(item?.id);
    setDraft(item ? {
      company: item.company,
      position: item.position,
      location: item.location ?? '',
      startDate: dateValue(item.startDate),
      endDate: dateValue(item.endDate),
      isCurrent: item.isCurrent,
      description: item.description ?? '',
      displayOrder: item.displayOrder,
      isPublished: item.isPublished,
    } : blank());
  };

  const save = async () => {
    if (!draft?.company.trim() || !draft.position.trim() || !draft.startDate) return;
    await saveExperience({
      ...draft,
      endDate: draft.isCurrent ? null : draft.endDate || null,
      location: draft.location || null,
      description: draft.description || null,
    }, editingId);
    setDraft(null);
    await reload();
  };

  const remove = async (id: number) => {
    if (!window.confirm(t('contentAdmin.confirmDelete'))) return;
    await deleteExperience(id);
    await reload();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{t('contentAdmin.experience')}</Typography>
        <Button variant="contained" startIcon={<Icon>add</Icon>} onClick={() => open()}>{t('contentAdmin.add')}</Button>
      </Stack>
      {items.length === 0 && <Paper sx={{ p: 3 }}><Typography color="text.secondary">{t('contentAdmin.emptyExperience')}</Typography></Paper>}
      {items.map((item) => (
        <Paper key={item.id} sx={{ p: 2.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6">{item.position}</Typography>
              <Typography color="text.secondary">
                {item.company}
                {' · '}
                {dateValue(item.startDate)}
                {' — '}
                {item.isCurrent ? t('experience.present') : dateValue(item.endDate)}
              </Typography>
              {!item.isPublished && <Typography variant="caption">{t('contentAdmin.draft')}</Typography>}
            </Box>
            <Stack direction="row" spacing={1}>
              <Button onClick={() => open(item)}>{t('contentAdmin.edit')}</Button>
              <Button color="error" onClick={() => remove(item.id)}>{t('contentAdmin.delete')}</Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
      <Dialog open={draft !== null} onClose={() => setDraft(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? t('contentAdmin.edit') : t('contentAdmin.add')}</DialogTitle>
        {draft && (
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <AdminTextField
                required
                label={t('contentAdmin.position')}
                value={draft.position}
                onChange={(value) => setDraft({ ...draft, position: value })}
              />
              <AdminTextField
                required
                label={t('contentAdmin.company')}
                value={draft.company}
                onChange={(value) => setDraft({ ...draft, company: value })}
              />
              <AdminTextField
                label={t('contentAdmin.location')}
                value={draft.location ?? ''}
                onChange={(value) => setDraft({ ...draft, location: value })}
              />
              <AdminTextField
                required
                shrink
                type="date"
                label={t('contentAdmin.startDate')}
                value={dateValue(draft.startDate)}
                onChange={(value) => setDraft({ ...draft, startDate: value })}
              />
              <AdminCheck
                label={t('contentAdmin.current')}
                checked={draft.isCurrent}
                onChange={(checked) => setDraft({ ...draft, isCurrent: checked })}
              />
              {!draft.isCurrent && (
                <AdminTextField
                  shrink
                  type="date"
                  label={t('contentAdmin.endDate')}
                  value={dateValue(draft.endDate)}
                  onChange={(value) => setDraft({ ...draft, endDate: value })}
                />
              )}
              <AdminTextField
                multiline
                label={t('contentAdmin.description')}
                value={draft.description ?? ''}
                onChange={(value) => setDraft({ ...draft, description: value })}
              />
              <AdminTextField
                type="number"
                label={t('contentAdmin.order')}
                value={draft.displayOrder}
                onChange={(value) => setDraft({ ...draft, displayOrder: Number(value) })}
              />
              <AdminCheck
                label={t('contentAdmin.published')}
                checked={draft.isPublished}
                onChange={(checked) => setDraft({ ...draft, isPublished: checked })}
              />
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setDraft(null)}>{t('contentAdmin.cancel')}</Button>
          <Button variant="contained" onClick={save}>{t('contentAdmin.save')}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
