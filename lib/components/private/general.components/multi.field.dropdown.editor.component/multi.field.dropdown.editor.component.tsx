import React, { useState } from "react";
import styles from "./multi.field.dropdown.editor.component.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import RunningText from "../text.components/running.text.component/running.text.component";

interface MultiFieldDropdownEditorProps {
  label: string;
  items: any[];
  renderListItem: (item: any, index: number) => React.ReactNode;
  renderDetailView?: (
    item: any,
    closeDetailView: () => void
  ) => React.ReactNode;
  onAdd?: () => void;
}

const MultiFieldDropdownEditor = ({
  label,
  items,
  renderListItem,
  renderDetailView,
  onAdd,
}: MultiFieldDropdownEditorProps) => {
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleItemClick = (item: any): void => {
    setSelectedItem(item);
  };

  const closeDetailView = (): void => {
    setSelectedItem(null);
  };

  return (
    <div className={styles.multiFieldDropdownWrapper}>
      <div className={styles.multiFieldDropdownHeader}>
        <RunningText>{label}</RunningText>
        {onAdd && (
          <FontAwesomeIcon
            icon={faPlusSquare}
            style={{ cursor: "pointer" }}
            onClick={onAdd}
          />
        )}
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className={styles.multiFieldDropdownItem}
          onClick={() => handleItemClick(item)}
        >
          {renderListItem(item, index)}
        </div>
      ))}
      {selectedItem &&
        renderDetailView &&
        renderDetailView(selectedItem, closeDetailView)}
    </div>
  );
};

export default MultiFieldDropdownEditor;
