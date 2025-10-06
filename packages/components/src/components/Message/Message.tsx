import styles from "./Message.module.scss";

export const Message = (props) => {
  return (
    <div className={styles.message}>
      <div className={styles.left}>
        <figure className={styles.triangle} />
      </div>
      <div className={styles.right}>
        <div className={styles.bubble}>{props.children}</div>
      </div>
    </div>
  );
};
