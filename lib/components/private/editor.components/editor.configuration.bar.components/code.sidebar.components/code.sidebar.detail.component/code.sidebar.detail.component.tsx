import React, { useState, useCallback } from "react";
import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import QueryStore from "../../../../../../stores/query.store";
import RestQueryForm from "../code.sidebar.component/components/rest.query.form/rest.query.form";
import SizedContainer from "../../../../general.components/sized.container.component/sized.container.component";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import ResourceStore from "../../../../../../stores/resource.store";
import { DataSourceType, Resource } from "../../../../../../main";
import { RestQuery } from "../../../../../../schemas/query.schemas/query.schema";
import defaultStyles from "../../../../../../styles/index.module.scss";

interface CodeSidebarDetailProps {
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  selectedItem: RestQuery;
  onClose: () => void;
  isEditing: boolean;
}

const CodeSidebarDetail: React.FC<CodeSidebarDetailProps> = ({
  selectedItem,
  onClose,
  queryStore,
  resourceStore,
  isEditing,
}) => {
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

  const handleSubmit = useCallback(
    (data: RestQuery) => {
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
    },
    [isEditing, queryStore, selectedResource]
  );

  return (
    <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={500}>
      <ComponentWrapper
        title={selectedItem.title}
        action={
          <SizedContainer size="s">
            {!(selectedItem as any)?.core && (
              <button type="submit" form="rest-query-form">
                {isEditing ? "Speichern" : "Hinzufügen"}
              </button>
            )}

            <FontAwesomeIcon
              className={`${defaultStyles.ml10} pointerCursor`}
              icon={faXmarkCircle}
              onClick={onClose}
            />
          </SizedContainer>
        }
      >
        <SelectDropDown
          label="Resource"
          labelPropertyName="title"
          valuePropertyName="resourceID"
          selectedItem={selectedResource?.resourceID}
          items={resourceStore?.resources ?? []}
          onChange={(item) => handleResourceChange(item?.resourceID)}
        />

        {selectedResource?.type === DataSourceType.REST_API && (
          <RestQueryForm
            initialQuery={selectedItem}
            resource={selectedResource}
            onFormSubmit={handleSubmit}
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
