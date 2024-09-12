import {
  useState,
  type ComponentPropsWithoutRef,
  useEffect,
} from 'react';
import { createPortal } from 'react-dom';

export const Iframe = ({
  children,
  title,
  ...props
}: ComponentPropsWithoutRef<'iframe'> & {
  title: string;
}) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);

  const [mountNode, setMountNode] = useState<Document | null>(null);

  useEffect(() => {
    if (iframe?.contentDocument) {
      const updateMountNode = () => {
        setMountNode(iframe.contentDocument);
      };

      iframe.addEventListener('load', updateMountNode);

      updateMountNode();

      return () => {
        iframe.removeEventListener('load', updateMountNode);
      };
    }
  }, [iframe]);

  return (
    <iframe {...props} ref={setIframe} title={title}>
      {mountNode
        ? createPortal(children, mountNode as unknown as Element, title)
        : null}
    </iframe>
  );
};
