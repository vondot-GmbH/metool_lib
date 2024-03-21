import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../../general.components/column.component/column.component";
import Row from "../../general.components/row.component/row.component";
import SizedContainer from "../../general.components/sized.container.component/sized.container.component";
import TitleText from "../../general.components/text.components/title.text.component/title.text.component";
import BreakpointSettings from "../breakpoint.settings.component/breakpoint.settings.component";
import { EditorMode } from "../../../../globals/enums/editor.enum";

import EditorStore from "../../../../stores/editor.store";
import WidgetStore from "../../../../stores/widget.store";
import defaultStyles from "../../../../styles/index.module.scss";
import styles from "./top.bar.component.module.scss";
import { inject, observer } from "mobx-react";
import {
  faCircleXmark,
  faCirclePlay,
} from "@fortawesome/pro-regular-svg-icons";
import ViewStore from "../../../../stores/view.store";

interface TopBarProps {
  editorStore?: EditorStore;
  widgetStore?: WidgetStore;
  viewStore?: ViewStore;
}

const TopBar = ({
  editorStore,
  widgetStore,
  viewStore,
}: TopBarProps): JSX.Element => {
  const editorMode = editorStore?.editorMode;

  const renderPreviewModeButton = (): JSX.Element => {
    let mode = EditorMode.EDIT;

    if (editorMode == EditorMode.EDIT) {
      mode = EditorMode.PREVIEW;
    }

    return (
      <div className={styles.previewModeButton}>
        <FontAwesomeIcon
          icon={editorMode == EditorMode.EDIT ? faCirclePlay : faCircleXmark}
          size="lg"
          onClick={() => {
            editorStore?.changeEditorMode(mode);
            widgetStore?.setSelectWidget(undefined);
          }}
        />
      </div>
    );
  };

  return (
    <Row
      className={styles.topBar}
      alignItems="center"
      justifyContent="space-between"
    >
      <SizedContainer size="s">
        <Column justifyContent="flex-start">
          <TitleText className={defaultStyles.ml20}>
            {viewStore?.currentSelectedView?.name ?? "--"}
          </TitleText>
        </Column>
      </SizedContainer>

      <BreakpointSettings />

      <SizedContainer size="s">
        <Column alignItems="flex-end">
          <Column alignItems="center">{renderPreviewModeButton()}</Column>
        </Column>
      </SizedContainer>
    </Row>
  );
};

export default inject(
  "editorStore",
  "widgetStore",
  "viewStore"
)(observer(TopBar));
