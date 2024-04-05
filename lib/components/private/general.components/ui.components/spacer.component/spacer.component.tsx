import classNames from "classnames";
import styles from "./spacer.component.module.scss";

interface SpacerProps {
  width?: string;
  className?: string;
}

const Spacer = ({ width, className }: SpacerProps): JSX.Element => {
  const spacerClassName = classNames(styles.spacer, className);

  return <div className={spacerClassName} style={{ width }} />;
};

export default Spacer;
