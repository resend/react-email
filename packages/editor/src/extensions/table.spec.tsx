import { render } from '@react-email/components';
import { RESET_THEMES } from '../plugins/theming/themes';
import { Table, TableCell, TableRow } from './table';

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
          styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
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
          styles={{ ...RESET_THEMES.basic }}
        >
          Cell content
        </Component>,
        { pretty: true },
      ),
    ).toMatchSnapshot();
  });
});

