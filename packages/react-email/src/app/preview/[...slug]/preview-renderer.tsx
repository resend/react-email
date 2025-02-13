import {
  type ComponentProps,
  useEffect,
  useRef,
  useTransition,
  startTransition,
  useState,
} from 'react';
import { type Root, createRoot } from 'react-dom/client';
import { mergeRefs } from '../../../utils/merge-refs';

type ShadowRootRendererProps = {
  children: React.ReactElement;
} & ComponentProps<'iframe'>;

interface EmailWrapperProps {
  onMount?: () => void;
  children: React.ReactNode;
}

const EmailWrapper = ({ onMount, children }: EmailWrapperProps) => {
  useEffect(() => {
    onMount?.();
  }, []);

  return <>{children}</>;
};

export const PreviewRenderer = ({
  children,
  ...rest
}: ShadowRootRendererProps) => {
  const rootRef = useRef<Root>(null);

  type RenderingState =
    | {
        isRendering: false;
      }
    | {
        isRendering: true;
        onMountCallbacks: (() => unknown)[];
      };

  const renderingState = useRef<RenderingState>({
    isRendering: false,
  });

  const iframeContent = (
    <EmailWrapper
      onMount={() => {
        if (!renderingState.current.isRendering) return;
        renderingState.current = {
          isRendering: false,
        };
      }}
    >
      {children}
    </EmailWrapper>
  );

  useEffect(() => {
    rootRef.current?.render(children);
  }, [children]);

  return (
    <iframe
      {...rest}
      srcDoc={''}
      ref={mergeRefs((iframe) => {
        (async () => {
          if (iframe?.contentDocument && !rootRef.current) {
            rootRef.current = createRoot(iframe.contentDocument);
            rootRef.current.render(children);
          }

          return () => {
            rootRef.current?.unmount();
          };
        })();
      }, rest.ref)}
    />
  );
};
