import { cn } from '../../utils';

export const Results = ({
  children,
  className,
  ...props
}: React.ComponentProps<'table'>) => {
  return (
    <table
      {...props}
      className={cn(
        'group relative w-full border-collapse text-left text-slate-10 text-sm',
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
        'border-collapse align-bottom border-slate-6 border-b last:border-b-0',
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
    <td
      className={cn('py-1.5 align-bottom font-regular', className)}
      {...props}
    >
      {children}
    </td>
  );
};
