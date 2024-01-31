import TitleText from "../text.components/title.text.component/title.text.component";
import styles from "./sidebar.wrapper.component.module.scss";

interface SidebarWrapperProps {
  title: string;
  children: React.ReactNode;
}

const SidebarWrapper = ({
  children,
  title,
}: SidebarWrapperProps): JSX.Element => {
  return (
    <div className={styles.sidebarWrapper}>
      <div className={styles.sidebarHeader}>
        <TitleText>{title}</TitleText>
      </div>
      {children}
    </div>
  );
};

export default SidebarWrapper;
