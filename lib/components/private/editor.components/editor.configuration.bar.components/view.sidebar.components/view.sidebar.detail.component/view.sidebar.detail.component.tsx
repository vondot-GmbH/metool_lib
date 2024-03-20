import { inject, observer } from "mobx-react";
import { View } from "../../../../../../schemas/view.schemas/view.schema";
import ViewStore from "../../../../../../stores/view.store";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import defaultStyles from "../../../../../../styles/index.module.scss";
import { faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import ViewForm from "../components/view.form.component/view.form.component";

interface ViewSidebarDetailProps {
  viewStore?: ViewStore;
  selectedItem: View;
  onClose: () => void;
  isEditing: boolean;
}

const ViewSidebarDetail = ({
  viewStore,
  selectedItem,
  onClose,
  isEditing,
}: ViewSidebarDetailProps) => {
  const handleSubmit = (data: View) => {
    if (!data) {
      return;
    }

    if (isEditing) {
      viewStore?.updateAndSaveView(data);
    } else {
      viewStore?.createAndSaveView(data);
    }
  };

  return (
    <ResizableSidebar initialWidth={410} minWidth={300} maxWidth={700}>
      <ComponentWrapper
        title={selectedItem.name}
        action={
          <Row>
            <IconButton
              className={defaultStyles.mr10}
              type="submit"
              form="view-form"
              icon={isEditing ? faFloppyDisk : faPlus}
              label={isEditing ? "Speichern" : "Hinzufügen"}
              showBorder
            />

            <IconButton icon={faX} onClick={onClose} showBorder />
          </Row>
        }
      >
        <ViewForm
          initialView={selectedItem}
          onFormSubmit={handleSubmit}
          disabled={(selectedItem as any)?.core}
        />
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject("viewStore")(observer(ViewSidebarDetail));
