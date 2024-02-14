import { useState, useCallback, ReactNode } from "react";
import RunningText from "../../general.components/text.components/running.text.component/running.text.component";
import styles from "./option.sidebar.component.module.scss";
import Row from "../../general.components/row.component/row.component";
import Image from "../../general.components/image.component/image.component";
import TitleText from "../../general.components/text.components/title.text.component/title.text.component";
import { WidgetConfig } from "../../../../main";
import Column from "../../general.components/column.component/column.component";

export interface ViewProps {
  pushView: (view: (props: ViewProps) => ReactNode, title: string) => void;
  popView: () => void;
}

interface OptionSidebarProps {
  initialView: (props: ViewProps) => ReactNode;
  additionalInitViewTitle?: string;
  selectedWidgetConfig: WidgetConfig;
}

const OptionSidebar = ({
  initialView,
  additionalInitViewTitle = "",
  selectedWidgetConfig,
}: OptionSidebarProps) => {
  const [viewStack, setViewStack] = useState<
    ((props: ViewProps) => React.ReactNode)[]
  >([initialView]);
  const [titlesStack, setTitlesStack] = useState<string[]>([
    additionalInitViewTitle,
  ]);

  const pushView = useCallback(
    (view: (props: ViewProps) => React.ReactNode, title: string) => {
      setViewStack((prevStack) => [...prevStack, view]);
      setTitlesStack((prevTitles) => [...prevTitles, title]);
    },
    []
  );

  const popView = useCallback(() => {
    setViewStack((prevStack) => prevStack.slice(0, -1));
    setTitlesStack((prevTitles) => prevTitles.slice(0, -1));
  }, []);

  const CurrentView = viewStack[viewStack.length - 1];
  const currentTitle = titlesStack[titlesStack.length - 1];

  return (
    <div className={styles.optionSidebar}>
      <Row className={styles.sidebarHeader} justifyContent="space-between">
        <Column>
          <Row className={styles.widgetInfoWrapper}>
            <Image
              imageUrl={selectedWidgetConfig.icon}
              className={styles.widgetIcon}
            />
            <TitleText>{selectedWidgetConfig.name}</TitleText>
          </Row>
          <RunningText>{currentTitle}</RunningText>
        </Column>
        <div>
          {titlesStack.length > 1 && (
            <button onClick={popView} className={styles.backButton}>
              Zurück
            </button>
          )}
        </div>
      </Row>
      <div className={styles.sidebarContent}>
        {CurrentView({ pushView, popView })}
      </div>
    </div>
  );
};

export default OptionSidebar;
