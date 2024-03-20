import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import WidgetStore from "../../../../../stores/widget.store";
import IconTabBar from "../../../general.components/icon.tab.bar.component/icon.tab.bar.component";
import EditorStore from "../../../../../stores/editor.store";
import { EditorMode } from "../../../../../globals/enums/editor.enum";
import { useState } from "react";
import StateSidebar from "../state.sidebar.component/state.sidebar.component";
import WidgetSidebar from "../widget.sidebar.component/widget.sidebar.component";
import CodeSidebar from "../code.sidebar.components/code.sidebar.component/code.sidebar.component";
import StateStore from "../../../../../stores/state.store";
import styles from "./configuration.sidebar.component.module.scss";
import Row from "../../../general.components/row.component/row.component";
import ResourceStore from "../../../../../stores/resource.store";
import {
  faCode,
  faDatabase,
  faFiles,
  faSquarePollHorizontal,
  faTable,
} from "@fortawesome/pro-light-svg-icons";
import ViewSidebar from "../view.sidebar.components/view.sidebar.component/view.sidebar.component";
import ResourceSidebar from "../resource.sidebar.components/resource.sidebar.component/resource.sidebar.component";

enum TabBarType {
  VIEWS = "Views",
  WIDGETS = "Widgets",
  STATES = "States",
  CODE = "Code",
  RESOURCES = "Resources",
}

interface ConfigurationSidebarProps {
  widgetStore?: WidgetStore;
  queryStore?: QueryStore; // TODO do we need this here?
  editorStore?: EditorStore;
  stateStore?: StateStore;
  resourceStore?: ResourceStore;
}

const ConfigurationSidebar = ({
  editorStore,
}: ConfigurationSidebarProps): JSX.Element => {
  const [selectedConfigurationBar, setSelectedConfigurationBar] =
    useState<TabBarType>(TabBarType.WIDGETS);

  const _buildTabBar = (): JSX.Element | null => {
    if (editorStore?.editorMode != EditorMode.EDIT) {
      return null;
    }

    return (
      <IconTabBar
        tabs={[
          {
            icon: faFiles,
            name: "Views",
          },
          {
            icon: faTable,
            name: "Widgets",
          },
          {
            icon: faSquarePollHorizontal,
            name: "States",
          },
          {
            icon: faCode,
            name: "Code",
          },
          {
            icon: faDatabase,
            name: "Resources",
          },
        ]}
        onSelect={(name: string) => {
          setSelectedConfigurationBar(name as TabBarType);
        }}
        selected={selectedConfigurationBar}
      />
    );
  };

  const _buildCanvasConfigurationBar = (): JSX.Element | null => {
    if (editorStore?.editorMode !== EditorMode.EDIT) {
      return null;
    }

    let sidebarToRender: JSX.Element | null = null;

    switch (selectedConfigurationBar) {
      case TabBarType.WIDGETS:
        sidebarToRender = <WidgetSidebar />;
        break;
      case TabBarType.STATES:
        sidebarToRender = <StateSidebar />;
        break;
      case TabBarType.CODE:
        sidebarToRender = <CodeSidebar />;
        break;
      case TabBarType.RESOURCES:
        sidebarToRender = <ResourceSidebar />;
        break;
      case TabBarType.VIEWS:
        sidebarToRender = <ViewSidebar />;
        break;
      default:
        sidebarToRender = null;
    }

    return <div>{sidebarToRender}</div>;
  };

  return (
    <Row className={styles.configurationSidebar}>
      {_buildTabBar()}
      {_buildCanvasConfigurationBar()}
    </Row>
  );
};

export default inject(
  "widgetStore",
  "queryStore",
  "editorStore",
  "stateStore",
  "resourceStore"
)(observer(ConfigurationSidebar));
