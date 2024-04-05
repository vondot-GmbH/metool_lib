import { inject, observer } from "mobx-react";
import EditorStore from "../../../../stores/editor.store";
import ConfigProvider from "../../../../config/config.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./breakpoint.settings.component.module.scss";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";
import Column from "../../general.components/ui.components/column.component/column.component";

interface BreakpointSettingsProps {
  editorStore?: EditorStore;
}

const BreakpointSettings = ({
  editorStore,
}: BreakpointSettingsProps): JSX.Element => {
  const configProvider = ConfigProvider.getInstance();
  const currentBreakpoint = editorStore?.currentBreakpoint;
  const preparedLayoutConfigs =
    configProvider.getBreakpointLayoutConfigForLevel("root");

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
        return (
          <div key={layoutConfig.breakpoint}>
            {_buildBreakpointItem(layoutConfig)}
          </div>
        );
      })}

      <Column alignItems="center" className={styles.currentBreakpoint}>
        <RunningText>{editorStore?.currentBreakpoint}</RunningText>
      </Column>
    </div>
  );
};

export default inject("editorStore")(observer(BreakpointSettings));
