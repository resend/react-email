import { renderToStaticMarkup as render } from 'react-dom/server';
import { walkElements } from './walk-elements';

describe('walkElements()', () => {
  it('all callbacks should work with normal elements', () => {
    const node = <>
      <div>This is a div</div>
      <span>Interesting span</span>
      <h1>header 1</h1>
    </>;

    const process = vi.fn((n: React.ReactNode) => n);
    const preprocess = vi.fn((n: React.ReactNode) => n);
    const afterAll = vi.fn(() => {
      expect(process).toHaveBeenCalledTimes(7);
      expect(preprocess).toHaveBeenCalledTimes(7);
    });

    const result = walkElements(node, {
      preprocess,
      process,
      afterAll
    });

    render(<>{result}</>);

    expect(afterAll).toHaveBeenCalledOnce();
  });

  it('all callbacks should work with custom components', () => {
    const Custom = (props: { children: React.ReactNode }) => {
      return <>
        <div>
          <span><h1>Testing heading</h1> surrounded span</span>
          surrounded by div
        </div>

        {props.children}
      </>;
    }
    const node = <>
      <div>This is a div</div>
      <span>Interesting span</span>
      <h1>header 1</h1>

      <Custom>
        <h1>Well, hello friends!</h1>
      </Custom>
    </>;

    const process = vi.fn((n: React.ReactNode) => n);
    const preprocess = vi.fn((n: React.ReactNode) => n);
    const afterAll = vi.fn(() => {
      expect(process).toHaveBeenCalledTimes(19);
      expect(preprocess).toHaveBeenCalledTimes(19);
    });

    const result = walkElements(node, {
      preprocess,
      process,
      afterAll
    });

    render(<>{result}</>);

    expect(afterAll).toHaveBeenCalledOnce();
  });
});
