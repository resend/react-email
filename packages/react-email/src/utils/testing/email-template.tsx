const TestingEmailTemplate = (props: { name: string }) => {
  return <div>Hello {props.name}!</div>;
};

TestingEmailTemplate.PreviewProps = {
  name: 'Gabriel',
};

export default TestingEmailTemplate;
