import { inject, observer } from "mobx-react";
import EditorStore from "../../../../stores/editor.store";
import ConfigProvider from "../../../../config/config.provider";
import { LayoutConfig } from "../../../../main";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./breakpoint.settings.component.module.scss";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";

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

  const handleBreakpointChange = (breakpointKey: string) => {
    const config = editorStore?.breakpointEditorConfig;
    const selectedConfig = config?.[breakpointKey];

    if (selectedConfig) {
      let screenWidth;
      if (
        selectedConfig.minWidth !== null &&
        selectedConfig.maxWidth !== null
      ) {
        // Beide Werte sind vorhanden, setzen Sie screenWidth auf den Mittelwert
        screenWidth = (selectedConfig.minWidth + selectedConfig.maxWidth) / 2;
      } else if (
        selectedConfig.maxWidth === null &&
        selectedConfig.minWidth !== null
      ) {
        // Nur minWidth ist vorhanden
        screenWidth = selectedConfig.minWidth + 100; // Addieren Sie 100, um innerhalb des Breakpoints zu bleiben
      } else if (
        selectedConfig.minWidth === null &&
        selectedConfig.maxWidth !== null
      ) {
        // Nur maxWidth ist vorhanden
        screenWidth = selectedConfig.maxWidth - 100; // Subtrahieren Sie 100, um innerhalb des Breakpoints zu bleiben
      } else {
        // Weder minWidth noch maxWidth sind vorhanden, nutzen Sie einen Standardwert
        screenWidth = 500; // Oder ein anderer sinnvoller Standardwert
      }

      console.log("set curren sceen width:::: ", screenWidth);
      editorStore?.setCurrentScreenWidth(screenWidth);
      editorStore?.setCurrentBreakpoint(breakpointKey);
    }
  };

  const _buildBreakpointItem = (preparedLayoutConfigs: any): JSX.Element => {
    const selected = currentBreakpoint === preparedLayoutConfigs.key;

    return (
      <FontAwesomeIcon
        icon={preparedLayoutConfigs.icon}
        className={`${styles.breakpointIcon} ${
          selected ? styles.selected : ""
        }`}
        onClick={() => handleBreakpointChange(preparedLayoutConfigs.key)}
      />
    );
  };

  return (
    <div className={styles.breakpointSettings}>
      {preparedLayoutConfigs.map((layoutConfig) => {
        return <div>{_buildBreakpointItem(layoutConfig)}</div>;
      })}

      <div className={styles.currentScreenWidth}>
        {editorStore?.currentScreenWidth} PX | MAX:{" "}
        {editorStore?.breakpointEditorConfigForCurrentBreakpoint?.maxWidth} PX |{" "}
        MIN: {editorStore?.breakpointEditorConfigForCurrentBreakpoint?.minWidth}{" "}
        PX
      </div>
      <RunningText>{editorStore?.currentBreakpoint}</RunningText>
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
