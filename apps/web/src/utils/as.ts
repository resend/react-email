export type As<
  DefaultTag extends React.ElementType,
  T1 extends React.ElementType,
  T2 extends React.ElementType = T1,
  T3 extends React.ElementType = T1,
  T4 extends React.ElementType = T1,
  T5 extends React.ElementType = T1,
> =
  | (React.ComponentPropsWithRef & {
      as?: DefaultTag;
    })
  | (React.ComponentPropsWithRef & {
      as: T1;
    })
  | (React.ComponentPropsWithRef & {
      as: T2;
    })
  | (React.ComponentPropsWithRef & {
      as: T3;
    })
  | (React.ComponentPropsWithRef & {
      as: T4;
    })
  | (React.ComponentPropsWithRef & {
      as: T5;
    });
