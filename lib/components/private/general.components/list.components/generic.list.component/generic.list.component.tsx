import styles from "./generic.list.component.module.scss";
import ComponentWrapper from "../../component.wrapper.component/component.wrapper.component";
import Row from "../../ui.components/row.component/row.component";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../../button.components/icon.button.component/icon.button.component";

interface GenericListProps<T> {
  title: string;
  items: T[];
  identifierKey: string;
  selectedIdentifier: string | undefined;
  onSelectItem: (selectedItem: T) => void;
  renderItem: (item: T) => JSX.Element;
  onAddNew?: () => void;
  actionElement?: JSX.Element;
}

const GenericList = <T extends { [key: string]: any }>({
  title,
  items,
  identifierKey,
  selectedIdentifier,
  onSelectItem,
  renderItem,
  onAddNew,
  actionElement,
}: GenericListProps<T>): JSX.Element => {
  const itemClassName = (item: T) => {
    const identifier = item[identifierKey];
    return `${styles.listItem} ${
      selectedIdentifier === identifier ? styles.selected : ""
    }`;
  };

  return (
    <ComponentWrapper
      title={title}
      action={
        <>
          {actionElement}
          {onAddNew && <IconButton icon={faPlus} onClick={onAddNew} />}
        </>
      }
    >
      {items.map((item) => (
        <Row
          className={itemClassName(item)}
          key={item[identifierKey]}
          onClick={() => onSelectItem(item)}
        >
          {renderItem(item)}
        </Row>
      ))}
    </ComponentWrapper>
  );
};

export default GenericList;
