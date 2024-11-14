import styles from '@components/BreadCrumbs.module.scss';

import * as React from 'react';

interface BreadcrumbItem {
  url: string;
  name: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb" className={styles.root}>
      {items.map((item, index) => {
        const linkElement = (
          <a
            className={styles.link}
            href={item.url}
            target="_blank"
            tabIndex={0}
            role="link"
          >
            {item.name}
          </a>
        );

        return (
          <span className={styles.line} key={index}>
            {index === items.length - 1 ? (
              <strong>{linkElement}</strong>
            ) : (
              linkElement
            )}
            {index < items.length - 1 && (
              <span className={styles.symbol}> ❯ </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;