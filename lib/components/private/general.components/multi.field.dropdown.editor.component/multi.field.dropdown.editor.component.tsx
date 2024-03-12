import React, { useEffect, useState } from "react";
import styles from "./multi.field.dropdown.editor.component.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import RunningText from "../text.components/running.text.component/running.text.component";
import IconButton from "../icon.button.component/icon.button.component";
import { faAdd } from "@fortawesome/pro-regular-svg-icons";

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
  const [savedItems, setSavedItems] = useState<any[]>(items);

  useEffect(() => {
    setSavedItems(items);
  }, [items]);

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
        {onAdd && <IconButton icon={faAdd} onClick={onAdd} showBorder />}
      </div>
      {savedItems &&
        savedItems.map((item, index) => (
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
