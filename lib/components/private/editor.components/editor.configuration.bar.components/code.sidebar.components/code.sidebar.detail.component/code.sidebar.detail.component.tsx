import { inject, observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import ResizableSidebar from "../../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import TextInput from "../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import QueryStore from "../../../../../../stores/query.store";

interface CodeSidebarDetailProps {
  queryStore?: QueryStore;
  selectedItem?: string;
  onClose: () => void;
}

const CodeSidebarDetail = ({
  selectedItem,
  onClose,
}: CodeSidebarDetailProps): JSX.Element | null => {
  return (
    <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={500}>
      <ComponentWrapper
        title={selectedItem}
        action={
          <FontAwesomeIcon
            icon={faXmarkCircle}
            style={{ cursor: "pointer" }}
            onClick={onClose}
          />
        }
      >
        <form>
          <TextInput label="Name" value={selectedItem} onChange={() => {}} />
          <TextInput label="Name" value={selectedItem} onChange={() => {}} />
          <TextInput label="Name" value={selectedItem} onChange={() => {}} />
        </form>
      </ComponentWrapper>
    </ResizableSidebar>
  );
};

export default inject("queryStore")(observer(CodeSidebarDetail));
