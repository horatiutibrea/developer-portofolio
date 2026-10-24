import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Stack, Typography,
} from '@mui/material';
import { AdminCheck, AdminTextField } from './AdminFields';
import { AdminTable } from './AdminTable';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  deleteTechnology, loadManagedTechnologies, saveTechnology, TechnologyInput, TechnologyRecord,
} from './content.api';

const blank = (): TechnologyInput => ({ name: '', category: '', icon: '', displayOrder: 0, isVisible: true });

export const TechnologiesAdminPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<TechnologyRecord[]>([]);
  const [draft, setDraft] = useState<TechnologyInput | null>(null);
  const [editingId, setEditingId] = useState<number | undefined>();

  const reload = () => loadManagedTechnologies().then(setItems).catch(() => undefined);
  useEffect(() => { reload(); }, []);

  const open = (item?: TechnologyRecord) => {
    setEditingId(item?.id);
    setDraft(item ? { name: item.name, category: item.category, icon: item.icon ?? '', displayOrder: item.displayOrder, isVisible: item.isVisible } : blank());
  };

  const save = async () => {
    if (!draft?.name.trim() || !draft.category.trim()) return;
    await saveTechnology({ ...draft, icon: draft.icon || null }, editingId);
    setDraft(null);
    await reload();
  };

  const remove = async (id: number) => {
    if (!window.confirm(t('contentAdmin.confirmDelete'))) return;
    await deleteTechnology(id);
    await reload();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{t('contentAdmin.technologies')}</Typography>
        <Button variant="contained" startIcon={<Icon>add</Icon>} onClick={() => open()}>{t('contentAdmin.add')}</Button>
      </Stack>
      <AdminTable
        columns={[t('contentAdmin.name'), t('contentAdmin.category'), t('contentAdmin.status')]}
        empty={t('contentAdmin.emptyTechnologies')}
        rows={items.map((item) => ({
          id: item.id,
          onEdit: () => open(item),
          onDelete: () => remove(item.id),
          cells: [
            item.name,
            item.category,
            item.isVisible ? t('contentAdmin.visible') : t('contentAdmin.draft'),
          ],
        }))}
      />
      <Dialog open={draft !== null} onClose={() => setDraft(null)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? t('contentAdmin.edit') : t('contentAdmin.add')}</DialogTitle>
        {draft && (
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <AdminTextField
                required
                label={t('contentAdmin.name')}
                value={draft.name}
                onChange={(value) => setDraft({ ...draft, name: value })}
              />
              <AdminTextField
                required
                label={t('contentAdmin.category')}
                value={draft.category}
                onChange={(value) => setDraft({ ...draft, category: value })}
              />
              <AdminTextField
                type="number"
                label={t('contentAdmin.order')}
                value={draft.displayOrder}
                onChange={(value) => setDraft({ ...draft, displayOrder: Number(value) })}
              />
              <AdminCheck
                label={t('contentAdmin.visible')}
                checked={draft.isVisible}
                onChange={(checked) => setDraft({ ...draft, isVisible: checked })}
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
