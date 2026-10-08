import { useCallback, useEffect, useRef, useState } from 'react';

export const usePdfPreview = () => {
  const urlRef = useRef<string | null>(null);
  const [preview, setPreview] = useState<{ url: string, title: string } | null>(null);

  const closePdfPreview = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setPreview(null);
  }, []);

  const showPdfPreview = useCallback((blob: Blob, title: string) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(blob);
    urlRef.current = url;
    setPreview({ url, title });
  }, []);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  return { previewUrl: preview?.url ?? null, previewTitle: preview?.title, showPdfPreview, closePdfPreview };
};
