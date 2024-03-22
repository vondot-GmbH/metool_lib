import { inject, observer } from "mobx-react";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import { faAdd, faFiles } from "@fortawesome/pro-regular-svg-icons";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import ViewStore from "../../../../../../stores/view.store";
import { View } from "../../../../../../schemas/view.schemas/view.schema";
import styles from "./view.sidebar.component.module.scss";
import ViewSidebarDetail from "../view.sidebar.detail.component/view.sidebar.detail.component";
import PageStore from "../../../../../../stores/page.store";

interface ViewSidebarProps {
  viewStore?: ViewStore;
  pageStore?: PageStore;
}

const ViewSidebar = ({
  viewStore,
  pageStore,
}: ViewSidebarProps): JSX.Element => {
  const views: View[] = useMemo(() => {
    return viewStore?.views ?? [];
  }, [viewStore?.views]);

  const [selectedItem, setSelectedItem] = useState<View | undefined>(undefined);

  const [isEditing, setIsEditing] = useState<boolean>(
    selectedItem?.viewID != "new"
  );

  useEffect(() => {
    if (selectedItem?.viewID === "new") {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [selectedItem]);

  const itemClassName = (viewID: string | null) => {
    return (
      styles.viewItem +
      " " +
      (selectedItem?.viewID === viewID ? styles.viewItemSelected : "")
    );
  };

  const handleSelectItem = (viewID: string | null) => {
    if (viewID == null) return;

    const view = viewStore?.getView(viewID);
    setSelectedItem(view);
  };

  const handleAddView = () => {
    const initialView = viewStore?.createInitialView();

    setSelectedItem(initialView);
  };

  const buildViews = (): JSX.Element => {
    return (
      <>
        <ComponentWrapper
          title={`Ansichten von ${pageStore?.currentSelectedPage?.name}`}
          action={
            <IconButton
              icon={faAdd}
              showBorder
              onClick={() => {
                handleAddView();
              }}
            />
          }
        >
          {views?.map((view: View) => {
            return (
              <Row
                className={itemClassName(view?.viewID)}
                key={view.viewID}
                onClick={() => {
                  handleSelectItem(view?.viewID);
                }}
              >
                <FontAwesomeIcon icon={faFiles} className={styles.viewIcon} />
                <RunningText>{view.name}</RunningText>
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
        {buildViews()}
      </ResizableSidebar>

      {selectedItem != null && (
        <ViewSidebarDetail
          key={selectedItem.viewID}
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(undefined)}
          isEditing={isEditing}
        />
      )}
    </Row>
  );
};

export default inject("viewStore", "pageStore")(observer(ViewSidebar));
