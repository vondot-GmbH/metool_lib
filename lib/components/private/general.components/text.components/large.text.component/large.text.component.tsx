import classNames from "classnames";
import styles from "./large.text.component.module.scss";

interface LargeTextProps {
  children: React.ReactNode;
  className?: string;
}

const LargeText = ({ children, className }: LargeTextProps): JSX.Element => {
  const largeTextClassName = classNames(styles.largeText, className);

  return <p className={largeTextClassName}>{children}</p>;
};

export default LargeText;
