import { loadPrismTheme } from '@/utils/prism-utils';

interface LocalPropConfig {
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  defaultValue: string | number;
  unit?: 'px' | '%';
  placeholder?: string;
  options?: Record<string, string | boolean>;
  customUpdate?: (context: { newValue: string }) => void;
}

export const LOCAL_PROPS_SCHEMA: Record<string, LocalPropConfig> = {
  class: {
    label: 'Class',
    type: 'text',
    defaultValue: '',
  },
  width: {
    label: 'Width',
    type: 'number',
    unit: 'px',
    placeholder: 'auto',
    defaultValue: 100,
  },
  height: {
    label: 'Height',
    type: 'number',
    unit: 'px',
    placeholder: 'auto',
    defaultValue: 100,
  },
  alt: {
    label: 'Alt',
    type: 'textarea',
    defaultValue: '',
  },
  align: {
    label: 'Align',
    type: 'select',
    defaultValue: 'left',
    options: {
      left: 'Left',
      center: 'Center',
      right: 'Right',
    },
  },
  alignment: {
    label: 'Alignment',
    type: 'select',
    defaultValue: 'left',
    options: {
      left: 'Left',
      center: 'Center',
      right: 'Right',
    },
  },
  level: {
    label: 'Level',
    type: 'number',
    defaultValue: 1,
  },
  src: {
    label: 'Source',
    type: 'text',
    defaultValue: '',
    options: {
      enableVariables: true,
    },
  },
  href: {
    label: 'Link',
    type: 'text',
    defaultValue: '',
  },
  title: {
    label: 'Title',
    type: 'text',
    defaultValue: '',
  },
  language: {
    label: 'Language',
    type: 'select',
    defaultValue: 'javascript',
    options: {
      css: 'CSS',
      go: 'Go',
      html: 'HTML',
      javascript: 'JavaScript',
      jsx: 'JSX',
      json: 'JSON',
      markdown: 'Markdown',
      php: 'PHP',
      plaintext: 'Plain text',
      python: 'Python',
      ruby: 'Ruby',
      shell: 'Shell',
      sql: 'SQL',
      svg: 'svg',
      typescript: 'TypeScript',
    },
  },
  theme: {
    label: 'Theme',
    type: 'select',
    defaultValue: 'default',
    options: {
      default: 'Default',
      atomDark: 'Atom Dark',
      oneLight: 'Atom Light',
      dracula: 'Dracula',
      nord: 'Nord',
      duotoneDark: 'Duotone Dark',
      duotoneForest: 'Duotone Forest',
      duotoneLight: 'Duotone Light',
      duotoneSea: 'Duotone Sea',
      duotoneSpace: 'Duotone Space',
      vesper: 'Vesper',
      vs: 'VSCode Light',
      vscDarkPlus: 'VSCode Dark',
    },
    customUpdate: ({ newValue }: { newValue: string }) => {
      loadPrismTheme(newValue);
    },
  },
};

// Attributes that are handled in styled sections, not the attributes section
export const EXCLUDED_ATTRIBUTES = [
  'style',
  'class',
  'width',
  'height',
  'align',
  'alignment',
  'href',
  'id',
  'title',
  'lang',
  'dir',
  'data-id',
];

export const LIVEBLOCKS_INTERNAL_PROPS = ['ychange'];
