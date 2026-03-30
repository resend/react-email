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
        <Parent
          node={{ type: 'twoColumns', attrs: {} }}
          style={columnsStyle}
          extension={TwoColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
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
        <Parent
          node={{ type: 'threeColumns', attrs: {} }}
          style={columnsStyle}
          extension={ThreeColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            Column B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
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
        <Parent
          node={{ type: 'fourColumns', attrs: {} }}
          style={columnsStyle}
          extension={FourColumns}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
            C
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            style={columnsStyle}
            extension={ColumnsColumn}
          >
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
          extension={ColumnsColumn}
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
          extension={TwoColumns}
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
          extension={ColumnsColumn}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
