import classNames from "classnames";
import styles from "./running.text.component.module.scss";

interface RunningTextProps {
  children: React.ReactNode;
  className?: string;
}

const RunningText = ({
  children,
  className,
}: RunningTextProps): JSX.Element => {
  const runningTextClassName = classNames(styles.runningText, className);

  return <p className={runningTextClassName}>{children}</p>;
};

export default RunningText;
