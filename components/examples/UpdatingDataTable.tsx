'use client';

import * as React from 'react';

import DataTable from '@components/DataTable';

const UpdatingDataTable = (props) => {
  const [tableData, setTableData] = React.useState(props.data);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTableData((prevData) => {
        const header = prevData[0];
        const rows = prevData.slice(1);

        const updatedRows = rows.map((row) => {
          const currentPrice = parseFloat(row[2].replace('$', ''));
          const currentHoldings = parseInt(row[3], 10);
          const priceChangeFactor = 1 + (Math.random() - 0.5) * 0.1;
          const newPrice = currentPrice * priceChangeFactor;
          const holdingsChange = Math.floor((Math.random() - 0.5) * 20);
          const newHoldings = Math.max(1, currentHoldings + holdingsChange);

          return [row[0], row[1], `$${newPrice.toFixed(2)}`, newHoldings.toString()];
        });

        updatedRows.sort((a, b) => {
          const priceA = parseFloat(a[2].replace('$', ''));
          const priceB = parseFloat(b[2].replace('$', ''));
          return priceB - priceA;
        });

        return [header, ...updatedRows];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <DataTable data={tableData} />
    </>
  );
};

export default UpdatingDataTable;
