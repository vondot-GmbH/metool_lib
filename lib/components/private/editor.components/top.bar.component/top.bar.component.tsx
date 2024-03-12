import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../../general.components/column.component/column.component";
import Row from "../../general.components/row.component/row.component";
import SizedContainer from "../../general.components/sized.container.component/sized.container.component";
import TitleText from "../../general.components/text.components/title.text.component/title.text.component";
import BreakpointSettings from "../breakpoint.settings.component/breakpoint.settings.component";
import { EditorMode } from "../../../../globals/enums/editor.enum";
import {
  faPlayCircle,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import EditorStore from "../../../../stores/editor.store";
import WidgetStore from "../../../../stores/widget.store";
import defaultStyles from "../../../../styles/index.module.scss";
import styles from "./top.bar.component.module.scss";
import { inject, observer } from "mobx-react";

interface TopBarProps {
  editorStore?: EditorStore;
  widgetStore?: WidgetStore;
}

const TopBar = ({ editorStore, widgetStore }: TopBarProps): JSX.Element => {
  const editorMode = editorStore?.editorMode;

  return (
    <Row
      className={styles.topBar}
      alignItems="center"
      justifyContent="space-between"
    >
      <SizedContainer size="s">
        <Column justifyContent="flex-start">
          <TitleText className={defaultStyles.ml20}>Project Name</TitleText>
        </Column>
      </SizedContainer>

      <BreakpointSettings />

      <SizedContainer size="s">
        <Column alignItems="flex-end">
          <Column alignItems="center">
            <FontAwesomeIcon
              icon={
                editorMode == EditorMode.EDIT ? faPlayCircle : faCircleXmark
              }
              size="lg"
              style={{ cursor: "pointer" }}
              onClick={() => {
                // TODO make this more pretty
                const mode =
                  editorMode == EditorMode.EDIT
                    ? EditorMode.PREVIEW
                    : EditorMode.EDIT;
                editorStore?.changeEditorMode(mode);
                widgetStore?.setSelectWidget(undefined);
              }}
            />
          </Column>
        </Column>
      </SizedContainer>
    </Row>
  );
};

export default inject("editorStore", "widgetStore")(observer(TopBar));
