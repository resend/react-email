# Inspector API

## Components

### `Inspector.Root`

Context provider that determines the current inspector target (doc, text, or a focused node) based on the editor's selection state. Wrap all inspector UI in this.

```tsx
<Inspector.Root>
  {/* inspector UI goes here */}
</Inspector.Root>
```

### `Inspector.Panel`

Render-props component. Calls its children function **once per group** with the group data (`PanelGroup`) and its fields (`PanelInputWithHandler[]`).

```tsx
<Inspector.Panel>
  {(group, fields) => (
    <>
      <h2>{group.title}</h2>
      {fields.map((field) => (
        <input
          key={field.prop}
          type={field.type}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
        />
      ))}
    </>
  )}
</Inspector.Panel>
```

this above only works if we have a preset json for the fields that go in each
section and that would be unflexible, as in the user wouldn't be able to define
the fields they want customizable per node that they create. the only way we
could make ti custmoizable is if we were to move thse sections to the nodes
thsemelves, but I don't feel that's a good API.

a new option that comes to my mind that would solve the flexibliity problem,
and also give a good DX:

```tsx
<Inspector>{(target: 'doc' | 'text' | FocusedNode | null, setAttribute: (name: string, value: unknown)) => {
  if (target === 'doc') {
    return <></>;
  }
}}</Inspector>
```

### `Inspector.DefaultField`

Renders the appropriate built-in input component for a single field based on its `type`. Useful as a fallback when you only want to customize certain fields.

```tsx
<Inspector.Panel>
  {(group, fields) => (
    <div>
      <h2>{group.title}</h2>
      {fields.map((field) => (
        <Inspector.DefaultField key={field.prop} {...field} />
      ))}
    </div>
  )}
</Inspector.Panel>
```

### `Inspector.Breadcrumb`

Renders the node hierarchy path with clickable items for navigating the editor's selection.

```tsx
<Inspector.Root>
  <nav>
    <ol>
      <Inspector.Breadcrumb>
        {/* the doc (or Layout) is also a segment here */
        {(segments) => segments.map((segment, i) => (
          <>
            {i !== 0 ? <span>/</span> : null}
            <li {...segment.props}>
              {segment.type}
            </li>
          </>
        ))}
      </Inspector.Breadcrumb>
    </ol>
  </nav>
</Inspector.Root>
```

---

## Hooks

### `useInspectorFields()`

Returns `InspectorPanelEntry[] | null` — the raw data that `Inspector.Panel` uses internally. Use this if you need the data without the render-props wrapper.

```tsx
const entries = useInspectorFields();

entries?.map(({ group, fields }) => {
  // group: PanelGroup — id, title, classReference, headerSlot, inputs
  // fields: PanelInputWithHandler[] — same as group.inputs but with onChange attached
});
```

---

## Types

### `PanelGroup` (from `email-theming/types`)

```ts
interface PanelGroup {
  id?: PanelSectionId;
  title: string;
  headerSlot?: React.ReactNode;
  classReference?: KnownThemeComponents;
  inputs: Omit<PanelInputProperty, 'category'>[];
}
```

### `PanelInputWithHandler`

Extends the existing `PanelGroup['inputs'][number]` with `onChange`:

```ts
type PanelInputWithHandler = PanelGroup['inputs'][number] & {
  onChange: (value: string | number) => void;
};
```

Each field has:

| Prop             | Type                           | Description                         |
| ---------------- | ------------------------------ | ----------------------------------- |
| `prop`           | `KnownCssProperties`          | CSS property name (e.g. `fontSize`) |
| `type`           | `'text' \| 'number' \| 'color' \| 'select' \| 'textarea'` | Input type          |
| `value`          | `string \| number`            | Current value                       |
| `onChange`       | `(value: string \| number) => void` | Update callback                |
| `label`          | `string`                       | Display label                      |
| `unit?`          | `'px' \| '%'`                  | Unit for number inputs             |
| `options?`       | `Record<string, string>`       | Options for select inputs          |
| `placeholder?`   | `string`                       | Placeholder text                   |
| `classReference?`| `KnownThemeComponents`         | Theme component (e.g. `'body'`)    |

### `InspectorPanelEntry`

```ts
interface InspectorPanelEntry {
  group: PanelGroup;
  fields: PanelInputWithHandler[];
}
```

---

## Full Example

```tsx
import { Inspector } from './inspector';

function MyInspectorSidebar() {
  return (
    <Inspector.Root>
      <nav>
        <ol>
          <Inspector.Breadcrumb>
            {/* the doc (or Layout) is also a segment here */
            {(segments) => segments.map((segment, i) => (
              <>
                {i !== 0 ? <span>/</span> : null}
                <li {...segment.props}>
                  {segment.type}
                </li>
              </>
            ))}
          </Inspector.Breadcrumb>
        </ol>
      </nav>

      <Inspector.Panel>
        {(group, fields) => (
          <section className="border-t border-gray-2 pt-4 mt-4 first:mt-0 first:border-0 first:pt-0">
            <h3 className="font-bold text-white">{group.title}</h3>

            <div className="flex flex-col gap-3 mt-2">
              {fields.map((field) => {
                // Custom rendering for color fields
                if (field.type === 'color') {
                  return (
                    <div key={field.prop}>
                      <label>{field.label}</label>
                      <MyCustomColorPicker
                        value={String(field.value)}
                        onChange={field.onChange}
                      />
                    </div>
                  );
                }

                // Default rendering for everything else
                return <Inspector.DefaultField key={field.prop} {...field} />;
              })}
            </div>
          </section>
        )}
      </Inspector.Panel>
    </Inspector.Root>
  );
}
```

---

## Current Scope

Only the **doc/global** inspector mode is wired up. When the editor selection is on a node or text, `Inspector.Panel` renders nothing. Local and text modes will be added in a future phase.
