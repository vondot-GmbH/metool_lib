import { inject, observer } from "mobx-react";
import EditorStore from "../../../../stores/editor.store";
import ConfigProvider from "../../../../config/config.provider";
import { LayoutConfig } from "../../../../main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./breakpoint.settings.component.module.scss";

interface BreakpointSettingsProps {
  editorStore?: EditorStore;
}

const BreakpointSettings = ({
  editorStore,
}: BreakpointSettingsProps): JSX.Element => {
  const configProvider = ConfigProvider.getInstance();
  const layoutConfig = configProvider.getLayoutConfig();
  const currentBreakpoint = editorStore?.currentBreakpoint;
  const preparedLayoutConfigs = prepareLayoutConfigs(layoutConfig);

  const _buildBreakpointItem = (preparedLayoutConfigs: any): JSX.Element => {
    const selected = currentBreakpoint === preparedLayoutConfigs.key;

    return (
      <FontAwesomeIcon
        icon={preparedLayoutConfigs.icon}
        className={`${styles.breakpointIcon} ${
          selected ? styles.selected : ""
        }`}
        onClick={() =>
          editorStore?.setCurrentBreakpoint(preparedLayoutConfigs.key)
        }
      />
    );
  };

  return (
    <div className={styles.breakpointSettings}>
      {preparedLayoutConfigs.map((layoutConfig) => {
        return <div>{_buildBreakpointItem(layoutConfig)}</div>;
      })}
    </div>
  );
};

// helper function to prepare layout configs for rendering
const prepareLayoutConfigs = (layoutConfig: LayoutConfig) => {
  const rootLayoutConfig = layoutConfig.root;

  const preparedLayoutConfigs = Object.entries(rootLayoutConfig).map(
    ([key, config]) => ({
      key,
      ...config,
    })
  );

  return preparedLayoutConfigs;
};

export default inject("editorStore")(observer(BreakpointSettings));
