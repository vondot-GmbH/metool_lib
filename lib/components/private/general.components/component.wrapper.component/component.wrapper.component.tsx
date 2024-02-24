import Row from "../row.component/row.component";
import TitleText from "../text.components/title.text.component/title.text.component";
import styles from "./component.wrapper.component.module.scss";

interface ComponentWrapperProps {
  title?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

// TODO add dynamic padding and other things to this component

const ComponentWrapper = ({
  children,
  title,
  action,
}: ComponentWrapperProps): JSX.Element => {
  return (
    <div className={styles.componentWrapper}>
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
