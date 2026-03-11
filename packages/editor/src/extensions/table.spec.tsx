import { render } from '@react-email/components';
import { DEFAULT_STYLES } from '../utils/default-styles.js';
import { Table, TableCell, TableRow } from './table.js';

const tableStyle = { ...DEFAULT_STYLES.reset };
const tableRowStyle = { ...DEFAULT_STYLES.reset };
const tableCellStyle = { ...DEFAULT_STYLES.reset };

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
        >
          Cell content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});
