import classNames from "classnames";
import styles from "./title.text.component.module.scss";

interface TitleTextProps {
  children: React.ReactNode;
  className?: string;
}

const TitleText = ({ children, className }: TitleTextProps): JSX.Element => {
  const titleTextClassName = classNames(styles.titleText, className);

  return <h3 className={titleTextClassName}>{children}</h3>;
};

export default TitleText;
