import { EDITOR_THEMES } from './themes';
import type {
  EditorTheme,
  KnownThemeComponents,
  PanelGroup,
  PanelSectionId,
} from './types';

/**
 * Represents the shape of a PanelGroup as it may exist in persisted data.
 * Legacy data can include `classReference` and old-style section IDs
 * (e.g. `'code-block'`, `'typography'`) that no longer exist in the
 * current `PanelSectionId` type.
 */
export interface PersistedPanelGroup {
  id?: string;
  title: string;
  classReference?: KnownThemeComponents;
  inputs: Array<
    PanelGroup['inputs'][number] & { classReference?: KnownThemeComponents }
  >;
}

const PANEL_SECTION_IDS = new Set<PanelSectionId>([
  'body',
  'container',
  'link',
  'image',
  'button',
  'codeBlock',
  'inlineCode',
]);

const PANEL_SECTION_IDS_BY_TITLE: Record<string, PanelSectionId> = {
  background: 'body',
  body: 'body',
  content: 'container',
  container: 'container',
  link: 'link',
  image: 'image',
  button: 'button',
  'code block': 'codeBlock',
  'inline code': 'inlineCode',
};

/**
 * Maps legacy section IDs and classReference values to current PanelSectionId.
 * Handles backward compatibility for persisted data.
 */
const LEGACY_ID_MAP: Record<string, PanelSectionId> = {
  'code-block': 'codeBlock',
  'inline-code': 'inlineCode',
};

/**
 * Maps legacy classReference values to PanelSectionId for data
 * that predates the id field.
 */
const LEGACY_CLASS_REFERENCE_MAP: Record<string, PanelSectionId> = {
  body: 'body',
  container: 'container',
  link: 'link',
  image: 'image',
  button: 'button',
  codeBlock: 'codeBlock',
  inlineCode: 'inlineCode',
};

function isPanelSectionId(value: unknown): value is PanelSectionId {
  return (
    typeof value === 'string' && PANEL_SECTION_IDS.has(value as PanelSectionId)
  );
}

function normalizeTitle(title: string | undefined): string {
  return title?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';
}

function resolvePanelSectionId(
  group: PersistedPanelGroup,
): PanelSectionId | null {
  if (isPanelSectionId(group.id)) {
    return group.id;
  }

  // Handle legacy IDs like 'code-block' → 'codeBlock'
  if (group.id && LEGACY_ID_MAP[group.id]) {
    return LEGACY_ID_MAP[group.id]!;
  }

  // Handle legacy classReference-based resolution
  if (group.classReference && LEGACY_CLASS_REFERENCE_MAP[group.classReference]) {
    const normalizedTitle = normalizeTitle(group.title);
    // Special case: legacy 'typography' section with classReference 'body'
    // should be merged into 'body' (its inputs have been redistributed)
    if (group.classReference === 'body' && normalizedTitle === 'typography') {
      return 'body';
    }
    return LEGACY_CLASS_REFERENCE_MAP[group.classReference]!;
  }

  return PANEL_SECTION_IDS_BY_TITLE[normalizeTitle(group.title)] ?? null;
}

function backfillPanelInputs(
  inputs: PersistedPanelGroup['inputs'],
  defaultInputs: PanelGroup['inputs'],
): PanelGroup['inputs'] {
  if (!Array.isArray(inputs)) {
    return [];
  }

  return inputs.map((input) => {
    const defaultInput = defaultInputs.find(
      (candidate) => candidate.prop === input.prop,
    );

    const { classReference: _, ...inputWithoutClassRef } = input;

    return {
      ...defaultInput,
      ...inputWithoutClassRef,
    };
  });
}

export function inferThemeFromPanelStyles(
  panelStyles: PersistedPanelGroup[] | null | undefined,
): EditorTheme | null {
  if (!Array.isArray(panelStyles) || panelStyles.length === 0) {
    return null;
  }

  let finalTheme: EditorTheme | null = null;
  for (const group of panelStyles) {
    if (!Array.isArray(group?.inputs)) {
      finalTheme = null;
      break;
    }

    if (group.inputs.length !== 0) {
      finalTheme = 'basic';
      break;
    }

    finalTheme = 'minimal';
  }

  return finalTheme;
}

export function applyPanelStylesBackwardsCompat(
  theme: EditorTheme,
  panelStyles: PersistedPanelGroup[] | null | undefined,
): PanelGroup[] | null {
  if (!Array.isArray(panelStyles)) {
    return null;
  }

  return panelStyles
    .map((group) => {
      const panelId = resolvePanelSectionId(group);

      if (!panelId) {
        return null;
      }

      const defaultGroup = EDITOR_THEMES[theme].find(
        (candidate) => candidate.id === panelId,
      );

      if (!defaultGroup) {
        return null;
      }

      const normalized: PanelGroup = {
        id: panelId,
        title: defaultGroup.title,
        inputs: backfillPanelInputs(group.inputs, defaultGroup.inputs),
      };

      return normalized;
    })
    .filter((group): group is PanelGroup => group !== null);
}
