import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminTable } from './AdminTable';
import {
  ContactMessageDetail, ContactMessageSummary, loadContactMessages, readContactMessage,
} from './content.api';

const statusKey = (status: string) => {
  if (status === 'Read') return 'contentAdmin.messageStatus.Read' as const;
  if (status === 'Resolved') return 'contentAdmin.messageStatus.Resolved' as const;
  return 'contentAdmin.messageStatus.New' as const;
};

export const MessagesAdminPage = () => {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState<ContactMessageSummary[]>([]);
  const [selected, setSelected] = useState<ContactMessageDetail | null>(null);

  const reload = () => loadContactMessages().then(setItems).catch(() => undefined);
  useEffect(() => { reload(); }, []);

  const open = async (id: number) => {
    try {
      const detail = await readContactMessage(id);
      setSelected(detail);
      setItems((current) => current.map((item) => (item.id === id ? { ...item, status: detail.status } : item)));
    } catch {
      setSelected(null);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4">{t('contentAdmin.messages')}</Typography>
      <AdminTable
        columns={[
          t('contentAdmin.received'),
          t('contentAdmin.name'),
          t('contact.email'),
          t('contact.subject'),
          t('contentAdmin.status'),
        ]}
        empty={t('contentAdmin.emptyMessages')}
        rows={items.map((item) => ({
          id: item.id,
          cells: [
            new Date(item.createdAt).toLocaleString(i18n.language),
            item.senderName,
            item.senderEmail,
            item.subject,
            t(statusKey(item.status)),
          ],
          actions: <Button size="small" onClick={() => open(item.id)}>{t('contentAdmin.openMessage')}</Button>,
        }))}
      />
      <Dialog open={selected !== null} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.subject}</DialogTitle>
        {selected && (
          <DialogContent>
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Typography color="text.secondary">
                {selected.senderName}
                {' · '}
                {selected.senderEmail}
              </Typography>
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{selected.message}</Typography>
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setSelected(null)}>{t('contentAdmin.cancel')}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};
