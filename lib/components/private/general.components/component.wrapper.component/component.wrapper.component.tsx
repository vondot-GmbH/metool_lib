import TitleText from "../text.components/title.text.component/title.text.component";
import styles from "./component.wrapper.component.module.scss";

interface ComponentWrapperProps {
  title?: string;
  children: React.ReactNode;
}

// TODO add dynamic padding and other things to this component

const ComponentWrapper = ({
  children,
  title,
}: ComponentWrapperProps): JSX.Element => {
  return (
    <div className={styles.componentWrapper}>
      <div className={styles.componentHeader}>
        <TitleText>{title}</TitleText>
      </div>
      {children}
    </div>
  );
};

export default ComponentWrapper;
