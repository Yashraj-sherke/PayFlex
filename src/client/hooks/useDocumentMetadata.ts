import { useEffect } from 'react';

export function useDocumentMetadata(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    if (meta) meta.content = description;

    return () => {
      document.title = 'PayFlex — Smart products. Flexible payments.';
      if (meta && previousDescription) meta.content = previousDescription;
    };
  }, [description, title]);
}
