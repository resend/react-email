# Inspector API explorations

### 1.

Context provider that determines the current inspector target (doc, text, or a focused node) based on the editor's selection state. Wrap all inspector UI in this.

```tsx
<Inspector.Root>
  {/* inspector UI goes here */}
</Inspector.Root>
```

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

### 2.

this above only works if we have a preset json for the fields that go in each
section and that would be unflexible, as in the user wouldn't be able to define
the fields they want customizable per node that they create. the only way we
could make ti custmoizable is if we were to move thse sections to the nodes
thsemelves, but I don't feel that's a good API.

a new option that comes to my mind that would solve the flexibliity problem,
and also give a good DX:

```tsx
<Inspector>{(
  context: 
    | {
      target: 'doc',
      styles: PanelGroup[];
      setGlobalStyle: (classReference: string, property: string, value: unknown) => void,
    } 
    | { target: 'text' } 
    | {
      target: FocusedNode, 
      setStyles: (property: string, changes: Record<string, unknown>) => void,
      setAttribute: (name: string, value: unknown) => void,
    }
) => {
  if (target === 'doc') {
    return /* ... */;
  } 

  if (target === 'text') {
    return /* ... */;
  }

  return /* ... */;
}}</Inspector>
```

only problem is I don't fully understand if `setAttribute` would suffice for the
style updates caused by the inspector.

Renders the appropriate built-in input component for a single field based on
its `type`. Useful as a fallback when you only want to customize certain
fields.

## Breadcrumb API

### 1.

Renders the node hierarchy path with clickable items for navigating the
editor's selection.

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

### 2.

Having a `props` is not really clear on what it does, I think we'd should
rather have a function that can be called from the onClick when the user wants
to.


```tsx
<Inspector.Root>
  <nav>
    <ol>
      <Inspector.Breadcrumb>
        {/* the doc (or Layout) is also a segment here */
        {(segments) => segments.map((segment, i) => (
          <>
            {i !== 0 ? <span>/</span> : null}
            <li onClick={() => segment.focus()}>
              {segment.type}
            </li>
          </>
        ))}
      </Inspector.Breadcrumb>
    </ol>
  </nav>
</Inspector.Root>
```
