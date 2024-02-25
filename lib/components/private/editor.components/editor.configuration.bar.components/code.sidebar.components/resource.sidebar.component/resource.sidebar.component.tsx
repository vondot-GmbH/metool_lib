import { inject, observer } from "mobx-react";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import styles from "./resource.sidebar.component.module.scss";
import RunningText from "../../../../general.components/text.components/running.text.component/running.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import ResourceStore from "../../../../../../stores/resource.store";

interface ResourceSidebarProps {
  resourceStore?: ResourceStore;
  onItemSelect?: (queryID: string) => void;
}

const ResourceSidebar = ({
  resourceStore,
  onItemSelect,
}: ResourceSidebarProps): JSX.Element => {
  const resources = resourceStore?.resources;

  const itemClassName = (queryID: string) => {
    return (
      styles.resourceItem +
      " " +
      (selectedItem === queryID ? styles.resourceItemSelected : "")
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
    <ComponentWrapper title={"Resources"}>
      {resources?.map((resource) => {
        return (
          <Row
            className={itemClassName(resource.resourceID)}
            key={resource.resourceID}
            onClick={() => {
              handleSelectItem(resource.resourceID);
            }}
          >
            <FontAwesomeIcon
              icon={faBookmark}
              className={styles.resourceIcon}
            />
            <RunningText>{resource.resourceID}</RunningText>
          </Row>
        );
      })}
    </ComponentWrapper>
  );
};

export default inject("queryStore")(observer(ResourceSidebar));
