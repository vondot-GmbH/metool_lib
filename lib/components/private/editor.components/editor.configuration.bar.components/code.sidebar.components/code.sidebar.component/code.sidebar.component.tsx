import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../../stores/query.store";
import WidgetStore from "../../../../../../stores/widget.store";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./code.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import {
  CoreQuery,
  Query,
} from "../../../../../../schemas/query.schemas/query.schema";
import CodeSidebarDetail from "../code.sidebar.detail.component/code.sidebar.detail.component";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import { faAdd, faCode } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";

interface CodeSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
}

const CodeSidebar = ({ queryStore }: CodeSidebarProps): JSX.Element => {
  const coreQueries: CoreQuery[] = useMemo(() => {
    return (queryStore?.queries as any)?.filter((query: any) => query?.core);
  }, [queryStore?.queries]);

  const dynamicQueries: Query[] = useMemo(() => {
    return (queryStore?.queries as any)?.filter((query: any) => !query?.core);
  }, [queryStore?.queries]);

  const [selectedItem, setSelectedItem] = useState<Query | undefined>(
    undefined
  );

  const [isEditing, setIsEditing] = useState<boolean>(
    selectedItem?.queryID != "new"
  );

  useEffect(() => {
    if (selectedItem?.queryID === "new") {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [selectedItem]);

  const itemClassName = (queryID: string | null) => {
    return (
      styles.codeItem +
      " " +
      (selectedItem?.queryID === queryID ? styles.codeItemSelected : "")
    );
  };

  const handleSelectItem = (queryID: string | null) => {
    if (queryID == null) return;

    const query = queryStore?.getQuery(queryID);
    setSelectedItem(query);
  };

  const handleAddQuery = () => {
    const initialQuery = queryStore?.createInitialQuery();

    setSelectedItem(initialQuery);
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
                    console.log("onClick: ", query);
                    handleSelectItem(query?.queryID);
                  }}
                >
                  <FontAwesomeIcon icon={faCode} className={styles.codeIcon} />
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
            <IconButton
              icon={faAdd}
              showBorder
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
                <FontAwesomeIcon icon={faCode} className={styles.codeIcon} />
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
      <ResizableSidebar initialWidth={330} minWidth={200} maxWidth={450}>
        {buiilCoreQueries()}
        {buildDynamicQueries()}
      </ResizableSidebar>

      {selectedItem != null && (
        <CodeSidebarDetail
          key={selectedItem.queryID}
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(undefined)}
          isEditing={isEditing}
        />
      )}
    </Row>
  );
};

export default inject("widgetStore", "queryStore")(observer(CodeSidebar));
