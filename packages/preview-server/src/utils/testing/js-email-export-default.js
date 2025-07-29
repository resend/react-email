// A JavaScript email component with ES6 export default
import { Button, Html } from '@react-email/components';

function Email() {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: '#000', color: '#fff', padding: '12px 20px' }}
      >
        Click me
      </Button>
    </Html>
  );
}

export default Email;
