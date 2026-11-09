import { PropsPanelProvider } from '../../contexts/props-panel';

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PropsPanelProvider>{children}</PropsPanelProvider>;
}
