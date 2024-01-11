'use client';
import type { ErrorObject } from '../../../utils/types/error-object';

export const RenderingError = (props: { error: ErrorObject }) => {
  return (
    <>
      <div className="absolute inset-0 z-50 bg-black/80" />
      <div className="md:max-w-[568px] lg:max-w-[968px] absolute left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-red-600 bg-red-500 text-white p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col max-w-full min-w-0 space-y-1.5">
          <h2 className="text-lg font-semibold pb-2 leading-none tracking-tight">
            {props.error.name}: {props.error.message}
          </h2>
          {props.error.stack ? (
            <div className="text-sm p-2 scroll-px-4 overflow-x-auto bg-red-900 rounded-lg text-gray-100">
              <pre className="font-mono w-full min-w-0 leading-7">
                {props.error.stack}
              </pre>
            </div>
          ) : undefined}
        </div>
      </div>
    </>
  );
};
