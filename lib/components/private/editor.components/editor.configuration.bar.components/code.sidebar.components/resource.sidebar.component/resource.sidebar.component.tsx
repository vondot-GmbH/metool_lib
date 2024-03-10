import { inject, observer } from "mobx-react";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./resource.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ResourceStore from "../../../../../../stores/resource.store";
import {
  CoreResource,
  Resource,
} from "../../../../../../schemas/resource.schemas/resource.schema";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ResourceSidebarDetail from "../resource.sidebar.detail.component/resource.sidebar.detail.component";

interface ResourceSidebarProps {
  resourceStore?: ResourceStore;
}

const ResourceSidebar = ({
  resourceStore,
}: ResourceSidebarProps): JSX.Element => {
  const resources: any[] = resourceStore?.resources ?? [];

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  // TODO set react memo
  const coreResources: CoreResource[] = resources?.filter(
    (resource: any) => resource?.core
  );

  const dynamicResources: Resource[] = resources?.filter(
    (resource: any) => !resource?.core
  );

  const itemClassName = (resourceID: string | undefined) => {
    return (
      styles.resourceItem +
      " " +
      (selectedItem === resourceID ? styles.resourceItemSelected : "")
    );
  };

  const handleSelectItem = (resourceID: string | undefined) => {
    if (resourceID == null) {
      return;
    }

    setSelectedItem(resourceID);
  };

  const handleAddResource = () => {
    resourceStore?.addInitialResource();
    setSelectedItem("new");
  };

  const buildCoreResources = (): JSX.Element => {
    return (
      <>
        {coreResources?.length != 0 && (
          <ComponentWrapper title={"Core Resources"}>
            {coreResources?.map((resource) => {
              return (
                <Row
                  className={itemClassName(resource?.resourceID)}
                  key={resource?.resourceID}
                  onClick={() => {
                    handleSelectItem(resource?.resourceID);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faBookmark}
                    className={styles.resourceIcon}
                  />
                  <RunningText>{resource.title}</RunningText>
                </Row>
              );
            })}
          </ComponentWrapper>
        )}
      </>
    );
  };

  const buildDynamicResources = (): JSX.Element => {
    return (
      <>
        <ComponentWrapper
          title={"Resources"}
          action={
            <FontAwesomeIcon
              icon={faSquarePlus}
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleAddResource();
              }}
            />
          }
        >
          {dynamicResources?.map((resource) => {
            return (
              <Row
                className={itemClassName(resource?.resourceID)}
                key={resource?.resourceID}
                onClick={() => {
                  handleSelectItem(resource?.resourceID);
                }}
              >
                <FontAwesomeIcon
                  icon={faBookmark}
                  className={styles.resourceIcon}
                />
                <RunningText>{resource?.title ?? "--"}</RunningText>
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
        {buildCoreResources()}
        {buildDynamicResources()}
      </ResizableSidebar>

      {selectedItem != null && (
        <ResourceSidebarDetail
          key={selectedItem}
          selectedItemID={selectedItem}
          onClose={() => setSelectedItem(undefined)}
        />
      )}
    </Row>
  );
};

export default inject("resourceStore")(observer(ResourceSidebar));
