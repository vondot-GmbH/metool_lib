import { inject, observer } from "mobx-react";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./resource.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faSquarePlus } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useMemo, useState } from "react";
import ResourceStore from "../../../../../../stores/resource.store";
import {
  CoreRestResource,
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
  const coreResources: CoreRestResource[] = useMemo(() => {
    return (resourceStore?.resources as any).filter(
      (resource: any) => resource?.core
    );
  }, [resourceStore?.resources]);

  const dynamicResources: Resource[] = useMemo(() => {
    return (resourceStore?.resources as any)?.filter(
      (resource: any) => !resource?.core
    );
  }, [resourceStore?.resources]);

  const [selectedItem, setSelectedItem] = useState<Resource | undefined>(
    undefined
  );

  const [isEditing, setIsEditing] = useState<boolean>(
    selectedItem?.resourceID != "new"
  );

  useEffect(() => {
    if (selectedItem?.resourceID === "new") {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [selectedItem]);

  const itemClassName = (resourceID: string | undefined) => {
    return (
      styles.resourceItem +
      " " +
      (selectedItem?.resourceID === resourceID
        ? styles.resourceItemSelected
        : "")
    );
  };

  const handleSelectItem = (resourceID: string | undefined) => {
    if (resourceID == null) return;

    const resource = resourceStore?.getResource(resourceID);
    setSelectedItem(resource);
  };

  const handleAddResource = () => {
    const initialResource = resourceStore?.createInitialResource();
    setSelectedItem(initialResource);
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
          key={selectedItem.resourceID}
          selectedItem={selectedItem}
          onClose={() => setSelectedItem(undefined)}
          isEditing={isEditing}
        />
      )}
    </Row>
  );
};

export default inject("resourceStore")(observer(ResourceSidebar));
