'use client';

import styles from '@components/AS400.module.scss';

import * as React from 'react';

import Card from '@components/Card';
import Row from '@components/Row';
import RowSpaceBetween from '@components/RowSpaceBetween';
import Table from '@components/Table';
import TableRow from '@components/TableRow';
import TableColumn from '@components/TableColumn';
import TextArea from '@components/TextArea';

type AS400Props = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

const AS400 = () => {
  return (
    <>
      <Card>
        <RowSpaceBetween>
          <span style={{ minWidth: `10ch` }}>COMMAND</span>
          <span style={{ minWidth: `10ch` }}>Menu : ⌃+T</span>
          <span style={{ minWidth: `10ch`, textAlign: 'right' }}>IND333</span>
        </RowSpaceBetween>
        <Table style={{ minWidth: '71ch' }}>
          <TableRow style={{ textAlign: 'center' }}>
            <TableColumn>F O O D&nbsp;&nbsp;D I S T R I B U T I O N</TableColumn>
          </TableRow>
          <TableRow style={{ textAlign: 'center' }}>
            <TableColumn>- - Advance Sales Menu - -</TableColumn>
          </TableRow>
        </Table>
        <br />
        <Table style={{ minWidth: '71ch' }}>
          <TableRow>
            <TableColumn>1. Order Entry</TableColumn>
            <TableColumn>13. Create Texlon/MSI Orders</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>2. Route Recap</TableColumn>
            <TableColumn>14. Create Posting w/Scanner</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>3. Staging Ticket</TableColumn>
            <TableColumn></TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>4. Picking Ticket</TableColumn>
            <TableColumn>15. Order List</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>5. Order Posting</TableColumn>
            <TableColumn>16. Order Maintenance</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>6. Bill of Lading</TableColumn>
            <TableColumn>16. Order Hold</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>7. Load Sheets</TableColumn>
            <TableColumn>18. Order Release</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>8. Order Entry Invoicing</TableColumn>
            <TableColumn>19. Order Cancellation</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>9. Order Entry Confirmation</TableColumn>
            <TableColumn>20. Order Change</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>10. Order Entry Processing</TableColumn>
            <TableColumn>21. Unsettled Invoice Report</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>&nbsp;</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>11. Credit Memo Entry</TableColumn>
            <TableColumn>- - Transaction Processing Menu - -</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>12. Credit Memo Processing</TableColumn>
            <TableColumn>- - Main Menu - -</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn></TableColumn>
            <TableColumn>24. Sign Off</TableColumn>
          </TableRow>
        </Table>
        <br />
        <br />
        <Table style={{ minWidth: '71ch' }}>
          <TableRow>
            <TableColumn>Ready for option number or command</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>
              <TextArea isBlink />
            </TableColumn>
          </TableRow>
        </Table>
      </Card>
      <br />
      <Card>
        <Table style={{ minWidth: '71ch' }}>
          <TableRow>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;Option: 1337...&nbsp;&nbsp; Copy: US&nbsp;&nbsp;&nbsp;&nbsp;ITEM ACTIVITY INQUIRY</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>IND333</TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Regn: NW</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}></TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;Item #: 6666666</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}></TableColumn>
          </TableRow>
          <TableRow>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GMO HONEYDEW MELON USDA PRIME 72 OZ</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}></TableColumn>
          </TableRow>
        </Table>
        <br />
        <br />
        <Table style={{ minWidth: '71ch' }}>
          <TableRow>
            <TableColumn>Warehouse</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>On Hand</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>On Order</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>In Transit</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>Total</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>W/S</TableColumn>
            <TableColumn style={{ textAlign: 'right' }}>Sell</TableColumn>
          </TableRow>

          <TableRow>
            <TableColumn>&nbsp;</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;01 SEATTLE</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;02 PORTLAND</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;06 TUKWILA</TableColumn>
            <TableColumn>89</TableColumn>
            <TableColumn>162</TableColumn>
            <TableColumn>162</TableColumn>
            <TableColumn>413</TableColumn>
            <TableColumn>7.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;08 KIRKLAND</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;09 ALOHA</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;10 ANCHORAGE</TableColumn>
            <TableColumn>107</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>324</TableColumn>
            <TableColumn>511</TableColumn>
            <TableColumn>5.5</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;13 SILVERDALE</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;17 EUGENE</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;61 FEDERAL WAY</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;63 NE ANCHORAGE</TableColumn>
            <TableColumn>229</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>162</TableColumn>
            <TableColumn>391</TableColumn>
            <TableColumn>4.5</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;64 TUMWATER</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;67 MISSOULA</TableColumn>
            <TableColumn>201</TableColumn>
            <TableColumn>648</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>849</TableColumn>
            <TableColumn>5.2</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>

          <TableRow style={{ textAlign: 'right' }}>
            <TableColumn>&nbsp;&nbsp;&nbsp;&nbsp;95 TACOMA</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>0</TableColumn>
            <TableColumn>.0</TableColumn>
            <TableColumn>8.88</TableColumn>
          </TableRow>
        </Table>
        <br />
        <br />
        <Table style={{ minWidth: '71ch' }}>
          <TableRow>
            <TableColumn>CF-3 Exit&nbsp;&nbsp;&nbsp;&nbsp;CF7-Next Item&nbsp;&nbsp;&nbsp;&nbsp;CF21-Print Report</TableColumn>
          </TableRow>
        </Table>
      </Card>
    </>
  );
};

AS400.displayName = 'AS400';

export default AS400;
