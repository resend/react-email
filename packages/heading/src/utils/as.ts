export type As<
  DefaultTag extends React.ElementType,
  T1 extends React.ElementType,
  T2 extends React.ElementType = T1,
  T3 extends React.ElementType = T1,
  T4 extends React.ElementType = T1,
  T5 extends React.ElementType = T1
> =
  | (React.ComponentPropsWithRef<DefaultTag> & {
      as?: DefaultTag;
    })
  | (React.ComponentPropsWithRef<T1> & {
      as: T1;
    })
  | (React.ComponentPropsWithRef<T2> & {
      as: T2;
    })
  | (React.ComponentPropsWithRef<T3> & {
      as: T3;
    })
  | (React.ComponentPropsWithRef<T4> & {
      as: T4;
    })
  | (React.ComponentPropsWithRef<T5> & {
      as: T5;
    });
