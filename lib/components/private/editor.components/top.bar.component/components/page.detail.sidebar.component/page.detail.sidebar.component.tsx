import { inject, observer } from "mobx-react";
import PageStore from "../../../../../../stores/page.store";
import styles from "./page.detail.sidebar.component.module.scss";
import { Page } from "../../../../../../schemas/page.schemas/page.schema";
import ComponentWrapper from "../../../../general.components/component.wrapper.component/component.wrapper.component";
import Row from "../../../../general.components/row.component/row.component";
import IconButton from "../../../../general.components/icon.button.component/icon.button.component";
import { faFloppyDisk, faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import defaultStyles from "../../../../../../styles/index.module.scss";
import { useCallback, useMemo, useState } from "react";
import ConfigProvider from "../../../../../../config/config.provider";
import { CorePageLayoutConfig } from "../../../../../../globals/interfaces/config.interface";
import SelectDropDown from "../../../../general.components/select.dropdown.component/select.dropdown.component";
import DashboardPageLayoutForm from "./components/dashboard.page.layout.form/dashboard.page.layout.form";

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
  const configProvider = ConfigProvider.getInstance();

  const [selectedPageLayout, setSelectedPageLayout] = useState<
    CorePageLayoutConfig | undefined
  >(configProvider.getPageLayoutConfig(selectedItem?.layoutConfig?.layoutID));

  const coreLayoutConfigs = useMemo(() => {
    return configProvider.getPageLayoutConfigs();
  }, [configProvider, selectedItem]);

  const handleLayoutChange = useCallback(
    (layoutID: string) => {
      const layout = configProvider.getPageLayoutConfig(layoutID);
      setSelectedPageLayout(layout);
    },
    [configProvider]
  );

  const handleSubmit = (data: Page) => {
    if (!data || !selectedPageLayout) {
      return;
    }

    // TODO
    const page = {
      ...data,
      layoutConfig: {
        layoutID: selectedPageLayout.layoutID,
      },
    };

    if (isEditing) {
      pageStore?.updateAndSavePage(page);
    } else {
      pageStore?.createAndSavePage(page);
    }
  };

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
      <SelectDropDown
        label="Layout"
        labelPropertyName="name"
        valuePropertyName="layoutID"
        selectedItem={selectedPageLayout?.layoutID}
        items={coreLayoutConfigs ?? []}
        onChange={(item: CorePageLayoutConfig) =>
          handleLayoutChange(item?.layoutID)
        }
      />

      {selectedPageLayout?.layoutID === "defaultDashboardLayout" && (
        <DashboardPageLayoutForm
          onFormSubmit={handleSubmit}
          disabled={false}
          initialPage={selectedItem}
        />
      )}
    </ComponentWrapper>
  );
};

export default inject("pageStore")(observer(PageDetailSidebar));
