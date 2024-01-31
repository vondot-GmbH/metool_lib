import classNames from "classnames";
import styles from "./headline.component.module.scss";

interface HeadlineProps {
  children: React.ReactNode;
  className?: string;
}

const Headline = ({ children, className }: HeadlineProps): JSX.Element => {
  const headlineClassName = classNames(styles.headline, className);

  return <h2 className={headlineClassName}>{children}</h2>;
};

export default Headline;
