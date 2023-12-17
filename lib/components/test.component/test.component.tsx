import styles from "./test.component.module.scss";

const TestComponent = () => {
  return (
    <div className={styles.testContainer}>
      <div className={styles.text}>Hello from test component</div>
    </div>
  );
};

export default TestComponent;
