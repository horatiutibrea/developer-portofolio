import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { AdminCheck, AdminTextField } from './AdminFields';
import { AdminTable } from './AdminTable';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  deleteProject, loadManagedProjects, loadManagedTechnologies, ProjectInput, ProjectRecord, saveProject, TechnologyRecord,
} from './content.api';

const blank = (): ProjectInput => ({
  title: '', slug: '', shortDescription: '', description: '', imageUrl: '', repositoryUrl: '', liveUrl: '',
  displayOrder: 0, isFeatured: false, isPublished: true, technologyIds: [],
});

export const ProjectsAdminPage = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ProjectRecord[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyRecord[]>([]);
  const [draft, setDraft] = useState<ProjectInput | null>(null);
  const [editingId, setEditingId] = useState<number | undefined>();

  const reload = () => Promise.all([loadManagedProjects(), loadManagedTechnologies()])
    .then(([projectItems, technologyItems]) => {
      setItems(projectItems);
      setTechnologies(technologyItems);
    })
    .catch(() => undefined);
  useEffect(() => { reload(); }, []);

  const open = (item?: ProjectRecord) => {
    setEditingId(item?.id);
    setDraft(item ? {
      title: item.title,
      slug: item.slug,
      shortDescription: item.shortDescription,
      description: item.description ?? '',
      imageUrl: item.imageUrl ?? '',
      repositoryUrl: item.repositoryUrl ?? '',
      liveUrl: item.liveUrl ?? '',
      displayOrder: item.displayOrder,
      isFeatured: item.isFeatured,
      isPublished: item.isPublished,
      technologyIds: item.technologyIds,
    } : blank());
  };

  const save = async () => {
    if (!draft?.title.trim() || !draft.shortDescription.trim()) return;
    await saveProject({
      ...draft,
      description: draft.description || null,
      imageUrl: draft.imageUrl || null,
      repositoryUrl: draft.repositoryUrl || null,
      liveUrl: draft.liveUrl || null,
    }, editingId);
    setDraft(null);
    await reload();
  };

  const remove = async (id: number) => {
    if (!window.confirm(t('contentAdmin.confirmDelete'))) return;
    await deleteProject(id);
    await reload();
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">{t('contentAdmin.projects')}</Typography>
        <Button variant="contained" startIcon={<Icon>add</Icon>} onClick={() => open()}>{t('contentAdmin.add')}</Button>
      </Stack>
      <AdminTable
        columns={[t('contentAdmin.title'), t('contentAdmin.technologies'), t('contentAdmin.status')]}
        empty={t('contentAdmin.emptyProjects')}
        rows={items.map((item) => ({
          id: item.id,
          onEdit: () => open(item),
          onDelete: () => remove(item.id),
          cells: [
            item.title,
            item.technologies.join(', ') || item.slug,
            item.isPublished ? t('contentAdmin.published') : t('contentAdmin.draft'),
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
                label={t('contentAdmin.title')}
                value={draft.title}
                onChange={(value) => setDraft({ ...draft, title: value })}
              />
              <AdminTextField
                label={t('contentAdmin.slug')}
                value={draft.slug ?? ''}
                onChange={(value) => setDraft({ ...draft, slug: value })}
              />
              <AdminTextField
                required
                label={t('contentAdmin.shortDescription')}
                value={draft.shortDescription}
                onChange={(value) => setDraft({ ...draft, shortDescription: value })}
              />
              <AdminTextField
                multiline
                label={t('contentAdmin.description')}
                value={draft.description ?? ''}
                onChange={(value) => setDraft({ ...draft, description: value })}
              />
              <AdminTextField
                label={t('contentAdmin.repositoryUrl')}
                value={draft.repositoryUrl ?? ''}
                onChange={(value) => setDraft({ ...draft, repositoryUrl: value })}
              />
              <AdminTextField
                label={t('contentAdmin.liveUrl')}
                value={draft.liveUrl ?? ''}
                onChange={(value) => setDraft({ ...draft, liveUrl: value })}
              />
              <AdminTextField
                label={t('contentAdmin.imageUrl')}
                value={draft.imageUrl ?? ''}
                onChange={(value) => setDraft({ ...draft, imageUrl: value })}
              />
              <TextField
                select
                label={t('contentAdmin.technologies')}
                value={draft.technologyIds}
                onChange={(event) => {
                  const value = event.target.value;
                  setDraft({ ...draft, technologyIds: (typeof value === 'string' ? value.split(',') : value).map(Number) });
                }}
                slotProps={{ select: { multiple: true } }}
              >
                {technologies.map((technology) => (
                  <MenuItem key={technology.id} value={technology.id}>{technology.name}</MenuItem>
                ))}
              </TextField>
              <AdminTextField
                type="number"
                label={t('contentAdmin.order')}
                value={draft.displayOrder}
                onChange={(value) => setDraft({ ...draft, displayOrder: Number(value) })}
              />
              <AdminCheck
                label={t('contentAdmin.featured')}
                checked={draft.isFeatured}
                onChange={(checked) => setDraft({ ...draft, isFeatured: checked })}
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
