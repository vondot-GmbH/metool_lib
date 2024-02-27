import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import ResourceStore from "../../../../../../stores/resource.store";
import ResourceRestForm from "../resource.sidebar.component/components/resource.rest.form/resource.rest.form";
import SizedContainer from "../../../../general.components/sized.container.component/sized.container.component";
import defaultStyles from "../../../../../../styles/index.module.scss";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import { DataSourceType } from "../../../../../../main";
import { useState } from "react";
import { RestResource } from "../../../../../../schemas/resource.schemas/resource.schema";
import { ChangeRecord } from "../../../../../../globals/interfaces/change.record.interface";

interface ResourceSidebarDetailProps {
  resourceStore?: ResourceStore;
  selectedItem?: string;
  onClose: () => void;
  onSaveChanges?: (changeRecords: ChangeRecord[]) => void;
}

const ResourceSidebarDetail = ({
  selectedItem,
  resourceStore,
  onClose,
}: ResourceSidebarDetailProps): JSX.Element | null => {
  const selectedResource = resourceStore?.getResource(selectedItem ?? "");

  const [selectedType, setSelectedType] = useState<DataSourceType | null>(
    selectedResource?.type ?? null
  );

  const handleTypeChange = (item: any) => {
    console.log("handleTypeChange");
    console.log(item);
    setSelectedType(item?.value);
  };

  const typeItems = Object.values(DataSourceType).map((key) => {
    return {
      value: key,
      label: key,
    };
  });

  const handleSaveChanges = (data: RestResource) => {
    resourceStore?.saveResourceChangesAndProcess(data);
  };

  return (
    <ResizableSidebar initialWidth={380} minWidth={300} maxWidth={500}>
      <ComponentWrapper
        title={selectedItem}
        action={
          <SizedContainer size="s">
            <button type="submit" form="rest-resource-form">
              Save
            </button>
            <FontAwesomeIcon
              className={defaultStyles.ml10}
              icon={faXmarkCircle}
              style={{ cursor: "pointer" }}
              onClick={onClose}
            />
          </SizedContainer>
        }
      >
        <SelectDropDown
          label="Resource Type"
          selectedItem={selectedType}
          items={typeItems}
          onChange={(item) => handleTypeChange(item)}
        />

        {selectedType === DataSourceType.REST_API && (
          <ResourceRestForm
            onFormSubmit={(data: RestResource) => {
              handleSaveChanges(data);
            }}
            iniitialResource={
              { type: selectedType, ...selectedResource } as RestResource
            }
          />
        )}
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject("resourceStore")(observer(ResourceSidebarDetail));
