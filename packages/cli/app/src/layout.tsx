/* eslint-disable import/first */
import './css/globals.css';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-dark-bg text-dark-bg-text font-sans">
    <div className={'font-sans'}>{children}</div>
  </div>
);
