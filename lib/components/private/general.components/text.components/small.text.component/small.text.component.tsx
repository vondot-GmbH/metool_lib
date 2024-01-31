import classNames from "classnames";
import styles from "./small.text.component.module.scss";

interface SmallTextProps {
  children: React.ReactNode;
  className?: string;
}

const SmallText = ({ children, className }: SmallTextProps): JSX.Element => {
  const smallTextClassName = classNames(styles.smallText, className);

  return <p className={smallTextClassName}>{children}</p>;
};

export default SmallText;
