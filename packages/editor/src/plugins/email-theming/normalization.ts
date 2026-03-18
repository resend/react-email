import { EDITOR_THEMES } from './themes';
import type {
  EditorTheme,
  KnownThemeComponents,
  PanelGroup,
  PanelSectionId,
} from './types';

const PANEL_SECTION_IDS = new Set<PanelSectionId>([
  'body',
  'container',
  'typography',
  'link',
  'image',
  'button',
  'code-block',
  'inline-code',
]);

const PANEL_SECTION_IDS_BY_TITLE: Record<string, PanelSectionId> = {
  background: 'body',
  body: 'body',
  content: 'container',
  container: 'container',
  typography: 'typography',
  link: 'link',
  image: 'image',
  button: 'button',
  'code block': 'code-block',
  'inline code': 'inline-code',
};

const PANEL_SECTION_IDS_BY_CLASS_REFERENCE: Partial<
  Record<KnownThemeComponents, PanelSectionId>
> = {
  container: 'container',
  link: 'link',
  image: 'image',
  button: 'button',
  codeBlock: 'code-block',
  inlineCode: 'inline-code',
};

function isPanelSectionId(value: unknown): value is PanelSectionId {
  return (
    typeof value === 'string' && PANEL_SECTION_IDS.has(value as PanelSectionId)
  );
}

function normalizeTitle(title: string | undefined): string {
  return title?.trim().toLowerCase().replace(/\s+/g, ' ') ?? '';
}

function resolvePanelSectionId(group: PanelGroup): PanelSectionId | null {
  if (isPanelSectionId(group.id)) {
    return group.id;
  }

  const normalizedTitle = normalizeTitle(group.title);

  if (group.classReference === 'body') {
    if (normalizedTitle === 'typography') {
      return 'typography';
    }

    return 'body';
  }

  if (
    group.classReference &&
    PANEL_SECTION_IDS_BY_CLASS_REFERENCE[group.classReference]
  ) {
    return PANEL_SECTION_IDS_BY_CLASS_REFERENCE[group.classReference] ?? null;
  }

  return PANEL_SECTION_IDS_BY_TITLE[normalizedTitle] ?? null;
}

function normalizePanelInputs(
  inputs: PanelGroup['inputs'],
  defaultInputs: PanelGroup['inputs'],
  fallbackClassReference?: KnownThemeComponents,
): PanelGroup['inputs'] {
  if (!Array.isArray(inputs)) {
    return [];
  }

  return inputs.map((input) => {
    const defaultInput = defaultInputs.find(
      (candidate) => candidate.prop === input.prop,
    );

    return {
      ...defaultInput,
      ...input,
      classReference:
        input.classReference ??
        defaultInput?.classReference ??
        fallbackClassReference,
    };
  });
}

export function inferThemeFromPanelStyles(
  panelStyles: PanelGroup[] | null | undefined,
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

export function normalizeThemePanelStyles(
  theme: EditorTheme,
  panelStyles: PanelGroup[] | null | undefined,
): PanelGroup[] | null {
  if (!Array.isArray(panelStyles)) {
    return null;
  }

  return panelStyles.map((group) => {
    const panelId = resolvePanelSectionId(group);

    if (!panelId) {
      return group;
    }

    const defaultGroup = EDITOR_THEMES[theme].find(
      (candidate) => candidate.id === panelId,
    );

    if (!defaultGroup) {
      return group;
    }

    return {
      ...group,
      id: panelId,
      title: defaultGroup.title,
      classReference: defaultGroup.classReference,
      inputs: normalizePanelInputs(
        group.inputs,
        defaultGroup.inputs,
        defaultGroup.classReference,
      ),
    };
  });
}
