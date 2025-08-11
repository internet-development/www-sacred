'use client';

import styles from '@components/examples/Denabase.module.scss';

import * as React from 'react';

import ActionButton from '@components/ActionButton';
import Card from '@components/Card';
import Divider from '@components/Divider';
import Row from '@components/Row';
import RowSpaceBetween from '@components/RowSpaceBetween';
import SidebarLayout from '@components/SidebarLayout';

const Denabase = (props) => {
  return (
    <>
      <Card style={{ overflowWrap: 'break-word' }}>
        <Row>
          <RowSpaceBetween>
            <ActionButton>TR5342120027455925897981</ActionButton>
            <ActionButton>02.14.2021</ActionButton>
          </RowSpaceBetween>
          <Divider type="GRADIENT" />
          <div className={styles.dna}>
            T-CA-AA-AA-TA-TC-GG-GC-AC-AT-TA-TT-TA-TT-TG-CC-GC-TC-GG-GA-AG-TA-GA-A
            <br />
            A-TG-GT-AC-AT-GT-GT-TT-TA-TG-AT-TT-CT-CG-CA-GT-GA-AA-AA-GC-AA-CG-AA-C
            <br />
            C-TC-GC-CC-TT-AG-AT-TC-TA-TA-GC-TG-CT-CT-GA-GA-CC-GC-AC-TG-GC-AA-GC-A
            <br />
            G-AA-AC-TC-CG-CA-TT-CA-GG-CA-GT-CC-TC-CA-TG-CA-CT-TC-CT-GC-CT-GT-CT-G
            <br />
            C-TG-AA-CC-TA-TT-AT-TA-GA-GA-TG-GA-CT-GC-AG-TT-CT-CA-AT-CA-CA-CG-GA-T
            <br />
            C-TG-AT-AC-CT-GC-TG-GT-AT-GT-TC-CT-GA-TA-CC-CA-CA-GA-CA-GC-GC-CC-GA-A
            <br />
            T-TT-TG-GC-AA-CC-GA-AC-TT-CT-CA-AC-AA-AA-CC-GC-CT-AG-TT-GC-TA-AT-TT-G
            <br />
            G-TG-AC-CT-GA-CT-GA-AT-TG-TC-AT-TA-AA-CA-CT-CC-TG-CT-AA-GA-TG-CG-AA-G
            <br />
            C-TA-TT-AT-AG-TG-TT-TT-GT-AC-AG-GC-TA-TT-TT-GC-GT-GA-AA-CG-CA-AA-CG-C
            <br />
            G-TT-GC-AT-TT-CA-GA-AT-TC-CG-TG-CA-TA-GT-TA-TC-TC-AT-GC-CG-TG-CT-CT-T
            <br />
            G-AT-TA-TT-GA-CA-TA-TG-CA-GT-TC-GT-CC-TA-AT-CC-GC-GC-CT-GG-TC-TT-TA-G
            <br />
            T-CA-CT-AA-CC-GA-CC-CT-TA-GT-AT-TG-TT-CT-CT-CA-AC-AA-AA-TG-TG-TT-AA-A
            <br />
            C-CG-GC-AT-AA-TC-TG-GT-GA-TC-GG-GA-GA-TC-CA-GA-GA-AA-CA-CA-CC-TT-GG-G
            <br />
            C-TA-GA-TG-CC-CT-AC-AT-TA-GA-TA-AG-GG-GT-CT-AT-AC-GG-GC-GG-GG-TT-AG-T
            <br />
            A-CA-CC-TT-GA-GC-GT-AT-AG-GA-GA-GT-AA-CG-AG-GT-GG-TT-GT-CG-TG-GG-AG-G
            <br />
            A-GG-AG-TA-TG-TT-CT-CC-CT-TA-CT-AG-TT-GC-CG-AT-AA-CA-GA-TA-CT-GA-TG-T
            <br />
            C-TG-GT-AA-TT-GC-CA-GT-CA-TG-GT-TG-TA-GT-AG-CC-GG-GA-CC-CG-CA-GT-CT-G
            <br />
            G-GT-AG-CG-CC-TA-AC-AG-AT-AA-GG-GG-GC-CT-AC-TC-CC-GC-CC-TG-GT-CG-GC-C
            <br />
            T-GA-TC-AT-AA-AC-CT-CT-GT-AA-TA-CC-AT-GG-GC-CA-CG-TT-AG-GC-GT-CG-AT-G
            <br />
            C-CG-GA-CC-CA-TA-TC-TT-TA-CA-TC-AT-CT-CT-TT-CA-TA-GA-AG-TA-CC-CA-CT-T
            <br />
          </div>
          <Divider type="GRADIENT" />
        </Row>
      </Card>
      <br />
      <Card>
        <SidebarLayout
          sidebar={
            <Card style={{ padding: `0 0 0 0` }}>
              <br />
              <br />
              <Row style={{ textAlign: 'center' }}>╳</Row>
              <br />
              <br />
            </Card>
          }
          defaultSidebarWidth={19}
        >
          <Card style={{ padding: 0, marginLeft: `1ch`, minWidth: `30ch` }}>
            <br />
            <br />
            <br />
            <br />
            <Row style={{ textAlign: 'right' }}>NO DATA</Row>
          </Card>
        </SidebarLayout>
        <div className={styles.root}>
          <RowSpaceBetween>
            <div className={styles.tag}></div>
            <div className={styles.small}></div>
            <div className={styles.tag}></div>
            <div className={styles.large}></div>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <div className={styles.secondaryTag}>
              <br />
              <br />
            </div>
            <div className={styles.smallSection}>
              <br />
              2181&nbsp;
              <br />
              <br />
            </div>
            <div className={styles.secondaryTag}></div>
            <div className={styles.largeSection}>
              <br />
              UNKNOWN&nbsp;&nbsp;
              <br />
              <br />
            </div>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <div className={styles.tag}></div>
            <div className={styles.smallWithBorder}></div>
            <div className={styles.tag}></div>
            <div className={styles.largeWithBorder}></div>
          </RowSpaceBetween>
          <RowSpaceBetween>
            <div className={styles.secondaryTag}>
              <br />
              <br />
            </div>
            <div className={styles.smallSection}>
              <br />
              DECEASED&nbsp;
              <br />
              <br />
            </div>
            <div className={styles.secondaryTag}></div>
            <div className={styles.largeSection}>
              <br />
              MORRILLCOLE&nbsp;&nbsp;
              <br />
              <br />
            </div>
          </RowSpaceBetween>
          <RowSpaceBetween style={{ position: 'relative' }}>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.box}>╳</div>
            <div className={styles.absoluteTag}></div>
          </RowSpaceBetween>
        </div>
      </Card>
    </>
  );
};

export default Denabase;
