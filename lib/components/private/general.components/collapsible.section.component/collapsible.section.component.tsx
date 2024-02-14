import { useState } from "react";
import styles from "./collapsible.section.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons/faArrowAltCircleDown";
import { faSquareCaretDown } from "@fortawesome/free-regular-svg-icons";
import Row from "../row.component/row.component";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection = ({ title, children }: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  const _buildHeaderIcon = (): JSX.Element => {
    return (
      <FontAwesomeIcon
        icon={isOpen ? faArrowAltCircleDown : faSquareCaretDown}
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
      </Row>

      <div className={`${styles.sectionBody} ${isOpen ? styles.open : ""}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection;
