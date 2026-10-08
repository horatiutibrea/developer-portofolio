import { useEffect } from 'react';

export const usePageMetadata = (title: string, description: string) => {
  useEffect(() => {
    document.title = `${title} · Horațiu Țibrea`;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.append(meta);
    }
    meta.content = description;
  }, [description, title]);
};
