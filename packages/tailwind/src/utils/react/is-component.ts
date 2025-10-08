import { Body } from '@react-email/body';
import { Button } from '@react-email/button';
import { CodeBlock } from '@react-email/code-block';
import { CodeInline } from '@react-email/code-inline';
import { Container } from '@react-email/container';
import { Heading } from '@react-email/heading';
import { Hr } from '@react-email/hr';
import { Img } from '@react-email/img';
import { Link } from '@react-email/link';
import { Preview } from '@react-email/preview';

const componentsToTreatAsElements: React.ReactElement['type'][] = [
  Body,
  Button,
  CodeBlock,
  CodeInline,
  Container,
  Heading,
  Hr,
  Img,
  Link,
  Preview,
];

export const isComponent = (
  element: React.ReactElement,
): element is React.ReactElement<unknown, React.FC<unknown>> => {
  return (
    (typeof element.type === 'function' ||
      // @ts-expect-error - we know this is a component that may have a render function
      element.type.render !== undefined) &&
    !componentsToTreatAsElements.includes(element.type)
  );
};
