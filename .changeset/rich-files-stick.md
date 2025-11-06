---
"@react-email/tailwind": major
---

update to using tailwindcss@v4, don't inline styles on component props anymore

## Migration

- Check https://tailwindcss.com/docs/upgrade-guide#changes-from-v3 to see if you need to change utilities
- If you were merging utilities with the `style` prop, consider using [tailwind-merge](https://github.com/dcastil/tailwind-merge) instead.
- Configuration should remain in `config` prop

