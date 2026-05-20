import { Tailwind } from 'react-email';
import customTheme from './dummy-email-template-theme-import.css?inline';

export default function EmailTemplate() {
  return (
    <Tailwind theme={customTheme}>
      <div className="bg-brand" />
    </Tailwind>
  );
}
