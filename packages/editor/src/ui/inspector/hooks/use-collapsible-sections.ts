import * as React from 'react';
import {
  SECTION_METADATA,
  type SectionId,
} from '../config/node-section-config';

interface UseCollapsibleSectionsOptions {
  /** Sections that are expanded (visible) by default */
  expandedSections: SectionId[];
  /** Sections that are collapsed by default but available via "+" */
  collapsedSections: SectionId[];
  /** Current style object — used to auto-show sections that already have values */
  styleObject?: Record<string, string | number | undefined>;
  /** Current attributes — used to auto-show sections that already have values */
  attrs?: Record<string, unknown>;
}

interface UseCollapsibleSectionsReturn {
  /** All sections that could be shown (expanded + collapsed) */
  allSections: SectionId[];
  /** Whether a given section should be rendered as visible (not collapsed) */
  shouldShowSection: (sectionId: SectionId) => boolean;
  /** Mark a collapsed section as added/visible */
  addSection: (sectionId: SectionId) => void;
  /** Remove a section — removes it from the added set */
  removeSection: (sectionId: SectionId) => void;
  /** Whether a section is in the collapsed set (i.e. removable) */
  isRemovable: (sectionId: SectionId) => boolean;
  /** Props to spread onto a section component for collapse/expand behaviour */
  getSectionProps: (sectionId: SectionId) => {
    isCollapsed: boolean;
    onAdd: () => void;
    onRemove: (() => void) | undefined;
  };
}

function sectionHasValues(
  sectionId: SectionId,
  styleObject: Record<string, string | number | undefined>,
  attrs: Record<string, unknown>,
): boolean {
  const sectionMeta = SECTION_METADATA[sectionId];
  if (!sectionMeta) {
    return false;
  }

  return sectionMeta.properties.some((prop) => {
    if (styleObject[prop] !== undefined && styleObject[prop] !== '') {
      return true;
    }
    if (attrs[prop] !== undefined && attrs[prop] !== '') {
      return true;
    }
    return false;
  });
}

export function useCollapsibleSections({
  expandedSections,
  collapsedSections,
  styleObject = {},
  attrs = {},
}: UseCollapsibleSectionsOptions): UseCollapsibleSectionsReturn {
  const [addedSections, setAddedSections] = React.useState<Set<SectionId>>(
    new Set(),
  );

  const configKey = [...expandedSections, '|', ...collapsedSections].join(',');
  const prevConfigKeyRef = React.useRef(configKey);
  React.useEffect(() => {
    if (prevConfigKeyRef.current !== configKey) {
      prevConfigKeyRef.current = configKey;
      setAddedSections(new Set());
    }
  }, [configKey]);

  const expandedSet = React.useMemo(
    () => new Set(expandedSections),
    [expandedSections],
  );
  const collapsedSet = React.useMemo(
    () => new Set(collapsedSections),
    [collapsedSections],
  );

  const allSections = React.useMemo(
    () => [...expandedSections, ...collapsedSections],
    [expandedSections, collapsedSections],
  );

  const shouldShowSection = React.useCallback(
    (sectionId: SectionId): boolean =>
      expandedSet.has(sectionId) ||
      addedSections.has(sectionId) ||
      sectionHasValues(sectionId, styleObject, attrs),
    [expandedSet, addedSections, styleObject, attrs],
  );

  const addSection = React.useCallback((sectionId: SectionId) => {
    setAddedSections((prev) => new Set([...prev, sectionId]));
  }, []);

  const removeSection = React.useCallback((sectionId: SectionId) => {
    setAddedSections((prev) => {
      const next = new Set(prev);
      next.delete(sectionId);
      return next;
    });
  }, []);

  const isRemovable = React.useCallback(
    (sectionId: SectionId): boolean => collapsedSet.has(sectionId),
    [collapsedSet],
  );

  const getSectionProps = React.useCallback(
    (sectionId: SectionId) => ({
      isCollapsed: !shouldShowSection(sectionId),
      onAdd: () => addSection(sectionId),
      onRemove: isRemovable(sectionId)
        ? () => removeSection(sectionId)
        : undefined,
    }),
    [shouldShowSection, addSection, removeSection, isRemovable],
  );

  return {
    allSections,
    shouldShowSection,
    addSection,
    removeSection,
    isRemovable,
    getSectionProps,
  };
}
