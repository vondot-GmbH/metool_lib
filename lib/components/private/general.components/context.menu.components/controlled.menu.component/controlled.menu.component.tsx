import styles from "./controlled.menu.component.module.scss";

interface ControlledMenuProps {
  isOpen: boolean;
  anchorPoint: { x: number; y: number };
  onClose: () => void;
  children: React.ReactNode;
}

const ControlledMenu = ({
  isOpen,
  anchorPoint,
  onClose,
  children,
}: ControlledMenuProps): JSX.Element | null => {
  if (!isOpen) return null;

  console.log(anchorPoint);

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div
        className={styles.menu}
        style={{ top: `${anchorPoint.y}px`, left: `${anchorPoint.x}px` }}
      >
        {children}
      </div>
    </>
  );
};

export default ControlledMenu;
