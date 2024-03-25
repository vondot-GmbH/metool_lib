import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../../general.components/column.component/column.component";
import SizedContainer from "../../general.components/sized.container.component/sized.container.component";
import TitleText from "../../general.components/text.components/title.text.component/title.text.component";
import BreakpointSettings from "../breakpoint.settings.component/breakpoint.settings.component";
import { EditorMode } from "../../../../globals/enums/editor.enum";
import EditorStore from "../../../../stores/editor.store";
import WidgetStore from "../../../../stores/widget.store";
import styles from "./top.bar.component.module.scss";
import { inject, observer } from "mobx-react";
import {
  faCircleXmark,
  faCirclePlay,
} from "@fortawesome/pro-regular-svg-icons";
import PageStore from "../../../../stores/page.store";
import { useRef, useState } from "react";
import { useClickedOutside } from "../../../../globals/helpers/hook.helper";
import PageOverviewDropdown from "./components/page.overview.dropdown.compoment";
import ViewStore from "../../../../stores/view.store";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";

interface TopBarProps {
  editorStore?: EditorStore;
  widgetStore?: WidgetStore;
  pageStore?: PageStore;
  viewStore?: ViewStore;
}

const TopBar = ({
  editorStore,
  widgetStore,
  pageStore,
  viewStore,
}: TopBarProps): JSX.Element => {
  const topBarRef = useRef(null);
  const editorMode = editorStore?.editorMode;
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);

  // handle click outside for page dropdown
  useClickedOutside(topBarRef, () => setIsPageDropdownOpen(false));

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
            editorStore?.setSelectWidget(undefined);
          }}
        />
      </div>
    );
  };

  return (
    <div ref={topBarRef} className={styles.topBar}>
      <div
        className={styles.pageDropdownButton}
        onClick={() => {
          setIsPageDropdownOpen(!isPageDropdownOpen);
        }}
      >
        <TitleText className={styles.pageName}>
          {pageStore?.currentPageToRender?.name ?? "-"}
        </TitleText>
        <RunningText>{viewStore?.currentSelectedView?.name ?? "-"}</RunningText>
      </div>

      <BreakpointSettings />

      <SizedContainer size="s">
        <Column alignItems="flex-end">
          <Column alignItems="center">{renderPreviewModeButton()}</Column>
        </Column>
      </SizedContainer>

      {isPageDropdownOpen && (
        <PageOverviewDropdown
          onSelectedPageChange={() => {
            setIsPageDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default inject(
  "editorStore",
  "widgetStore",
  "pageStore",
  "viewStore"
)(observer(TopBar));
