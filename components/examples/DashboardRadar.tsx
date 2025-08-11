import styles from '@components/examples/DashboardRadar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import ActionButton from '@components/ActionButton';
import ButtonGroup from '@components/ButtonGroup';
import Card from '@components/Card';
import RowSpaceBetween from '@components/RowSpaceBetween';
import SidebarLayout from '@components/SidebarLayout';
import Sphere from '@components/svg/Sphere';

const RadarMarker = (props) => {
  return (
    <div className={styles.cross}>
      <RowSpaceBetween>
        <div className={Utilities.classNames(styles.square, styles.nw)} />
        <div className={Utilities.classNames(styles.square, styles.ne)} />
      </RowSpaceBetween>
      <RowSpaceBetween>
        <div className={Utilities.classNames(styles.square, styles.sw)} />
        <div className={Utilities.classNames(styles.square, styles.se)} />
      </RowSpaceBetween>
    </div>
  );
};

const DashboardRadar = (props) => {
  return (
    <div className={styles.root}>
      <SidebarLayout
        isReversed
        sidebar={
          <Card>
            <div className={styles.customSidebar}>
              <div className={styles.customTop}>
                TIME FROM
                <ActionButton style={{ width: '100%' }}>11:11:11:11</ActionButton>
                <br />
                <br />
                PRESENT
                <br />
                P.O.R.
                <br />
                NOSTROMO
                <br />
              </div>
              <div className={styles.customBottom}>
                HEADING
                <br />
                <ButtonGroup isFull items={[{ body: 'N .36' }, { body: 'E .18' }]} />
                <br />
                GROUND
                <br />
                <ActionButton rootStyle={{ width: '100%' }}>SPEED 78.26</ActionButton>
                <br />
                CONDITION
                <br />
                CODE
                <br />
                <ActionButton style={{ width: '100%' }}>16 S=C75C</ActionButton>
                <ActionButton>PAST=8</ActionButton>
                <br />
                <br />
                <ActionButton rootStyle={{ width: '100%' }}>System #4</ActionButton>
                <br />
                <br />
                AUTODECOUNT
                <br />
                <br />
                <ActionButton rootStyle={{ width: '100%', textAlign: 'right' }}>3454.94#</ActionButton>
              </div>
            </div>
          </Card>
        }
        defaultSidebarWidth={19}
      >
        <Card>
          <RowSpaceBetween>
            <span style={{ flexShrink: 0 }}>DEORBITAL DESCENT</span>
            <span style={{ minWidth: '10%', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <span>
                <ActionButton>COMMENCE FINAL</ActionButton>
                <br />
                <ActionButton>SYSTEM :0L: 76.75 :08:</ActionButton>
              </span>
            </span>
          </RowSpaceBetween>
        </Card>
        <br />
        <Card>
          <RowSpaceBetween style={{ position: 'absolute', top: 0, left: `6ch`, right: `6ch` }}>
            <RadarMarker />
            <RadarMarker />
          </RowSpaceBetween>
          <div className={styles.customContent}>
            <Sphere style={{ transform: 'translateX(24ch) rotateZ(40deg)' }} />
          </div>
          <RowSpaceBetween style={{ position: 'absolute', bottom: `calc(var(--theme-line-height-base) * (var(--font-size) * 0.5))`, left: `6ch`, right: `6ch` }}>
            <RadarMarker />
            <RadarMarker />
          </RowSpaceBetween>
        </Card>
      </SidebarLayout>
    </div>
  );
};

export default DashboardRadar;
