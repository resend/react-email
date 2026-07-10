import { Tailwind } from 'react-email';

const customUtility = `
  .badge {
    background: #fef3c7;
    padding: 4px;
  }
`;

export default function EmailTemplate() {
  return (
    <Tailwind utility={customUtility}>
      <div className="badge" />
    </Tailwind>
  );
}
