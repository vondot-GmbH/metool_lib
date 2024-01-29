import styles from "./menu.item.component.module.scss";

interface MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
}

const MenuItem = ({ onClick, children }: MenuItemProps): JSX.Element => {
  return (
    <div
      className={styles.item}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (onClick) onClick(e);
      }}
    >
      {children}
    </div>
  );
};

export default MenuItem;
