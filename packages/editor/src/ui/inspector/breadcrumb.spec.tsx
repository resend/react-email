import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InspectorBreadcrumb } from './breadcrumb';

vi.mock('@/actions/ai', () => ({ uploadImageViaAI: vi.fn() }));

const mockEditor = {
  commands: {
    setNodeSelection: vi.fn(),
    focus: vi.fn(),
    blur: vi.fn(),
  },
};

const mockInspector = {
  pathFromRoot: [] as Array<{
    nodeType: string;
    nodeAttrs: Record<string, unknown>;
    nodePos: { pos: number; inside: number };
  }>,
};

vi.mock('@tiptap/react', async () => {
  const actual =
    await vi.importActual<typeof import('@tiptap/react')>('@tiptap/react');
  return {
    ...actual,
    useCurrentEditor: () => ({ editor: mockEditor }),
  };
});

vi.mock('./root', () => ({
  useInspector: () => mockInspector,
}));

describe('InspectorBreadcrumb', () => {
  afterEach(() => {
    vi.clearAllMocks();
    mockInspector.pathFromRoot = [];
  });

  it('renders nothing for an empty path', () => {
    const { container } = render(<InspectorBreadcrumb />);
    // The default breadcrumb still renders <nav>; just no segments.
    expect(container.querySelectorAll('button').length).toBe(0);
  });

  it('clicking a nested segment selects that node by its pos', () => {
    mockInspector.pathFromRoot = [
      {
        nodeType: 'body',
        nodeAttrs: {},
        nodePos: { pos: 0, inside: 0 },
      },
      {
        nodeType: 'table',
        nodeAttrs: {},
        nodePos: { pos: 4, inside: 0 },
      },
      {
        nodeType: 'image',
        nodeAttrs: {},
        nodePos: { pos: 12, inside: 0 },
      },
    ];

    let receivedSegments: Array<{
      node: { nodeType: string };
      focus: () => void;
    }> = [];
    render(
      <InspectorBreadcrumb>
        {(segments) => {
          receivedSegments = segments;
          return null;
        }}
      </InspectorBreadcrumb>,
    );

    expect(receivedSegments).toHaveLength(3);
    receivedSegments[2].focus();

    expect(mockEditor.commands.setNodeSelection).toHaveBeenCalledWith(12);
    expect(mockEditor.commands.focus).toHaveBeenCalledOnce();
  });

  it('clicking the body segment blurs instead of selecting pos 0', () => {
    mockInspector.pathFromRoot = [
      {
        nodeType: 'body',
        nodeAttrs: {},
        nodePos: { pos: 0, inside: 0 },
      },
    ];

    let receivedSegments: Array<{ focus: () => void }> = [];
    render(
      <InspectorBreadcrumb>
        {(segments) => {
          receivedSegments = segments;
          return null;
        }}
      </InspectorBreadcrumb>,
    );

    receivedSegments[0].focus();
    expect(mockEditor.commands.blur).toHaveBeenCalledOnce();
    expect(mockEditor.commands.setNodeSelection).not.toHaveBeenCalled();
  });
});
