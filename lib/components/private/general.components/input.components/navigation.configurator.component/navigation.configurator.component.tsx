import { useState, useEffect } from "react";
import styles from "./navigation.configurator.component.module.scss";
import SelectDropDown from "../select.dropdown.component/select.dropdown.component";
import TextInput from "../../outlined.text.input.component/outlined.text.input.component";
import { inject, observer } from "mobx-react";
import PageStore from "../../../../../stores/page.store";
import ViewStore from "../../../../../stores/view.store";
import {
  NavigationActionType,
  NavigationParams,
} from "../../../../../globals/interfaces/navigation.interface";

interface SelectOption {
  label: string;
  value: string;
}

interface NavigationConfiguratorProps {
  onNavigationParamsChange: (params: NavigationParams) => void;
  initialParams?: NavigationParams;
  pageStore?: PageStore;
  viewStore?: ViewStore;
}

const NavigationConfigurator = ({
  onNavigationParamsChange,
  initialParams,
  pageStore,
  viewStore,
}: NavigationConfiguratorProps) => {
  // Convert pages and views to select options
  const pageOptions: SelectOption[] =
    pageStore?.pages.map((page) => ({
      label: page.name,
      value: page.pageID,
    })) || [];

  const viewOptions: SelectOption[] =
    viewStore?.viewsForCurrentPage.map((view) => ({
      label: view.name,
      value: view.viewID,
    })) || [];

  // States for action type, target ID, and params
  const [actionType, setActionType] = useState(
    initialParams?.actionType || NavigationActionType.NAV_TO_VIEW
  );
  const [targetID, setTargetID] = useState(initialParams?.targetID || "");
  const [params, setParams] = useState<Record<string, any>>(
    initialParams?.params || {}
  );

  // Effect to trigger callback on state change
  useEffect(() => {
    onNavigationParamsChange({ actionType, targetID, params });
  }, [actionType, targetID, params]);

  // Handlers for select change
  const handleActionTypeChange = (selectedOption: SelectOption | null) => {
    if (!selectedOption) return;
    setActionType(selectedOption.value as NavigationActionType);
    // Reset targetID and params when action type changes
    setTargetID("");
    setParams({});
  };

  const handleTargetChange = (selectedOption: SelectOption | null) => {
    if (!selectedOption) return;
    setTargetID(selectedOption.value);
    // Set default params based on the selected target
    const defaultParams =
      actionType === NavigationActionType.NAV_TO_VIEW
        ? { viewID: selectedOption.value }
        : { pageID: selectedOption.value };
    setParams(defaultParams);
  };

  // Options for action type dropdown
  const actionTypeOptions = [
    { value: NavigationActionType.NAV_TO_VIEW, label: "Navigate to View" },
    { value: NavigationActionType.NAV_TO_PAGE, label: "Navigate to Page" },
  ];

  // Determine the current options based on the selected action type
  const currentOptions =
    actionType === NavigationActionType.NAV_TO_VIEW ? viewOptions : pageOptions;

  const targetSelectLabel =
    actionType === NavigationActionType.NAV_TO_VIEW
      ? "Select View"
      : "Select Page";

  return (
    <div className={styles.navigationConfigurator}>
      <SelectDropDown
        label="Action Type"
        items={actionTypeOptions}
        selectedItem={actionType}
        onChange={handleActionTypeChange}
      />

      <SelectDropDown
        label={targetSelectLabel}
        key={actionType} // Re-render component when actionType changes
        items={currentOptions}
        selectedItem={targetID}
        onChange={handleTargetChange}
      />

      {/* Dynamically generate parameter inputs */}
      {Object.entries(params).map(([key, value]) => (
        <TextInput
          key={key}
          label={key}
          value={value}
          onValueChange={(newValue) =>
            setParams({ ...params, [key]: newValue })
          }
        />
      ))}
    </div>
  );
};

export default inject(
  "pageStore",
  "viewStore"
)(observer(NavigationConfigurator));
