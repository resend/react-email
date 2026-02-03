import type { Editor as EditorType, JSONContent } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/cn';
import { Button, type ButtonState } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import * as Dialog from '@/ui/dialog';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import { Label } from '@/ui/label';
import { ScrollAreaCss } from '@/ui/scroll-area-css/scroll-area-css';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import { showToast } from '@/ui/toast';
import { inlineCSSToJS } from '@/utils/convert-css-object';
import { hasMessage } from '@/utils/is-error';
// NOTE: Extensions layer imports from plugins and ui layers - this is acceptable.
import { useAgnosticSelf } from '../plugins/collaboration/liveblocks';
import { useEditorStyles } from '../plugins/theming/context';
import { EditorDialog } from '../ui/dialogs/editor-dialog';
import { TwitterComponent } from './twitter-component';
import { extractTweetIdFromUrl } from './twitter-utils';

export const ReactEmailTwitter = ({
  updateAttributes,
  node,
  selected,
}: {
  editor: EditorType;
  node: JSONContent['node'];
  updateAttributes: (attrs: Record<string, unknown>) => void;
  selected?: boolean;
}) => {
  const [href, setHref] = React.useState(node.attrs.internal_linkHref ?? '');
  const [buttonState, setButtonState] = React.useState<ButtonState>('normal');
  const [darkTheme, setDarkTheme] = React.useState(
    node.attrs.internal_darkMode,
  );
  const editorStyle = useEditorStyles();
  const currentUser = useAgnosticSelf();

  const tweetId = extractTweetIdFromUrl(href);

  function revertPendingState() {
    setHref(node.attrs.internal_linkHref);
    setDarkTheme(node.attrs.internal_darkMode);
  }

  React.useEffect(
    function prefetchImages() {
      if (tweetId) {
        const lightImage = new Image();
        const darkImage = new Image();

        lightImage.src = getImageSource(tweetId, false);
        darkImage.src = getImageSource(tweetId, true);
      }
    },
    [tweetId],
  );

  const save = React.useCallback(
    async (tweetId: string) => {
      try {
        setButtonState('loading');

        const tweetImageResponse = await fetch(
          getImageSource(tweetId, darkTheme),
        );
        const tweetImageBuffer = await tweetImageResponse.arrayBuffer();

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/png',
          },
          body: tweetImageBuffer,
        });

        const { url } = await response.json();

        updateAttributes({
          internal_imageSource: url,
          internal_linkHref: href,
          internal_new: false,
          internal_darkMode: darkTheme,
        });
      } catch (err) {
        showToast({
          title: 'Something went wrong while uploading the X/Twitter image',
          description: hasMessage(err) ? err.message : 'Please try again',
          appearance: 'red',
        });
      } finally {
        setButtonState('normal');
      }
    },
    [darkTheme, updateAttributes, href],
  );

  const onSubmit = React.useCallback(() => {
    if (tweetId) {
      save(tweetId);
    }
  }, [tweetId, save]);

  useHotkeys('meta+enter', () => {
    if (buttonState === 'normal') {
      onSubmit();
    }
  }, [buttonState, onSubmit]);

  const handleOpenDialog = React.useCallback(() => {
    updateAttributes({
      internal_new: true,
      internal_event_user_id: currentUser?.id,
    });
  }, [updateAttributes, currentUser?.id]);

  return (
    <NodeViewWrapper>
      <TwitterComponent
        disabledLinkWhileEditing
        href={node.attrs.internal_linkHref}
        imageSource={node.attrs.internal_imageSource}
        attrs={node.attrs}
        style={{
          ...inlineCSSToJS(node.attrs.style),
          ...editorStyle.styles.toCss().image,
          width: '100%',
          maxWidth: '550px',
        }}
        selected={selected}
        onClick={handleOpenDialog}
      />

      <EditorDialog
        opened={node.attrs.internal_new}
        eventUserId={node.attrs.internal_event_user_id}
        updateAttributes={updateAttributes}
        onModalClose={revertPendingState}
      >
        <Dialog.Title>Embed X (former Twitter) post</Dialog.Title>

        <div className="mt-4 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">URL</Label>
            <TextField.Input
              id="url"
              onChange={(event) => setHref(event.target.value)}
              placeholder="http://"
              type="url"
              value={href}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  onSubmit();
                }
              }}
            />

            <Text
              size="1"
              color="red"
              className={cn(
                'transition-opacity ease-in-out duration-100 opacity-0',
                { 'opacity-100': tweetId === null && href.length > 0 },
              )}
            >
              Invalid URL
            </Text>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="url">Theme</Label>
            <div className="flex gap-2">
              <Checkbox
                id="dark-mode"
                onCheckedChange={(checked) => {
                  setDarkTheme(checked === true);
                }}
                checked={darkTheme}
              />

              <Label htmlFor="dark-mode">Dark mode</Label>
            </div>
          </div>

          {tweetId && (
            <div className={cn('flex-col gap-2 flex h-[400px]')}>
              <Label>Preview</Label>
              <ScrollAreaCss className="h-full">
                <div className="flex absolute inset-0">
                  <div className="m-auto" role="status">
                    <svg
                      aria-hidden="true"
                      className="mx-auto h-4 w-4 animate-spin fill-gray-8 text-gray-4 dark:text-gray-4"
                      fill="none"
                      viewBox="0 0 100 101"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>

                <img
                  key={tweetId + darkTheme}
                  className="relative"
                  src={getImageSource(tweetId, darkTheme)}
                  alt="Tweet preview"
                />
              </ScrollAreaCss>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Button
            state={tweetId === null ? 'disabled' : buttonState}
            appearance="white"
            shortcut={[SHORTCUTS_VALUES.CMD, SHORTCUTS_VALUES.ENTER]}
            onClick={() => {
              onSubmit();
            }}
            type="submit"
          >
            Save
          </Button>
          <Dialog.Close asChild>
            <Button shortcut={SHORTCUTS_VALUES.ESC} appearance="gray">
              Cancel
            </Button>
          </Dialog.Close>
        </div>
      </EditorDialog>
    </NodeViewWrapper>
  );
};

function getImageSource(tweetId: string, darkTheme: boolean) {
  return `/api/twitter/tweet?id=${tweetId}&theme=${darkTheme ? 'dark' : 'light'}`;
}
