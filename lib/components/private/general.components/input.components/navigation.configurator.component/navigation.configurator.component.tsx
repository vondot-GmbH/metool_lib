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

// TODO add validation to the navigation configurator

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
  const [actionType, setActionType] = useState<NavigationActionType>(
    initialParams?.actionType || NavigationActionType.NAV_TO_VIEW
  );

  const [targetID, setTargetID] = useState<string>(
    initialParams?.targetID || ""
  );

  const [params, setParams] = useState<Record<string, any>>(
    initialParams?.params || {}
  );

  useEffect(() => {
    onNavigationParamsChange({ actionType, targetID, params });
  }, [actionType, targetID, params]);

  const renderParamsInputs = () => {
    if (actionType === NavigationActionType.NAV_TO_VIEW && targetID) {
      const view = viewStore?.getView(targetID);
      return view?.params?.map((param) => (
        <TextInput
          key={param.key}
          label={param.key}
          value={params[param.key] || ""}
          onValueChange={(newValue) =>
            setParams({ ...params, [param.key]: newValue })
          }
        />
      ));
    }
    // Return empty array if no params to render
    return [];
  };

  const handleActionTypeChange = (selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setActionType(selectedOption.value as NavigationActionType);
      setTargetID("");
      setParams({});
    }
  };

  const handleTargetChange = (selectedOption: SelectOption | null) => {
    if (selectedOption) {
      setTargetID(selectedOption.value);
      setParams({});
    }
  };

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

  const currentOptions =
    actionType === NavigationActionType.NAV_TO_VIEW ? viewOptions : pageOptions;

  return (
    <div className={styles.navigationConfigurator}>
      <SelectDropDown
        label="Action Type"
        items={[
          {
            label: "Navigate to View",
            value: NavigationActionType.NAV_TO_VIEW,
          },
          {
            label: "Navigate to Page",
            value: NavigationActionType.NAV_TO_PAGE,
          },
        ]}
        selectedItem={actionType}
        onChange={handleActionTypeChange}
      />

      <SelectDropDown
        label={
          actionType === NavigationActionType.NAV_TO_VIEW
            ? "Select View"
            : "Select Page"
        }
        items={currentOptions}
        selectedItem={targetID}
        onChange={handleTargetChange}
      />

      {renderParamsInputs()}
    </div>
  );
};

export default inject(
  "pageStore",
  "viewStore"
)(observer(NavigationConfigurator));
