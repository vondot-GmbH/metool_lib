import { inject, observer } from "mobx-react";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import {
  faAdd,
  faFileCircleCheck,
  faFiles,
} from "@fortawesome/pro-regular-svg-icons";
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
  const [selectedItem, setSelectedItem] = useState<View | undefined>(undefined);

  const [isEditing, setIsEditing] = useState<boolean>(
    selectedItem?.viewID != "new"
  );

  const currentViewID = pageStore?.currentViewIdToRender;
  console.log("v ViewSidebar currentViewID: ", currentViewID);

  useEffect(() => {
    if (selectedItem?.viewID === "new") {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [selectedItem]);

  // views of the current selected page
  const views: View[] = useMemo(() => {
    const currentViewIds = pageStore?.currentPageToRender?.views.map(
      (view) => view.viewID
    );

    return viewStore?.views.filter((view) =>
      currentViewIds?.includes(view.viewID)
    ) as View[];
  }, [viewStore?.views, pageStore?.currentPageToRender?.views]);

  const itemClassName = (viewID: string | null) => {
    return (
      styles.viewItem +
      " " +
      (currentViewID === viewID ? styles.viewItemSelected : "")
    );
  };

  const getDefaultViewIcon = (view: View) => {
    const currentPage = pageStore?.currentPageToRender;

    const isDefault = currentPage?.views?.find(
      (item) => item?.viewID === view.viewID
    )?.defaultView;
    return isDefault ? (
      <FontAwesomeIcon icon={faFileCircleCheck} className={styles.viewIcon} />
    ) : (
      <FontAwesomeIcon icon={faFiles} className={styles.viewIcon} />
    );
  };

  const handleSelectItem = (viewID: string | null) => {
    if (viewID == null) return;

    // Setze den View als den zu rendernden View
    pageStore?.setCurrentViewIdToRender(viewID);
  };

  const handleAddView = () => {
    const initialView = viewStore?.createInitialView();

    setSelectedItem(initialView);
  };

  const buildViews = (): JSX.Element => {
    return (
      <>
        <ComponentWrapper
          title={`Views von ${pageStore?.currentPageToRender?.name}`}
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
                {getDefaultViewIcon(view)}
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
