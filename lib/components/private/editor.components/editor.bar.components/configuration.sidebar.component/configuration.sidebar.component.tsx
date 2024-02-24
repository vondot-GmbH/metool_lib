import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import WidgetStore from "../../../../../stores/widget.store";
import IconTabBar from "../../../general.components/icon.tab.bar.component/icon.tab.bar.component";
import EditorStore from "../../../../../stores/editor.store";
import { EditorMode } from "../../../../../globals/enums/editor.enum";
import {
  faSquarePlus,
  faXmarkCircle,
  faFileCode,
} from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import StateSidebar from "../state.sidebar.component/state.sidebar.component";
import WidgetSidebar from "../widget.sidebar.component/widget.sidebar.component";
import CodeSidebar from "../code.sidebar.components/code.sidebar.component/code.sidebar.component";
import ResizableSidebar from "../../../general.components/resizable.sidbear.component/resizable.sidebar.component";
import StateStore from "../../../../../stores/state.store";
import styles from "./configuration.sidebar.component.module.scss";
import Row from "../../../general.components/row.component/row.component";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ConfigurationSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore;
  editorStore?: EditorStore;
  stateStore?: StateStore;
}

const ConfigurationSidebar = ({
  widgetStore,
  queryStore,
  editorStore,
  stateStore,
}: ConfigurationSidebarProps): JSX.Element => {
  const [selectedConfigurationBar, setSelectedConfigurationBar] =
    useState<string>("Widgets");

  const [selectedCodeItem, setSelectedCodeItem] = useState<string | undefined>(
    undefined
  );

  const _buildTabBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

    return (
      <IconTabBar
        style={{ borderRight: "1px solid #e0e0e0" }} // TODO
        tabs={[
          {
            icon: faSquarePlus,
            name: "Widgets",
          },
          {
            icon: faXmarkCircle,
            name: "States",
          },
          {
            icon: faFileCode,
            name: "Code",
          },
        ]}
        onSelect={(name: string) => {
          setSelectedConfigurationBar(name);
        }}
        selected={selectedConfigurationBar}
      />
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

    let sidebarToRender: JSX.Element | null = null;

    if (selectedConfigurationBar == "Widgets") {
      sidebarToRender = <WidgetSidebar />;
    } else if (selectedConfigurationBar == "States") {
      sidebarToRender = (
        <StateSidebar widgetStore={widgetStore} stateStore={stateStore} />
      );
    } else if (selectedConfigurationBar == "Code") {
      sidebarToRender = (
        <CodeSidebar
          onItemSelect={(item: string) => {
            setSelectedCodeItem(item);
          }}
        />
      );
    }

    return (
      <ResizableSidebar initialWidth={220} minWidth={150} maxWidth={330}>
        {sidebarToRender}
      </ResizableSidebar>
    );
  };

  const _buildCodeDetalConfigurationBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT || !selectedCodeItem) {
      return null;
    }

    return (
      <ResizableSidebar initialWidth={300} minWidth={200} maxWidth={500}>
        <ComponentWrapper
          title={selectedCodeItem}
          action={
            <FontAwesomeIcon
              icon={faXmarkCircle}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCodeItem(undefined)}
            />
          }
        >
          ....
        </ComponentWrapper>
      </ResizableSidebar>
    );
  };

  return (
    <Row className={styles.configurationSidebar}>
      {_buildTabBar()}
      {_buildCanvasConfigurationBar()}
      {_buildCodeDetalConfigurationBar()}
    </Row>
  );
};

export default inject(
  "widgetStore",
  "queryStore",
  "editorStore",
  "stateStore"
)(observer(ConfigurationSidebar));
