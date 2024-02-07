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
    const config = editorStore?.breakpointEditorConfig[breakpointKey];

    // TODO find a better way to set the current screen width
    const screenWidth = config?.minWidth ?? 300;

    editorStore?.setCurrentScreenWidth(screenWidth);
    editorStore?.setCurrentBreakpoint(breakpointKey);
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
