import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../../stores/query.store";
import WidgetStore from "../../../../../../stores/widget.store";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./code.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import {
  CoreQuery,
  Query,
} from "../../../../../../schemas/query.schemas/query.schema";

interface CodeSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  onItemSelect?: (queryID: string) => void;
}

const CodeSidebar = ({
  queryStore,
  onItemSelect,
}: CodeSidebarProps): JSX.Element => {
  const queries: any[] = queryStore?.queries ?? [];
  const currentSelectedQuery = queryStore?.currentSelectedQuery;

  const coreQueries: CoreQuery[] = queries?.filter((query: any) => query?.core);
  const dynamicQueries: Query[] = queries?.filter((query: any) => !query?.core);

  if (currentSelectedQuery != null && currentSelectedQuery?._id == "new") {
    dynamicQueries.push(currentSelectedQuery);
  }

  const itemClassName = (queryID: string | null) => {
    return (
      styles.codeItem +
      " " +
      (selectedItem === queryID ? styles.codeItemSelected : "")
    );
  };

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  const handleSelectItem = (queryID: string | null) => {
    if (queryID == null) {
      return;
    }

    setSelectedItem(queryID);
    onItemSelect?.(queryID);
  };

  const handleAddQuery = () => {
    const initialQuery = queryStore?.createInitialQuery();
    if (initialQuery?._id == null) {
      return;
    }
    setSelectedItem(initialQuery?._id);
    onItemSelect?.(initialQuery?._id);
  };

  return (
    <div>
      {coreQueries?.length != 0 && (
        <ComponentWrapper title={"Core Queries"}>
          {coreQueries?.map((query: CoreQuery) => {
            return (
              <Row
                className={itemClassName(query?._id)}
                key={query?._id}
                onClick={() => {
                  handleSelectItem(query?._id);
                }}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  className={styles.codeIcon}
                />
                <RunningText>{query.title}</RunningText>
              </Row>
            );
          })}
        </ComponentWrapper>
      )}

      <ComponentWrapper
        title={"Code"}
        action={
          <FontAwesomeIcon
            icon={faSquarePlus}
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleAddQuery();
            }}
          />
        }
      >
        {dynamicQueries?.map((query: Query) => {
          return (
            <Row
              className={itemClassName(query?._id)}
              key={query._id}
              onClick={() => {
                handleSelectItem(query?._id);
              }}
            >
              <FontAwesomeIcon icon={faBookmark} className={styles.codeIcon} />
              <RunningText>{query.title}</RunningText>
            </Row>
          );
        })}
      </ComponentWrapper>
    </div>
  );
};

export default inject("widgetStore", "queryStore")(observer(CodeSidebar));
