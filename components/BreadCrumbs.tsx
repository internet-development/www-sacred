import styles from '@components/BreadCrumbs.module.scss';

import * as React from 'react';

interface BreadCrumbsItem {
  url?: string;
  name: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbsItem[];
}

const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className={styles.root}>
      {items.map((item, index) => {
        const linkElement = (
          <a className={styles.link} href={item.url} target="_blank" tabIndex={0} role="link">
            {item.name}
          </a>
        );

        return (
          <span className={styles.line} key={index}>
            {index === items.length - 1 ? <span>{linkElement}</span> : linkElement}
            {index < items.length - 1 && <span className={styles.symbol}> ❯ </span>}
          </span>
        );
      })}
    </nav>
  );
};

export default BreadCrumbs;
