import styles from '@components/Avatar.module.scss';

import * as React from 'react';

function Avatar(props) {
  const backgroundStyle = props.src ? {  backgroundImage: `url(${props.src})` } : { };

  if (!props.children) {
    return <figure className={styles.root} style={{ ...props.style, ...backgroundStyle }} />;
  }

  return (
    <div className={styles.parent} {...props}>
      <figure className={styles.root} style={backgroundStyle} />
      <span className={styles.right}>
        {props.children}
      </span>
    </div>
  );
}

export default Avatar;