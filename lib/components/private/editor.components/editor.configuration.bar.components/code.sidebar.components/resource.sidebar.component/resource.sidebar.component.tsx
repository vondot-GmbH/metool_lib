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
  onItemSelect?: (queryID: string) => void;
}

const ResourceSidebar = ({
  resourceStore,
  onItemSelect,
}: ResourceSidebarProps): JSX.Element => {
  const resources = resourceStore?.resources ?? [];

  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );

  // TODO set react memo
  const coreResources: CoreResource[] = resources?.filter(
    (resource: any) => resource?.coreResource
  );

  let dynamicResources: Resource[] = resources?.filter(
    (resource: any) => !resource?.coreResource
  );

  const itemClassName = (queryID: string | undefined) => {
    return (
      styles.resourceItem +
      " " +
      (selectedItem === queryID ? styles.resourceItemSelected : "")
    );
  };

  const handleSelectItem = (queryID: string | undefined) => {
    if (queryID == null) {
      return;
    }

    setSelectedItem(queryID);
    onItemSelect?.(queryID);
  };

  const handleAddResource = () => {
    resourceStore?.addInitialResource();
  };

  return (
    <div>
      {coreResources?.length != 0 && (
        <ComponentWrapper title={"Core Resources"}>
          {coreResources?.map((resource) => {
            return (
              <Row
                className={itemClassName(resource?.key)}
                key={resource?.key}
                onClick={() => {
                  handleSelectItem(resource?.key);
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
              className={itemClassName(resource?._id)}
              key={resource?._id}
              onClick={() => {
                handleSelectItem(resource?._id);
              }}
            >
              <FontAwesomeIcon
                icon={faBookmark}
                className={styles.resourceIcon}
              />
              <RunningText>{resource?.title}</RunningText>
            </Row>
          );
        })}
      </ComponentWrapper>
    </div>
  );
};

export default inject("resourceStore")(observer(ResourceSidebar));
