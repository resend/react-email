// A simple JavaScript email component
const React = require('react');
const { Html, Button } = require('@react-email/components');

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

module.exports = Email;
