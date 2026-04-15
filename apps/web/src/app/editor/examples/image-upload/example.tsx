'use client';

import { StarterKit } from '@react-email/editor/extensions';
import type { UploadImageResult } from '@react-email/editor/plugins';
import { imageSlashCommand, useEditorImage } from '@react-email/editor/plugins';
import {
  BubbleMenu,
  defaultSlashCommands,
  SlashCommand,
} from '@react-email/editor/ui';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import { useCallback, useRef, useState } from 'react';
import { ExampleShell } from '../example-shell';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=640&q=60';

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });

const content = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Paste or drop an image into the editor, or type / and choose "Image" to pick a file.',
        },
      ],
    },
    {
      type: 'image',
      attrs: {
        src: PLACEHOLDER_IMAGE,
        alt: 'A neon-lit circuit board',
        alignment: 'center',
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Click an image to open its bubble menu. Toggle "Simulate upload error" to see the error path.',
        },
      ],
    },
  ],
};

function Toolbar({
  simulateError,
  onSimulateErrorChange,
  lastEvent,
}: {
  simulateError: boolean;
  onSimulateErrorChange: (value: boolean) => void;
  lastEvent: string | null;
}) {
  const { editor } = useCurrentEditor();

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        type="button"
        onClick={() => editor?.chain().focus().uploadImage().run()}
        className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
      >
        Pick image…
      </button>
      <button
        type="button"
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .setImage({
              src: PLACEHOLDER_IMAGE,
              alt: 'Inserted programmatically',
              alignment: 'center',
            })
            .run()
        }
        className="px-3 py-1.5 border border-(--re-border) rounded-lg bg-(--re-bg) text-(--re-text) cursor-pointer text-[0.8125rem] hover:bg-(--re-hover)"
      >
        Insert placeholder
      </button>
      <label className="flex items-center gap-2 text-[0.8125rem] text-slate-11 cursor-pointer select-none ml-1">
        <input
          type="checkbox"
          checked={simulateError}
          onChange={(e) => onSimulateErrorChange(e.target.checked)}
          className="cursor-pointer"
        />
        Simulate upload error
      </label>
      {lastEvent ? (
        <span className="ml-auto text-[0.75rem] text-slate-11 font-mono">
          {lastEvent}
        </span>
      ) : null}
    </div>
  );
}

export function ImageUpload() {
  const [simulateError, setSimulateError] = useState(false);
  const [lastEvent, setLastEvent] = useState<string | null>(null);
  const shouldFailRef = useRef(simulateError);
  shouldFailRef.current = simulateError;

  const uploadImage = useCallback(async (file: File) => {
    setLastEvent(`Uploading ${file.name}…`);

    try {
      if (shouldFailRef.current) {
        await delay(800);
        throw new Error('Simulated upload failure');
      }

      const dataUrl = await readFileAsDataUrl(file);
      await delay(1200);
      setLastEvent(`Uploaded ${file.name}`);
      return { url: dataUrl } satisfies UploadImageResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setLastEvent(`Error uploading ${file.name}: ${message}`);
      throw error;
    }
  }, []);

  const imageExtension = useEditorImage({ uploadImage });

  const extensions = [StarterKit, imageExtension];

  return (
    <ExampleShell
      title="Image Upload"
      description="Upload images via paste, drop, or the slash command. Uses a stubbed uploader (FileReader → data URL) with a toggle to exercise the error path."
    >
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
      >
        <Toolbar
          simulateError={simulateError}
          onSimulateErrorChange={setSimulateError}
          lastEvent={lastEvent}
        />
        <BubbleMenu hideWhenActiveNodes={['image']} />
        <BubbleMenu.ImageDefault />
        <SlashCommand items={[...defaultSlashCommands, imageSlashCommand]} />
      </EditorProvider>
    </ExampleShell>
  );
}
