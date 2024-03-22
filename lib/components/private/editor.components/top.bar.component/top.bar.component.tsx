import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Column from "../../general.components/column.component/column.component";
import Row from "../../general.components/row.component/row.component";
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
  faCode,
} from "@fortawesome/pro-regular-svg-icons";
import PageStore from "../../../../stores/page.store";
import { useRef, useState } from "react";
import { useClickedOutside } from "../../../../globals/helpers/hook.helper";
import { Page } from "../../../../schemas/page.schemas/page.schema";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";

interface TopBarProps {
  editorStore?: EditorStore;
  widgetStore?: WidgetStore;
  pageStore?: PageStore;
}

const TopBar = ({
  editorStore,
  widgetStore,
  pageStore,
}: TopBarProps): JSX.Element => {
  const editorMode = editorStore?.editorMode;
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const pages = pageStore?.pages;
  const currentSelectedPage = pageStore?.currentSelectedPage;

  const topBarRef = useRef(null);

  // handle click outside for page dropdown
  useClickedOutside(topBarRef, () => setIsPageDropdownOpen(false));

  const itemClassName = (pageID: string | undefined) => {
    return (
      styles.pageItem +
      " " +
      (currentSelectedPage?.pageID === pageID ? styles.currentSelected : "")
    );
  };

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

  const buildChangePageDropdown = () => {
    if (isPageDropdownOpen) {
      return (
        <div className={styles.pageDropdownWrapper}>
          {pages?.map((page: Page) => {
            return (
              <Row
                className={itemClassName(page?.pageID)}
                key={page.pageID}
                onClick={() => {
                  // handleSelectItem(page?.pageID);
                }} // TODO Finish this file maby create a separate compoent for the dropdown
              >
                <FontAwesomeIcon icon={faCode} className={styles.codeIcon} />
                <RunningText>{page.name} ....</RunningText>
              </Row>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div ref={topBarRef} className={styles.topBar}>
      <div
        className={styles.pageDropdownButton}
        onClick={() => {
          setIsPageDropdownOpen(!isPageDropdownOpen);
        }}
      >
        <TitleText>{pageStore?.currentSelectedPage?.name ?? "-"}</TitleText>
      </div>

      <BreakpointSettings />

      <SizedContainer size="s">
        <Column alignItems="flex-end">
          <Column alignItems="center">{renderPreviewModeButton()}</Column>
        </Column>
      </SizedContainer>

      {buildChangePageDropdown()}
    </div>
  );
};

export default inject(
  "editorStore",
  "widgetStore",
  "pageStore"
)(observer(TopBar));
