import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles';
import {
  ColumnsColumn,
  FourColumns,
  ThreeColumns,
  TwoColumns,
} from './columns';

const columnsStyle = { ...DEFAULT_STYLES.reset };

describe('Column Variants', () => {
  it('renders TwoColumns with 2 column children', async () => {
    const Parent = TwoColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent node={{ type: 'twoColumns', attrs: {} }} style={columnsStyle}>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            Column A
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            Column B
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders ThreeColumns with 3 column children', async () => {
    const Parent = ThreeColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent node={{ type: 'threeColumns', attrs: {} }} style={columnsStyle}>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            Column A
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            Column B
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            Column C
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders FourColumns with 4 column children', async () => {
    const Parent = FourColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent node={{ type: 'fourColumns', attrs: {} }} style={columnsStyle}>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            A
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            B
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            C
          </Child>
          <Child node={{ type: 'columnsColumn', attrs: {} }} style={columnsStyle}>
            D
          </Child>
        </Parent>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders ColumnsColumn with custom width', async () => {
    const Component = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{ type: 'columnsColumn', attrs: { width: '200px' } }}
          style={columnsStyle}
        >
          Column content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders column parent with inline styles', async () => {
    const Component = TwoColumns.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{
            type: 'twoColumns',
            attrs: { style: 'padding: 10px;', class: 'custom-class' },
          }}
          style={columnsStyle}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders ColumnsColumn with inline styles', async () => {
    const Component = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Component
          node={{
            type: 'columnsColumn',
            attrs: { style: 'background-color: red;' },
          }}
          style={columnsStyle}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
