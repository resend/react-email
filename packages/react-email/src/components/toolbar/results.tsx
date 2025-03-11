import { cn } from '../../utils';

export const Results = ({
  children,
  className,
  ...props
}: React.ComponentProps<'table'>) => {
  return (
    <table
      className={cn(
        'group relative w-full border-collapse text-left text-slate-10 text-xs',
        className,
      )}
    >
      <tbody>{children}</tbody>
    </table>
  );
};

Results.Row = ({
  children,
  className,
  ...props
}: React.ComponentProps<'tr'>) => {
  return (
    <tr
      className={cn(
        'border-collapse align-bottom border-slate-6 border-b',
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

Results.Column = ({
  children,
  className,
  ...props
}: React.ComponentProps<'td'>) => {
  return (
    <td className={cn('py-1 align-bottom font-medium', className)} {...props}>
      {children}
    </td>
  );
};
