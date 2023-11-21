![React Email button cover](https://react.email/static/covers/render.png)

<div align="center"><strong>eslint-plugin-react-email</strong></div>
<div align="center">Lint your react-email templates for the highest standard and support.</div>
<br />
<div align="center">
<a href="https://react.email">Website</a> 
<span> · </span>
<a href="https://github.com/resendlabs/react-email">GitHub</a> 
<span> · </span>
<a href="https://react.email/discord">Discord</a>
</div>

## Install

Install the plugin from your command line

#### With yarn

```sh
yarn add @react-email/eslint-plugin -E
```

#### With npm

```sh
npm install @react-email/eslint-plugin -E
```

## Getting started

1. Create a config file inside of your emails folder

2. Extend whatever parent config you may want it to have

3. Add the following configuration to it:

```json
plugins: ['@react-email'],
rules: {
    "@react-email/no-html-wbr": "warn",
    "@react-email/no-html-video": "warn",
    "@react-email/no-html-textarea": "warn",
    "@react-email/no-html-target": "warn",
    "@react-email/no-html-svg": "warn",
    "@react-email/no-html-srcset": "warn",
    "@react-email/no-html-semantics": "warn",
    "@react-email/no-html-select": "warn",
    "@react-email/no-html-ruby": "warn",
    "@react-email/no-html-rt": "warn",
    "@react-email/no-html-rp": "warn",
    "@react-email/no-html-role": "warn",
    "@react-email/no-html-required": "warn",
    "@react-email/no-html-progress": "warn",
    "@react-email/no-html-picture": "warn",
    "@react-email/no-html-object": "warn",
    "@react-email/no-html-meter": "warn",
    "@react-email/no-html-marquee": "warn",
    "@react-email/no-html-loading-attribute": "warn",
    "@react-email/no-html-link": "warn",
    "@react-email/no-html-lang": "warn",
    "@react-email/no-html-input-text": "warn",
    "@react-email/no-html-input-submit": "warn",
    "@react-email/no-html-input-reset": "warn",
    "@react-email/no-html-input-radio": "warn",
    "@react-email/no-html-input-hidden": "warn",
    "@react-email/no-html-input-checkbox": "warn",
    "@react-email/no-html-form": "warn",
    "@react-email/no-html-doctype": "warn",
    "@react-email/no-html-dialog": "warn",
    "@react-email/no-html-dfn": "warn",
    "@react-email/no-html-button-submit": "warn",
    "@react-email/no-html-button-reset": "warn",
    "@react-email/no-html-body": "warn",
    "@react-email/no-html-bdi": "warn",
    "@react-email/no-html-base": "warn",
    "@react-email/no-html-audio": "warn",
    "@react-email/no-html-aria-live": "warn",
    "@react-email/no-html-aria-labelledby": "warn",
    "@react-email/no-html-aria-label": "warn",
    "@react-email/no-html-aria-hidden": "warn",
    "@react-email/no-html-aria-describedby": "warn",
    "@react-email/no-html-anchor-links": "warn",
    "@react-email/no-html-abbr": "warn",
    "@react-email/no-css-writing-mode": "warn",
    "@react-email/no-css-word-break": "warn",
    "@react-email/no-css-visibility": "warn",
    "@react-email/no-css-unit-vmin": "warn",
    "@react-email/no-css-unit-vmax": "warn",
    "@react-email/no-css-unit-vh": "warn",
    "@react-email/no-css-unit-rem": "warn",
    "@react-email/no-css-unit-initial": "warn",
    "@react-email/no-css-unit-ch": "warn",
    "@react-email/no-css-unit-calc": "warn",
    "@react-email/no-css-transform": "warn",
    "@react-email/no-css-text-underline-offset": "warn",
    "@react-email/no-css-text-shadow": "warn",
    "@react-email/no-css-text-overflow": "warn",
    "@react-email/no-css-text-emphasis": "warn",
    "@react-email/no-css-text-emphasis-position": "warn",
    "@react-email/no-css-text-decoration-thickness": "warn",
    "@react-email/no-css-text-decoration-color": "warn",
    "@react-email/no-css-text-align-last": "warn",
    "@react-email/no-css-table-layout": "warn",
    "@react-email/no-css-tab-size": "warn",
    "@react-email/no-css-scroll-snap": "warn",
    "@react-email/no-css-rgba": "warn",
    "@react-email/no-css-radial-gradient": "warn",
    "@react-email/no-css-position": "warn",
    "@react-email/no-css-padding-inline-start-end": "warn",
    "@react-email/no-css-padding-inline-block": "warn",
    "@react-email/no-css-padding-block-start-end": "warn",
    "@react-email/no-css-overflow-wrap": "warn",
    "@react-email/no-css-outline-offset": "warn",
    "@react-email/no-css-opacity": "warn",
    "@react-email/no-css-object-position": "warn",
    "@react-email/no-css-object-fit": "warn",
    "@react-email/no-css-modern-color": "warn",
    "@react-email/no-css-mix-blend-mode": "warn",
    "@react-email/no-css-min-inline-size": "warn",
    "@react-email/no-css-max-block-size": "warn",
    "@react-email/no-css-margin-inline": "warn",
    "@react-email/no-css-margin-inline-start-end": "warn",
    "@react-email/no-css-margin-inline-block": "warn",
    "@react-email/no-css-margin-block-start-end": "warn",
    "@react-email/no-css-list-style-image": "warn",
    "@react-email/no-css-linear-gradient": "warn",
    "@react-email/no-css-left-right-top-bottom": "warn",
    "@react-email/no-css-justify-content": "warn",
    "@react-email/no-css-intrinsic-size": "warn",
    "@react-email/no-css-important": "warn",
    "@react-email/no-css-hyphens": "warn",
    "@react-email/no-css-grid-template": "warn",
    "@react-email/no-css-gap": "warn",
    "@react-email/no-css-function-min": "warn",
    "@react-email/no-css-function-max": "warn",
    "@react-email/no-css-function-clamp": "warn",
    "@react-email/no-css-font-kerning": "warn",
    "@react-email/no-css-flex-wrap": "warn",
    "@react-email/no-css-flex-direction": "warn",
    "@react-email/no-css-filter": "warn",
    "@react-email/no-css-display-grid": "warn",
    "@react-email/no-css-display-flex": "warn",
    "@react-email/no-css-conic-gradient": "warn",
    "@react-email/no-css-column-layout-properties": "warn",
    "@react-email/no-css-column-count": "warn",
    "@react-email/no-css-clip-path": "warn",
    "@react-email/no-css-box-sizing": "warn",
    "@react-email/no-css-box-shadow": "warn",
    "@react-email/no-css-border-radius": "warn",
    "@react-email/no-css-border-radius-logical": "warn",
    "@react-email/no-css-border-inline-block": "warn",
    "@react-email/no-css-border-inline-block-longhand": "warn",
    "@react-email/no-css-border-inline-block-individual": "warn",
    "@react-email/no-css-border-image": "warn",
    "@react-email/no-css-block-inline-size": "warn",
    "@react-email/no-css-background-origin": "warn",
    "@react-email/no-css-background-image": "warn",
    "@react-email/no-css-background-clip": "warn",
    "@react-email/no-css-background-blend-mode": "warn",
    "@react-email/no-css-aspect-ratio": "warn",
    "@react-email/no-css-animation": "warn",
    "@react-email/no-css-align-items": "warn",
    "@react-email/no-css-accent-color": "warn"
}
```

Activating or deactivating certain rules as you may prefer.
These rules are mostly generated with metadata taken from [caniemail](https://www.caniemail.com/).

Something important to note is that you create a eslint configuration
specific to *your* `emails` folder since the plugin does not filter out files
for those that are email templates.

## License

MIT License
