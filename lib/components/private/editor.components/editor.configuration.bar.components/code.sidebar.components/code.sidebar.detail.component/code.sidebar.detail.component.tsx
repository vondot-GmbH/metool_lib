import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import QueryStore from "../../../../../../stores/query.store";
import RestQueryForm from "../code.sidebar.component/components/rest.query.form/rest.query.form";
import SizedContainer from "../../../../general.components/sized.container.component/sized.container.component";
import { RestQuery } from "../../../../../../schemas/query.schemas/query.schema";
import defaultStyles from "../../../../../../styles/index.module.scss";
import { DataSourceType, Resource } from "../../../../../../main";
import { useState } from "react";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import ResourceStore from "../../../../../../stores/resource.store";

interface CodeSidebarDetailProps {
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  selectedItem?: string;
  onClose: () => void;
}

const CodeSidebarDetail = ({
  selectedItem,
  onClose,
  queryStore,
  resourceStore,
}: CodeSidebarDetailProps): JSX.Element | null => {
  const selectedQuery = queryStore?.getQuery(selectedItem ?? "");

  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    selectedQuery?.resource ?? null
  );

  const handleTypeChange = (item: any) => {
    setSelectedResource(item);
  };

  const resources = resourceStore?.resources;

  return (
    <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={500}>
      <ComponentWrapper
        title={selectedItem}
        action={
          <SizedContainer size="s">
            <button type="submit" form="rest-query-form">
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
          label="Resource"
          labelPropertyName="title"
          valuePropertyName="_id"
          selectedItem={selectedResource}
          items={resources ?? []}
          onChange={(item) => handleTypeChange(item)}
        />

        {selectedResource?.type === DataSourceType.REST_API && (
          <RestQueryForm
            iniitialQuery={selectedQuery}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onFormSubmit={(data: RestQuery) => {
              // TODO save
            }}
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
