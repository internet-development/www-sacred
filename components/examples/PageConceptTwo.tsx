'use client';

import styles from '@components/examples/PageConceptTwo.module.scss';

import * as React from 'react';

import Card from '@components/Card';
import DataTable from '@components/DataTable';
import Dialog from '@components/Dialog';
import MessagesInterface from '@components/examples/MessagesInterface';

const PageConceptTwo = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.top}>
        <div className={styles.heading}>
          <div className={styles.left}>
            <Card title="SECTION A">
              <DataTable
                data={[
                  ['HEADING A', 'HEADING B'],
                  ['DATA 1', 'DATA 2'],
                  ['DATA 3', 'DATA 4'],
                  ['DATA 5', 'DATA 6'],
                  ['DATA 7', 'DATA 8'],
                  ['DATA 9', 'DATA 10'],
                ]}
              />
            </Card>
          </div>
          <div className={styles.center}></div>
          <div className={styles.right}>
            <Card title="SECTION B">
              <DataTable
                data={[
                  ['HEADING A', 'HEADING B'],
                  ['DATA 1', 'DATA 2'],
                  ['DATA 3', 'DATA 4'],
                  ['DATA 5', 'DATA 6'],
                  ['DATA 7', 'DATA 8'],
                  ['DATA 9', 'DATA 10'],
                ]}
              />
            </Card>
          </div>
        </div>

        <div className={styles.middle}>
          <Dialog title="START SIMULATION">
            There are unsaved changes.
            <br />
            Are you sure you want to start a new simulation?
          </Dialog>
        </div>

        <div className={styles.base}>
          <div className={styles.left}>
            <Card title="SECTION C">
              <DataTable
                data={[
                  ['HEADING A', 'HEADING B'],
                  ['DATA 1', 'DATA 2'],
                  ['DATA 3', 'DATA 4'],
                  ['DATA 5', 'DATA 6'],
                  ['DATA 7', 'DATA 8'],
                  ['DATA 9', 'DATA 10'],
                ]}
              />
            </Card>
          </div>
          <div className={styles.center}></div>
          <div className={styles.right}>
            <Card title="SECTION D">
              <DataTable
                data={[
                  ['HEADING A', 'HEADING B'],
                  ['DATA 1', 'DATA 2'],
                  ['DATA 3', 'DATA 4'],
                  ['DATA 5', 'DATA 6'],
                  ['DATA 7', 'DATA 8'],
                  ['DATA 9', 'DATA 10'],
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.col}>
          <Card title="SECTION E">
            <DataTable
              data={[
                ['HEADING A', 'HEADING B'],
                ['DATA 1', 'DATA 2'],
                ['DATA 3', 'DATA 4'],
                ['DATA 5', 'DATA 6'],
                ['DATA 7', 'DATA 8'],
                ['DATA 9', 'DATA 10'],
                ['DATA 11', 'DATA 12'],
              ]}
            />
          </Card>
          <Card title="SECTION F">
            <DataTable
              data={[
                ['HEADING A', 'HEADING B'],
                ['DATA 1', 'DATA 2'],
                ['DATA 3', 'DATA 4'],
                ['DATA 5', 'DATA 6'],
                ['DATA 7', 'DATA 8'],
                ['DATA 9', 'DATA 10'],
                ['DATA 11', 'DATA 12'],
                ['DATA 13', 'DATA 14'],
                ['DATA 15', 'DATA 16'],
                ['DATA 17', 'DATA 18'],
                ['DATA 19', 'DATA 20'],
                ['DATA 21', 'DATA 22'],
                ['DATA 23', 'DATA 24'],
                ['DATA 25', 'DATA 26'],
                ['DATA 27', 'DATA 28'],
                ['DATA 29', 'DATA 30'],
                ['DATA 31', 'DATA 32'],
              ]}
            />
          </Card>
        </div>
        <div className={styles.col}>
          <Card title="SECTION G">
            <DataTable
              data={[
                ['HEADING A', 'HEADING B'],
                ['DATA 1', 'DATA 2'],
                ['DATA 3', 'DATA 4'],
                ['DATA 5', 'DATA 6'],
                ['DATA 7', 'DATA 8'],
                ['DATA 9', 'DATA 10'],
                ['DATA 11', 'DATA 12'],
              ]}
            />
          </Card>
          <Card title="SECTION H">
            <DataTable
              data={[
                ['HEADING A', 'HEADING B'],
                ['DATA 1', 'DATA 2'],
                ['DATA 3', 'DATA 4'],
                ['DATA 5', 'DATA 6'],
                ['DATA 7', 'DATA 8'],
                ['DATA 9', 'DATA 10'],
                ['DATA 11', 'DATA 12'],
                ['DATA 13', 'DATA 14'],
                ['DATA 15', 'DATA 16'],
                ['DATA 17', 'DATA 18'],
                ['DATA 19', 'DATA 20'],
                ['DATA 21', 'DATA 22'],
                ['DATA 23', 'DATA 24'],
                ['DATA 25', 'DATA 26'],
                ['DATA 27', 'DATA 28'],
                ['DATA 29', 'DATA 30'],
                ['DATA 31', 'DATA 32'],
              ]}
            />
          </Card>
        </div>
        <div className={styles.col3}>
          <Card title="SECTION I">
            <MessagesInterface />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PageConceptTwo;
