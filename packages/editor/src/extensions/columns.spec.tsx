import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import {
  ColumnsColumn,
  FourColumns,
  ThreeColumns,
  TwoColumns,
} from './columns';

describe('Column Variants', () => {
  it('renders TwoColumns with 2 column children', async () => {
    const Parent = TwoColumns.config.renderToReactEmail;
    const Child = ColumnsColumn.config.renderToReactEmail;

    expect(
      await render(
        <Parent
          node={{ type: 'twoColumns', attrs: {} }}
          styles={{ ...RESET_THEMES.basic }}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            Column A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            Column B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
        >
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            A
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            B
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
          >
            C
          </Child>
          <Child
            node={{ type: 'columnsColumn', attrs: {} }}
            styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
        >
          Content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
