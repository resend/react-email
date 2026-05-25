---
"@react-email/editor": patch
---

prevent prototype pollution in the email-theming plugin by building `cssJS` and merged theme objects from `Object.create(null)` so attacker-controlled `__proto__`, `constructor`, or `prototype` keys in panel-style input become regular own properties instead of mutating `Object.prototype`
