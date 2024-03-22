import styles from "./generic.list.component.module.scss";
import ComponentWrapper from "../../component.wrapper.component/component.wrapper.component";
import Row from "../../row.component/row.component";

interface GenericListProps<T> {
  title: string;
  items: T[];
  identifierKey: string; // String, der den Schlüssel für den Identifier in T angibt
  selectedIdentifier: string | null;
  onSelectItem: (selectedItem: T) => void; // Gibt das ausgewählte Item zurück
  renderItem: (item: T) => JSX.Element;
  actionElement?: JSX.Element;
}

// TODO complete add add functionallity and all other functions
const GenericList = <T extends { [key: string]: any }>({
  title,
  items,
  identifierKey,
  selectedIdentifier,
  onSelectItem,
  renderItem,
  actionElement,
}: GenericListProps<T>): JSX.Element => {
  const itemClassName = (item: T) => {
    const identifier = item[identifierKey];
    return `${styles.listItem} ${
      selectedIdentifier === identifier ? styles.selected : ""
    }`;
  };

  return (
    <ComponentWrapper title={title} action={actionElement}>
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
