---
'@react-email/ui': minor
---

Split the preview's dark mode control in two, so both of the behaviors email clients have can be previewed: emulated color inversion, as clients that ignore `prefers-color-scheme` apply it, and the dark styles the email itself defines, as clients that honor it render them. The second is new — until now the toggle could only ever invert the light theme, so an email shipping real `@media (prefers-color-scheme: dark)` rules had no way to be previewed.

Which of the email's color scheme rules apply is now decided by the preview rather than by the machine it runs on. Before, an email's dark rules could match whenever the reader's own OS was set to dark, so with dark mode off the preview showed the dark theme, and the inversion emulation recolored an already-dark one. This was only ever visible in browsers that don't propagate `color-scheme` into embedded documents — which today still includes Safari.
