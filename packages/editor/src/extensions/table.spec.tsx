import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Table, TableCell, TableHeader, TableRow } from './table';

const tableStyle = { ...DEFAULT_STYLES.reset };
const tableRowStyle = { ...DEFAULT_STYLES.reset };
const tableCellStyle = { ...DEFAULT_STYLES.reset };
const tableHeaderStyle = { ...DEFAULT_STYLES.reset };

describe('Table Nodes', () => {
  it('renders Table React Email properly', async () => {
    const Component = Table.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'table',
            attrs: {
              alignment: 'center',
              width: '600',
            },
          }}
          style={tableStyle}
          extension={Table}
        >
          Table content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders TableRow React Email properly', async () => {
    const Component = TableRow.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'tableRow',
            attrs: {},
          }}
          style={tableRowStyle}
          extension={TableRow}
        >
          Row content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders TableCell React Email properly', async () => {
    const Component = TableCell.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'tableCell',
            attrs: {
              alignment: 'left',
            },
          }}
          style={tableCellStyle}
          extension={TableCell}
        >
          Cell content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders TableHeader React Email properly', async () => {
    const Component = TableHeader.config.renderToReactEmail;
    expect(Component).toBeDefined();
    expect(
      await render(
        <Component
          node={{
            type: 'tableHeader',
            attrs: {
              alignment: 'left',
              scope: 'col',
            },
          }}
          style={tableHeaderStyle}
          extension={TableHeader}
        >
          Header content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });

  it('renders TableHeader without scope when not specified', async () => {
    const Component = TableHeader.config.renderToReactEmail;
    expect(
      await render(
        <Component
          node={{
            type: 'tableHeader',
            attrs: {},
          }}
          style={tableHeaderStyle}
          extension={TableHeader}
        >
          Header content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
