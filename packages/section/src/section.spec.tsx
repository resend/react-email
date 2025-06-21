import { render } from '@react-email/render';
import { Section } from './section.js';

describe('Section component', () => {
  it('should render correctly', async () => {
    const actualOutput = await render(
      <Section>
        <div>Test content</div>
      </Section>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should render with style', async () => {
    const actualOutput = await render(
      <Section style={{ backgroundColor: 'red' }}>
        <div>Test content</div>
      </Section>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should render with props', async () => {
    const actualOutput = await render(
      <Section align="center" width="100%">
        <div>Test content</div>
      </Section>,
    );
    expect(actualOutput).toMatchSnapshot();
  });

  it('should use BorderWrapper when both border and borderRadius are present', async () => {
    const actualOutput = await render(
      <Section style={{ 
        border: '1px solid black', 
        borderRadius: '8px',
        color: 'red' 
      }}>
        <div>Test content</div>
      </Section>,
    );
    
    // Should contain the wrapper table with background-color and padding
    expect(actualOutput).toContain('background-color:black');
    expect(actualOutput).toContain('padding:1');
    expect(actualOutput).toContain('border-radius:8px');
    expect(actualOutput).toContain('<div>Test content</div>');
    expect(actualOutput).not.toContain('border:1px solid black');
  });

  it('should not use BorderWrapper when only border is present', async () => {
    const actualOutput = await render(
      <Section style={{ 
        border: '1px solid black',
        color: 'red' 
      }}>
        <div>Test content</div>
      </Section>,
    );
    
    // Should render normally without wrapper
    expect(actualOutput).toContain('border:1px solid black');
    expect(actualOutput).not.toContain('background-color:black');
    expect(actualOutput).not.toContain('padding:1');
  });

  it('should not use BorderWrapper when only borderRadius is present', async () => {
    const actualOutput = await render(
      <Section style={{ 
        borderRadius: '8px',
        color: 'red' 
      }}>
        <div>Test content</div>
      </Section>,
    );
    
    // Should render normally without wrapper
    expect(actualOutput).toContain('border-radius:8px');
    expect(actualOutput).not.toContain('background-color:');
    expect(actualOutput).not.toContain('padding:');
  });

  it('should handle individual border properties with borderRadius', async () => {
    const actualOutput = await render(
      <Section style={{ 
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'red',
        borderRadius: '4px',
        color: 'blue' 
      }}>
        <div>Test content</div>
      </Section>,
    );
    
    expect(actualOutput).toContain('background-color:red');
    expect(actualOutput).toContain('padding:2');
    expect(actualOutput).toContain('border-radius:4px');
    expect(actualOutput).toContain('color:blue');
  });
});
