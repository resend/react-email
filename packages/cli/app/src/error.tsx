import { useRouteError } from 'react-router-dom';

const { error } = console;

export const Error = () => {
  const err: any = useRouteError();
  error(err);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{err.statusText || err.message}</i>
      </p>
    </div>
  );
};
