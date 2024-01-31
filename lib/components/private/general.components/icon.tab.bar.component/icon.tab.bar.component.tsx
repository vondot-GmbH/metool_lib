import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./icon.tab.bar.component.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface Tab {
  name: string;
  icon: IconProp;
}

interface IconTabBarProps {
  tabs: Tab[];
  selected: string;
  onSelect: (name: string) => void;
  barWidth?: number;
  style?: React.CSSProperties;
}

const IconTabBar = ({
  tabs,
  selected,
  onSelect,
  barWidth = 50,
  style,
}: IconTabBarProps) => {
  return (
    <div className={styles.tabBar} style={{ width: `${barWidth}px`, ...style }}>
      {tabs.map((tab: Tab) => (
        <div
          key={tab.name}
          className={`${styles.tabItem} ${
            selected === tab.name ? styles.selected : ""
          }`}
          onClick={() => onSelect(tab.name)}
        >
          <FontAwesomeIcon icon={tab.icon} size="lg" />
        </div>
      ))}
    </div>
  );
};

export default IconTabBar;
