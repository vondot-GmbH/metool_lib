import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../../stores/query.store";
import WidgetStore from "../../../../../../stores/widget.store";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./code.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import {
  CoreQuery,
  Query,
} from "../../../../../../schemas/query.schemas/query.schema";
import CodeSidebarDetail from "../code.sidebar.detail.component/code.sidebar.detail.component";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";

interface CodeSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
}

const CodeSidebar = ({ queryStore }: CodeSidebarProps): JSX.Element => {
  const queries: any[] = queryStore?.queries ?? [];
  const currentSelectedQuery = queryStore?.currentSelectedQuery;

  const coreQueries: CoreQuery[] = queries?.filter((query: any) => query?.core);
  const dynamicQueries: Query[] = queries?.filter((query: any) => !query?.core);

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  if (currentSelectedQuery != null && currentSelectedQuery?._id == null) {
    dynamicQueries.push(currentSelectedQuery);
  }

  useEffect(() => {
    if (currentSelectedQuery?.queryID != null) {
      handleSelectItem(currentSelectedQuery?.queryID);
    }
  }, [currentSelectedQuery]);

  const itemClassName = (queryID: string | null) => {
    return (
      styles.codeItem +
      " " +
      (selectedItem === queryID ? styles.codeItemSelected : "")
    );
  };

  const handleSelectItem = (queryID: string | null) => {
    if (queryID == null) {
      return;
    }

    setSelectedItem(queryID);
  };

  const handleAddQuery = () => {
    const initialQuery = queryStore?.createInitialQuery();
    if (initialQuery?.queryID == null) {
      return;
    }
    setSelectedItem(initialQuery?.queryID);
  };

  const buiilCoreQueries = (): JSX.Element => {
    return (
      <>
        {coreQueries?.length != 0 && (
          <ComponentWrapper title={"Core Queries"}>
            {coreQueries?.map((query: CoreQuery) => {
              return (
                <Row
                  className={itemClassName(query?.queryID)}
                  key={query?.queryID}
                  onClick={() => {
                    handleSelectItem(query?.queryID);
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
      </>
    );
  };

  const buildDynamicQueries = (): JSX.Element => {
    return (
      <>
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
                className={itemClassName(query?.queryID)}
                key={query.queryID}
                onClick={() => {
                  handleSelectItem(query?.queryID);
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
      </>
    );
  };

  return (
    <Row className={styles.configurationSidebar}>
      <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={400}>
        {buiilCoreQueries()}
        {buildDynamicQueries()}
      </ResizableSidebar>

      {selectedItem != null && (
        <CodeSidebarDetail
          key={selectedItem}
          selectedItemID={selectedItem}
          onClose={() => setSelectedItem(undefined)}
        />
      )}
    </Row>
  );
};

export default inject("widgetStore", "queryStore")(observer(CodeSidebar));
