import { Box, Dialog, DialogContent, DialogTitle, Icon, IconButton, Stack, Typography } from '@mui/material';

type PdfPreviewDialogProps = {
  url: string | null;
  title?: string;
  onClose: () => void;
};

export const PdfPreviewDialog = ({ url, title = 'Previzualizare PDF', onClose }: PdfPreviewDialogProps) => (
  <Dialog
    open={Boolean(url)}
    onClose={onClose}
    fullWidth
    maxWidth="xl"
    slotProps={{ paper: { sx: { height: { xs: '94vh', md: '90vh' }, borderRadius: { xs: 2, md: 4 }, overflow: 'hidden' } } }}
  >
    <DialogTitle sx={{ py: 1.5, px: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{
        alignItems: 'center',
      }}>
        <Icon color="primary">picture_as_pdf</Icon>
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 800,
            flex: 1,
          }}>{title}</Typography>
        <IconButton onClick={onClose} aria-label="Închide previzualizarea"><Icon>close</Icon></IconButton>
      </Stack>
    </DialogTitle>
    <DialogContent dividers sx={{ p: 0, display: 'flex', bgcolor: 'grey.200' }}>
      {url && <Box component="iframe" src={url} title={title} sx={{ width: '100%', height: '100%', border: 0, bgcolor: 'common.white' }} />}
    </DialogContent>
  </Dialog>
);
