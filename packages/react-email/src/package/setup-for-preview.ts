export type Control<ValueType> =
  | {
      type: 'number';
      defaultValue: ValueType;
    }
  | {
      type: 'email' | 'text';
      defaultValue: string;
    }
  | {
      type: 'checkbox';
      defaultValue: boolean;
    }
  | {
      type: 'select';
      options: { name: string; value: ValueType }[];
      defaultValue: ValueType;
    };

type SafeControl<ValueType> = ValueType extends string
  ? Control<ValueType> & { type: 'email' | 'text' | 'select' }
  : ValueType extends number
    ? Control<ValueType> & { type: 'number' }
    : ValueType extends boolean
      ? Control<ValueType> & { type: 'checkbox' }
      : Control<ValueType>;

export type Controls<Props extends object = Record<string, unknown>> = {
  [K in keyof Props]?: SafeControl<Props[K]>;
};

export const setupForPreview = <Props extends object>(
  component: {
    (props: Props): React.ReactNode;
    controls?: Controls<Props>;
  },
  controls: Controls<Props>,
) => {
  component.controls = controls;
};
