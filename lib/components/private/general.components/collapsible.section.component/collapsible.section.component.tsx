import { useState } from "react";
import styles from "./collapsible.section.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Row from "../row.component/row.component";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-regular-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  initialOpen?: boolean;
  icon?: IconProp;
}

const CollapsibleSection = ({
  title,
  children,
  initialOpen = true,
  icon,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  const _buildHeaderIcon = (): JSX.Element => {
    return (
      <FontAwesomeIcon
        icon={isOpen ? faAngleUp : faAngleDown}
        className={styles.sectionIcon}
      />
    );
  };

  return (
    <div className={styles.collapsibleSection}>
      <Row
        className={styles.sectionHeader}
        onClick={toggleOpen}
        alignItems="center"
        justifyContent="flex-start"
      >
        {_buildHeaderIcon()}

        <RunningText className={styles.sectionTitle}>{title}</RunningText>
        {icon && <FontAwesomeIcon icon={icon} className={styles.titleIcon} />}
      </Row>

      <div className={`${styles.sectionBody} ${isOpen ? styles.open : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
