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

interface ResourceSidebarProps {
  resourceStore?: ResourceStore;
  onItemSelect?: (resourceID: string) => void;
}

const ResourceSidebar = ({
  resourceStore,
  onItemSelect,
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
    onItemSelect?.(resourceID);
  };

  const handleAddResource = () => {
    resourceStore?.addInitialResource();
    setSelectedItem("new");
    onItemSelect?.("new");
  };

  return (
    <div>
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
    </div>
  );
};

export default inject("resourceStore")(observer(ResourceSidebar));
