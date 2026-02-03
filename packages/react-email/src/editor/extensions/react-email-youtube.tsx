import type { Editor as EditorType, JSONContent } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import * as React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { cn } from '@/lib/cn';
import type { ButtonState } from '@/ui/button';
import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import * as Dialog from '@/ui/dialog';
import { SHORTCUTS_VALUES } from '@/ui/kbd';
import { Label } from '@/ui/label';
import { Text } from '@/ui/text';
import { TextField } from '@/ui/text-field';
import { showToast } from '@/ui/toast';
import { inlineCSSToJS } from '@/utils/convert-css-object';
// NOTE: Extensions layer imports from plugins and ui layers - this is acceptable.
import { useAgnosticSelf } from '../plugins/collaboration/liveblocks';
import { useEditorStyles } from '../plugins/theming/context';
import { EditorDialog } from '../ui/dialogs/editor-dialog';
import { YouTubeComponent } from './youtube-component';
import { createPreview, extractYouTubeVideoId } from './youtube-utils';

export const ReactEmailYouTube = ({
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
  const [includePlayButton, setIncludePlayButton] = React.useState(
    node.attrs.internal_includePlayButton ?? true,
  );
  const [buttonState, setButtonState] = React.useState<ButtonState>('normal');
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const { styles } = useEditorStyles();
  const videoId = extractYouTubeVideoId(href);
  const currentUser = useAgnosticSelf();

  function revertPendingState() {
    setHref(node.attrs.internal_linkHref);
    setIncludePlayButton(node.attrs.internal_includePlayButton);
  }

  const uploadImage = React.useCallback(async () => {
    if (canvasRef.current) {
      const data = canvasRef.current.toDataURL('image/jpeg');

      setButtonState('loading');

      try {
        const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'image/jpeg',
          },
          body: buffer,
        });

        const { url } = await response.json();

        updateAttributes({
          internal_imageSource: url,
          internal_linkHref: href,
          internal_new: false,
        });
      } catch (error) {
        console.error(error);

        showToast({
          title: 'Something went wrong while uploading the YouTube image',
          appearance: 'red',
        });
      } finally {
        setButtonState('normal');
      }
    }
  }, [canvasRef, updateAttributes, href]);

  function setCanvasRef(canvas: HTMLCanvasElement | null) {
    canvasRef.current = canvas;

    if (videoId && canvas) {
      // Create preview on initial render
      createPreview({
        videoId,
        canvas,
        includePlayButton,
      });
    }
  }

  React.useEffect(
    function createCanvasOnVideoId() {
      if (canvasRef.current && videoId) {
        createPreview({
          videoId,
          canvas: canvasRef.current,
          includePlayButton,
        });
      }
    },
    [videoId, includePlayButton],
  );

  useHotkeys('meta+enter', () => {
    if (buttonState === 'normal') {
      uploadImage();
    }
  }, [buttonState, uploadImage]);

  const handleOpenDialog = React.useCallback(() => {
    updateAttributes({
      internal_new: true,
      internal_event_user_id: currentUser?.id,
    });
  }, [updateAttributes, currentUser?.id]);

  return (
    <NodeViewWrapper className={`align-${node.attrs.alignment}`}>
      <YouTubeComponent
        disabledLinkWhileEditing
        href={node.attrs.internal_linkHref}
        imageSource={node.attrs.internal_imageSource}
        style={{
          ...styles.toCss().reset,
          ...styles.toCss().image,
          ...inlineCSSToJS(node.attrs.style),
        }}
        selected={selected}
        onClick={handleOpenDialog}
      />

      <EditorDialog
        opened={node.attrs.internal_new}
        updateAttributes={updateAttributes}
        onModalClose={revertPendingState}
        eventUserId={node.attrs.internal_event_user_id}
      >
        <Dialog.Title>Add YouTube video</Dialog.Title>

        <div className="mt-4 w-full">
          <div className="flex flex-col gap-2">
            <Label htmlFor="url">YouTube URL</Label>
            <TextField.Input
              id="url"
              onChange={(event) => setHref(event.target.value)}
              placeholder="http://"
              type="url"
              value={href}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
                  uploadImage();
                }
              }}
            />

            <Text
              size="1"
              color="red"
              className={cn(
                'transition-opacity ease-in-out duration-100 opacity-0',
                { 'opacity-100': videoId === null && href.length > 0 },
              )}
            >
              Invalid YouTube URL
            </Text>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <Label htmlFor="url">Customize</Label>
            <div className="flex gap-2">
              <Checkbox
                id="play-button"
                onCheckedChange={(checked) => {
                  setIncludePlayButton(checked === true);
                }}
                checked={includePlayButton}
              />

              <Label htmlFor="play-button">Include play button</Label>
            </div>
          </div>

          <div className={cn('flex-col gap-2', videoId ? 'flex' : 'hidden')}>
            <Label>Preview</Label>

            <canvas
              className="w-full rounded-sm aspect-video"
              ref={setCanvasRef}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Button
            state={videoId === null ? 'disabled' : buttonState}
            appearance="white"
            onClick={uploadImage}
            type="submit"
            shortcut={[SHORTCUTS_VALUES.CMD, SHORTCUTS_VALUES.ENTER]}
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
