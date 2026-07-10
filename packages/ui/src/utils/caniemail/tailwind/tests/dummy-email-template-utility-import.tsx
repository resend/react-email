import { Tailwind } from 'react-email';
import customUtility from './dummy-email-template-utility-import.css?inline';

export default function EmailTemplate() {
  return (
    <Tailwind utility={customUtility}>
      <div className="badge" />
    </Tailwind>
  );
}
