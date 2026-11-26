import { Html, Tailwind, Text } from 'react-email';

export default function Welcome() {
  return (
    <Html>
      <Tailwind>
        <Text className="text-blue-600">Hello</Text>
      </Tailwind>
    </Html>
  );
}
