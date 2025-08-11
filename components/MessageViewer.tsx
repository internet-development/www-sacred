import styles from '@components/MessageViewer.module.scss';

export default function MessageViewer(props) {
  return (
    <div className={styles.message}>
      <div className={styles.left}>
        <div className={styles.bubble}>{props.children}</div>
      </div>
      <div className={styles.right}>
        <figure className={styles.triangle} />
      </div>
    </div>
  );
}
