/* eslint-disable import/first */
import './globals.css';

export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-black text-slate-12 font-sans">
    <div className={'font-sans'}>{children}</div>
  </div>
);
