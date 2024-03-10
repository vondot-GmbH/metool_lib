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
import { DataSourceType } from "../../../../../../main";
import { useEffect, useState } from "react";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import ResourceStore from "../../../../../../stores/resource.store";

interface CodeSidebarDetailProps {
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  selectedItemID?: string;
  onClose: () => void;
}

const CodeSidebarDetail = ({
  selectedItemID,
  onClose,
  queryStore,
  resourceStore,
}: CodeSidebarDetailProps): JSX.Element | null => {
  const [selectedItem, setSelectedItem] = useState<any | undefined>(
    queryStore?.getQuery(selectedItemID ?? "")
  );

  const [selectedResourceId, setSelectedResourceId] = useState<
    string | undefined
  >(selectedItem?.resourceID);

  useEffect(() => {
    const resource = resourceStore?.getResource(selectedResourceId ?? "");

    setSelectedItem((currentItem: any) => ({
      ...currentItem,
      resource,
      type: resource?.type,
    }));
  }, [selectedResourceId, resourceStore]);

  const handleResourceChange = (resourceId: string) => {
    setSelectedResourceId(resourceId);
  };

  const handleSumit = (data: RestQuery) => {
    console.log("data: ", data);
    if (data?._id == null) {
      queryStore?.updateAndSaveQuery(data);
    } else {
      queryStore?.createAndSaveQuery(data);
    }
  };

  return (
    <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={500}>
      <ComponentWrapper
        title={selectedItemID}
        action={
          <SizedContainer size="s">
            {!(selectedItem as any)?.core && (
              <button type="submit" form="rest-query-form">
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
          label="Resource"
          labelPropertyName="title"
          valuePropertyName="resourceID"
          selectedItem={selectedResourceId}
          items={resourceStore?.resources ?? []}
          onChange={(item) => handleResourceChange(item?.resourceID)}
        />

        {selectedItem?.resource?.type === DataSourceType.REST_API && (
          <RestQueryForm
            iniitialQuery={selectedItem}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onFormSubmit={(data: RestQuery) => {
              handleSumit(data);
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
