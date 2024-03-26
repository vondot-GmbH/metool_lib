import { inject, observer } from "mobx-react";
import PageStore from "../../../../../../stores/page.store";
import styles from "./page.detail.sidebar.component.module.scss";
import {
  Page,
  pageSchema,
} from "../../../../../../schemas/page.schemas/page.schema";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import { faFloppyDisk, faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import defaultStyles from "../../../../../../styles/index.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

interface PageDetailSidebarProps {
  pageStore?: PageStore;
  selectedItem: Page;
  onClose: () => void;
  isEditing: boolean;
}

const PageDetailSidebar = ({
  pageStore,
  selectedItem,
  isEditing,
  onClose,
}: PageDetailSidebarProps): JSX.Element => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pageSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: (selectedItem as any) ?? {},
  });

  return (
    <ComponentWrapper
      className={styles.pageDetialSidbarWrapper}
      title={selectedItem.name}
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
      {/* // TODO COMPLETE FORM */}
      <div>{selectedItem.name}</div>
    </ComponentWrapper>
  );
};

export default inject("pageStore")(observer(PageDetailSidebar));
