import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../../stores/query.store";
import WidgetStore from "../../../../../../stores/widget.store";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./code.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";

interface CodeSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  onItemSelect?: (queryID: string) => void;
}

const CodeSidebar = ({
  widgetStore,
  queryStore,
  onItemSelect,
}: CodeSidebarProps): JSX.Element => {
  const queries = queryStore?.queries;

  const itemClassName = (queryID: string) => {
    return (
      styles.codeItem +
      " " +
      (selectedItem === queryID ? styles.codeItemSelected : "")
    );
  };

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  const handleSelectItem = (queryID: string) => {
    setSelectedItem(queryID);
    onItemSelect?.(queryID);
  };

  return (
    <ComponentWrapper title={"Code"}>
      {queries?.map((query) => {
        return (
          <Row
            className={itemClassName(query.queryID)}
            key={query.queryID}
            onClick={() => {
              handleSelectItem(query.queryID);
            }}
          >
            <FontAwesomeIcon icon={faBookmark} className={styles.codeIcon} />
            <RunningText>{query.queryID}</RunningText>
          </Row>
        );
      })}
    </ComponentWrapper>
  );
};

export default inject("widgetStore", "queryStore")(observer(CodeSidebar));
