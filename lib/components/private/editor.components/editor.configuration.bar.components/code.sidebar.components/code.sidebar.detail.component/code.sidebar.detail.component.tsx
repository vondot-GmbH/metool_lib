import { useState, useCallback } from "react";
import { inject, observer } from "mobx-react";
import { faDatabase, faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import QueryStore from "../../../../../../stores/query.store";
import RestQueryForm from "../code.sidebar.component/components/rest.query.form/rest.query.form";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import ResourceStore from "../../../../../../stores/resource.store";
import { DataSourceType, Resource } from "../../../../../../main";
import { RestQuery } from "../../../../../../schemas/query.schemas/query.schema";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import Row from "../../../../general.components/row.component/row.component";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import defaultStyles from "../../../../../../styles/index.module.scss";

interface CodeSidebarDetailProps {
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  selectedItem: RestQuery;
  onClose: () => void;
  isEditing: boolean;
}

const CodeSidebarDetail = ({
  selectedItem,
  onClose,
  queryStore,
  resourceStore,
  isEditing,
}: CodeSidebarDetailProps) => {
  const [selectedResource, setSelectedResource] = useState<
    Resource | undefined
  >(resourceStore?.getResource(selectedItem?.resourceID ?? ""));

  const handleResourceChange = useCallback(
    (resourceId: string) => {
      const resource = resourceStore?.getResource(resourceId);
      setSelectedResource(resource);
    },
    [resourceStore]
  );

  const handleSubmit = (data: RestQuery) => {
    if (!data || !selectedResource) {
      return;
    }

    const query = {
      ...data,
      resourceID: selectedResource.resourceID,
      type: selectedResource.type,
    };

    if (isEditing) {
      queryStore?.updateAndSaveQuery(query);
    } else {
      queryStore?.createAndSaveQuery(query);
    }
  };

  return (
    <ResizableSidebar initialWidth={410} minWidth={300} maxWidth={700}>
      <ComponentWrapper
        title={selectedItem.title}
        action={
          <Row>
            {!(selectedItem as any)?.core && (
              <IconButton
                className={defaultStyles.mr10}
                type="submit"
                form="rest-query-form"
                icon={isEditing ? faFloppyDisk : faPlus}
                label={isEditing ? "Speichern" : "Hinzufügen"}
                showBorder
              />
            )}
            <IconButton icon={faX} onClick={onClose} showBorder />
          </Row>
        }
      >
        <SelectDropDown
          label="Resource"
          labelPropertyName="title"
          valuePropertyName="resourceID"
          iconPropertyName="icon"
          selectedItem={selectedResource?.resourceID}
          items={
            resourceStore?.resources?.map((resource) => ({
              ...resource,
              icon: faDatabase,
            })) ?? []
          }
          onChange={(item) => handleResourceChange(item?.resourceID)}
          disabled={(selectedItem as any)?.core}
        />

        {selectedResource?.type === DataSourceType.REST_API && (
          <RestQueryForm
            initialQuery={selectedItem}
            resource={selectedResource}
            onFormSubmit={handleSubmit}
            disabled={(selectedItem as any)?.core}
          />
        )}
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject(
  "queryStore",
  "resourceStore"
)(observer(CodeSidebarDetail));
