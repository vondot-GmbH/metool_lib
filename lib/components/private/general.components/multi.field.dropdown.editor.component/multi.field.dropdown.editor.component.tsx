import React, { useEffect, useRef, useState } from "react";
import styles from "./multi.field.dropdown.editor.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import { faAdd } from "@fortawesome/pro-regular-svg-icons";
import ReactDOM from "react-dom";
import { useClickedOutside } from "../../../../globals/helpers/hook.helper";
import IconButton from "../button.components/icon.button.component/icon.button.component";

interface MultiFieldDropdownEditorProps {
  label: string;
  items: any[];
  renderListItem: (item: any, index: number) => React.ReactNode;
  renderDetailView?: (
    item: any,
    selectedItemIndex: number | null,
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
  const detailViewRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(
    null
  );
  const [savedItems, setSavedItems] = useState<any[]>(items);
  const [detailViewPosition, setDetailViewPosition] = useState({
    top: 0,
    left: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setSavedItems(items);
  }, [items]);

  useClickedOutside(portalRef, () => setIsOpen(false));

  const closeDetailView = (): void => {
    setSelectedItem(null);
  };

  const handleItemClick = (item: any, index: number) => {
    if (renderDetailView != null && detailViewRef.current != null) {
      const rect = detailViewRef.current.getBoundingClientRect();
      setDetailViewPosition({
        top: rect.bottom + window.scrollY + -50,
        left: rect.left + window.scrollX - 350,
      });

      setIsOpen(true);
    }

    setSelectedItemIndex(index);
    setSelectedItem(item);
  };

  const handleAdd = () => {
    if (onAdd) {
      if (renderDetailView != null && detailViewRef.current != null) {
        setIsOpen(true);
      }

      onAdd();
    }
  };

  const renderDetailViewPortal = () => {
    return selectedItem && isOpen && renderDetailView
      ? ReactDOM.createPortal(
          <div
            ref={portalRef}
            className={styles.detailView}
            style={{
              position: "absolute",
              top: `${detailViewPosition.top}px`,
              left: `${detailViewPosition.left}px`,
            }}
          >
            {renderDetailView(selectedItem, selectedItemIndex, closeDetailView)}
          </div>,
          document.body
        )
      : null;
  };

  return (
    <div className={styles.multiFieldDropdownWrapper} ref={detailViewRef}>
      <div className={styles.multiFieldDropdownHeader}>
        <RunningText>{label}</RunningText>
        {onAdd && <IconButton icon={faAdd} onClick={handleAdd} showBorder />}
      </div>
      {savedItems &&
        savedItems.map((item, index) => (
          <div
            key={index}
            className={styles.multiFieldDropdownItem}
            onClick={() => handleItemClick(item, index)}
          >
            {renderListItem(item, index)}
          </div>
        ))}

      {renderDetailView && renderDetailViewPortal()}
    </div>
  );
};

export default MultiFieldDropdownEditor;
