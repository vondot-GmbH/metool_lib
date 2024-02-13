import classNames from "classnames";
import styles from "./running.text.component.module.scss";

interface RunningTextProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const RunningText = ({
  children,
  className,
  onClick,
}: RunningTextProps): JSX.Element => {
  const runningTextClassName = classNames(styles.runningText, className);

  return (
    <p className={runningTextClassName} onClick={onClick}>
      {children}
    </p>
  );
};

export default RunningText;
