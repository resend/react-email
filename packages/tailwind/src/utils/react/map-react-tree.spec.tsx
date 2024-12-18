import { render } from '@react-email/render';
import { mapReactTree } from './map-react-tree';

describe('mapReactTree()', () => {
  it('process should be called for all normal elements', async () => {
    const node = (
      <>
        <div>This is a div</div>
        <span>Interesting span</span>
        <h1>header 1</h1>
      </>
    );

    const process = vi.fn((n: React.ReactNode) => n);

    const result = mapReactTree(node, process);

    await render(<>{result}</>);

    expect(process).toHaveBeenCalledTimes(7);
  });

  it('process should be called for all elements with custom components', async () => {
    const Custom = (props: { children: React.ReactNode }) => {
      return (
        <>
          <div>
            <span>
              <h1>Testing heading</h1> surrounded span
            </span>
            surrounded by div
          </div>

          {props.children}
        </>
      );
    };
    const node = (
      <>
        <div>This is a div</div>
        <span>Interesting span</span>
        <h1>header 1</h1>

        <Custom>
          <h1>Well, hello friends!</h1>
        </Custom>
      </>
    );

    const process = vi.fn((n: React.ReactNode) => n);

    const result = mapReactTree(node, process);

    await render(<>{result}</>);

    expect(process).toHaveBeenCalledTimes(17);
  });
});
