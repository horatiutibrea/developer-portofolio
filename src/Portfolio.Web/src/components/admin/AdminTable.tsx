import {
  Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Row = {
  id: number,
  cells: ReactNode[],
  onEdit?: () => void,
  onDelete?: () => void,
  actions?: ReactNode,
};

type Props = {
  columns: string[],
  rows: Row[],
  empty: string,
};

export const AdminTable = ({ columns, rows, empty }: Props) => {
  const { t } = useTranslation();
  if (rows.length === 0) {
    return <Paper sx={{ p: 3 }}><Typography color="text.secondary">{empty}</Typography></Paper>;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {columns.map((column) => <TableCell key={column}>{column}</TableCell>)}
            <TableCell align="right">{t('contentAdmin.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              {row.cells.map((cell, index) => (
                <TableCell key={`${row.id}-${index}`}>{cell}</TableCell>
              ))}
              <TableCell align="right">
                {row.actions ?? (
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" onClick={row.onEdit}>{t('contentAdmin.edit')}</Button>
                    <Button size="small" color="error" onClick={row.onDelete}>{t('contentAdmin.delete')}</Button>
                  </Stack>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
