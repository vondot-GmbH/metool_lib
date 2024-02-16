/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import styles from "./option.sidebar.component.module.scss";
import WidgetStore from "../../../../stores/widget.store";
import EditorStore from "../../../../stores/editor.store";
import { EditorMode } from "../../../../globals/enums/editor.enum";
import { inject, observer } from "mobx-react";
import ConfigProvider from "../../../../config/config.provider";
import Row from "../../general.components/row.component/row.component";
import Column from "../../general.components/column.component/column.component";
import Image from "../../general.components/image.component/image.component";
import TitleText from "../../general.components/text.components/title.text.component/title.text.component";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";

const SidebarContext = createContext({
  views: [] as ReactNode[],
  titles: [] as string[],
  pushView: (view: ReactNode, title: string, initialView?: boolean) => {},
  popView: () => {},
});

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [views, setViews] = useState<ReactNode[]>([]);
  const [titles, setTitles] = useState<string[]>([]);

  const pushView = (view: ReactNode, title: string, initialView?: boolean) => {
    if (initialView) {
      setViews([view]);
      setTitles([title]);
      return;
    }

    setViews((prevViews) => [...prevViews, view]);
    setTitles((prevTitles) => [...prevTitles, title]);
  };

  const popView = () => {
    setViews((prevViews) => prevViews.slice(0, -1));
    setTitles((prevTitles) => prevTitles.slice(0, -1));
  };

  return (
    <SidebarContext.Provider value={{ views, titles, pushView, popView }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

export interface OptionSidebarProps {
  widgetStore?: WidgetStore;
  editorStore?: EditorStore;
}

const OptionSidebar = ({ widgetStore, editorStore }: OptionSidebarProps) => {
  const { pushView, views, titles, popView } = useSidebar();

  const registeredWidgets = ConfigProvider.getInstance().getRegisteredWidgets();
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;

  const selectedWidgetType =
    widgetStore?.getSelectedWidget()?.widget.widgetType;

  const selectedWidgetConfig = registeredWidgets?.find(
    (widget) => widget.type === selectedWidgetType
  );

  const setSidebarForSelectedWidget = () => {
    if (editorStore?.editorMode !== EditorMode.EDIT) return;

    const selectedWidgetConfig = registeredWidgets.find(
      (widget) => widget.type === selectedWidgetType
    );

    console.log("selectedWidgetConfig", selectedWidgetConfig);

    if (!selectedWidgetConfig || !selectedWidgetConfig.sidebarComponent) {
      return;
    }

    const SidebarComponent = selectedWidgetConfig.sidebarComponent;

    pushView(
      [<SidebarComponent widgetStore={widgetStore} key={selectedWidgetType} />],
      "",
      true
    );
  };

  useEffect(() => {
    setSidebarForSelectedWidget();
  }, [selectedWidgetID, editorStore?.editorMode]);

  if (editorStore?.editorMode !== EditorMode.EDIT) return;

  if (!selectedWidgetConfig || !selectedWidgetConfig.sidebarComponent) {
    return <div className={styles.optionSidebar}></div>;
  }

  const currentView = views[views.length - 1];
  const currentTitle = titles[titles.length - 1];

  return (
    <div className={styles.optionSidebar}>
      <Row className={styles.sidebarHeader} justifyContent="space-between">
        <Column>
          <Row className={styles.widgetInfoWrapper}>
            <Image
              imageUrl={selectedWidgetConfig?.icon}
              className={styles.widgetIcon}
            />
            <TitleText>{selectedWidgetConfig?.name}</TitleText>
          </Row>
          <RunningText>{currentTitle}</RunningText>
        </Column>
        <div>
          {views.length > 1 && (
            <button onClick={popView} className={styles.backButton}>
              Zurück
            </button>
          )}
        </div>
      </Row>
      <div className={styles.sidebarContent}>{currentView}</div>
    </div>
  );
};

export default inject("widgetStore", "editorStore")(observer(OptionSidebar));
