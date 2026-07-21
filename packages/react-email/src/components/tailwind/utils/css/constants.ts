// At-rules whose contents are conditional and therefore can never be inlined
// onto an element (e.g. `@media (prefers-color-scheme: dark)`).
//
// Single source of truth shared by the two passes that must agree on it:
//   - extract-rules-per-class.ts marks rules found inside these wrappers as
//     non-inlinable (rather than inlining their conditional declarations).
//   - downlevel-for-email-clients.ts hoists these wrappers back out of nested
//     rules, since email clients don't support CSS nesting.
// If a wrapper were marked non-inlinable here but not hoistable there, it would
// reach the <style> block still nested and fail to render — so they share this.
export const NON_INLINABLE_ATRULES = new Set(['media', 'supports']);
