import classNames from "classnames";
import Row from "../row.component/row.component";
import TitleText from "../text.components/title.text.component/title.text.component";
import styles from "./component.wrapper.component.module.scss";

interface ComponentWrapperProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

// TODO add dynamic padding and other things to this component

const ComponentWrapper = ({
  children,
  title,
  action,
  className,
}: ComponentWrapperProps): JSX.Element => {
  const iconButtonClassNames = classNames(styles.componentWrapper, className);

  return (
    <div className={iconButtonClassNames}>
      <Row
        className={styles.componentHeader}
        justifyContent="space-between"
        alignItems="center"
      >
        <TitleText>{title}</TitleText>
        <div>{action}</div>
      </Row>
      {children}
    </div>
  );
};

export default ComponentWrapper;
