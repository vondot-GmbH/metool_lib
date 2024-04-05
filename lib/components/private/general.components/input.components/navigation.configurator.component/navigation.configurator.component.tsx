import { useState, useEffect } from "react";
import styles from "./navigation.configurator.component.module.scss";
import SelectDropDown from "../select.dropdown.component/select.dropdown.component";
import TextInput from "../text.input.component/text.input.component";
import { inject, observer } from "mobx-react";
import PageStore from "../../../../../stores/page.store";
import ViewStore from "../../../../../stores/view.store";
import {
  NavigationActionType,
  NavigationParams,
} from "../../../../../globals/interfaces/navigation.interface";
import RunningText from "../../text.components/running.text.component/running.text.component";

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
  label?: string;
}

const NavigationConfigurator = ({
  onNavigationParamsChange,
  initialParams,
  pageStore,
  viewStore,
  label = "Navigation Configurator",
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

  const shouldShowTargetAndParams =
    actionType === NavigationActionType.NAV_TO_VIEW ||
    actionType === NavigationActionType.NAV_TO_PAGE;

  useEffect(() => {
    onNavigationParamsChange({ actionType, targetID, params });
  }, [actionType, targetID, params]);

  const actionTypeOptions: SelectOption[] = [
    {
      label: "Navigate to View",
      value: NavigationActionType.NAV_TO_VIEW,
    },
    {
      label: "Navigate to Page",
      value: NavigationActionType.NAV_TO_PAGE,
    },
    {
      label: "Navigate Back",
      value: NavigationActionType.NAV_BACK,
    },
    {
      label: "Navigate Forward",
      value: NavigationActionType.NAV_FORWARD,
    },
  ];

  const renderParamsInputs = () => {
    if (actionType === NavigationActionType.NAV_TO_VIEW && targetID) {
      const view = viewStore?.getView(targetID);
      return view?.params?.map((param) => (
        <TextInput
          className={styles.paramInput}
          key={param.key}
          label={param.key}
          value={params[param.key] || ""}
          onValueChange={(newValue) =>
            setParams({ ...params, [param.key]: newValue })
          }
        />
      ));
    } else if (actionType === NavigationActionType.NAV_TO_PAGE && targetID) {
      const page = pageStore?.getPage(targetID);
      return page?.params?.map((param) => (
        <TextInput
          className={styles.paramInput}
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

  return (
    <div className={styles.navigationConfigurator}>
      <div className={styles.headerContainer}>
        {label != null && <RunningText>{label}</RunningText>}
      </div>

      <div className={styles.bodyContainer}>
        <SelectDropDown
          label="Action Type"
          items={actionTypeOptions}
          selectedItem={actionType}
          onChange={handleActionTypeChange}
          className={styles.actionTypeSelect}
        />

        {shouldShowTargetAndParams && (
          <SelectDropDown
            label={
              actionType === NavigationActionType.NAV_TO_VIEW
                ? "Select View"
                : "Select Page"
            }
            className={styles.targetSelect}
            items={currentOptions}
            selectedItem={targetID}
            onChange={handleTargetChange}
          />
        )}

        {renderParamsInputs()}
      </div>
    </div>
  );
};

export default inject(
  "pageStore",
  "viewStore"
)(observer(NavigationConfigurator));
