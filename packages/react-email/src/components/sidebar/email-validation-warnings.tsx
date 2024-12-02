import type { EmailValidationWarning } from '../../actions/get-warnings-for-email';

interface WarningsViewProps {
  warnings: EmailValidationWarning[];
}

export const WarningsView = ({ warnings }: WarningsViewProps) => {
  return (
    <div className="overflow-y-auto flex flex-col w-[calc(100vw-36px)] h-full lg:w-full lg:min-w-[231px] lg:max-w-[231px]">
      {warnings.length > 0 ? (
        <ul className="w-full h-full list-none pl-0">
          {warnings.map((warning) => (
            <li
              className="flex px-4 py-2 text-xs items-center bg-transparent hover:bg-slate-6"
              key={warning.line}
            >
              {warning.message}{' '}
              <span className="ml-auto text-gray-400">
                {warning.line}:{warning.column}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-lg w-full text-center text-white/90 font-bold">
          No warnings
        </div>
      )}
    </div>
  );
};
