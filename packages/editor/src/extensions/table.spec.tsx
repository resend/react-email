import { render } from 'react-email';
import { DEFAULT_STYLES } from '../utils/default-styles';
import { Table, TableCell, TableRow } from './table';

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

  it('renders nested table structure without invalid tr-inside-td nesting', async () => {
    const TableComponent = Table.config.renderToReactEmail;
    const RowComponent = TableRow.config.renderToReactEmail;
    const CellComponent = TableCell.config.renderToReactEmail;

    const html = await render(
      <TableComponent
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
        <RowComponent
          node={{ type: 'tableRow', attrs: {} }}
          style={tableRowStyle}
          extension={TableRow}
        >
          <CellComponent
            node={{ type: 'tableCell', attrs: { alignment: 'left' } }}
            style={tableCellStyle}
            extension={TableCell}
          >
            Cell 1
          </CellComponent>
          <CellComponent
            node={{ type: 'tableCell', attrs: { alignment: 'left' } }}
            style={tableCellStyle}
            extension={TableCell}
          >
            Cell 2
          </CellComponent>
        </RowComponent>
      </TableComponent>,
      { pretty: true },
    );

    expect(html).not.toMatch(/<td[^>]*>\s*<tr/);
    expect(html).toMatch(/<table[^>]*>\s*<tbody>\s*<tr/);
    expect(html).toMatchSnapshot();
  });
});
