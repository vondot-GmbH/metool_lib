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
import {
  Resource,
  RestResource,
} from "../../../../../../schemas/resource.schemas/resource.schema";

interface ResourceSidebarDetailProps {
  resourceStore?: ResourceStore;
  selectedItem?: Resource;
  onClose: () => void;
  isEditing: boolean;
}

const ResourceSidebarDetail = ({
  selectedItem,
  resourceStore,
  isEditing,
  onClose,
}: ResourceSidebarDetailProps): JSX.Element | null => {
  const [selectedType, setSelectedType] = useState<DataSourceType | null>(
    selectedItem?.type ?? null
  );

  const handleTypeChange = (item: any) => {
    setSelectedType(item?.value);
  };

  const typeItems = Object.values(DataSourceType).map((key) => {
    return {
      value: key,
      label: key,
    };
  });

  const handleSubmit = (data: Resource) => {
    if (!data) {
      return;
    }

    const resource = {
      ...data,
      // type: selectedType,
    };

    if (isEditing) {
      resourceStore?.updateAndSaveResource(resource);
    } else {
      resourceStore?.createAndSaveResource(resource);
    }
  };

  return (
    <ResizableSidebar initialWidth={380} minWidth={300} maxWidth={500}>
      <ComponentWrapper
        title={selectedItem?.title}
        action={
          <SizedContainer size="s">
            {!(selectedItem as any)?.core && (
              <button type="submit" form="rest-resource-form">
                Save
              </button>
            )}
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
          disabled={(selectedItem as any)?.core}
          className={defaultStyles.mb20}
        />

        {selectedType === DataSourceType.REST_API && (
          <ResourceRestForm
            disabled={(selectedItem as any)?.core}
            onFormSubmit={(data: RestResource) => {
              handleSubmit(data);
            }}
            iniitialResource={
              { type: selectedType, ...selectedItem } as RestResource
            }
          />
        )}
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject("resourceStore")(observer(ResourceSidebarDetail));
