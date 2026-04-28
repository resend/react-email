import { Body } from '../../../body/index.js';
import { Button } from '../../../button/index.js';
import { CodeBlock } from '../../../code-block/index.js';
import { CodeInline } from '../../../code-inline/index.js';
import { Container } from '../../../container/index.js';
import { Heading } from '../../../heading/index.js';
import { Hr } from '../../../hr/index.js';
import { Img } from '../../../img/index.js';
import { Link } from '../../../link/index.js';
import { Preview } from '../../../preview/index.js';
import { Text } from '../../../text/index.js';

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
  Text,
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
