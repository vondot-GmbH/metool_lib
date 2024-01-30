import ReactDOM from "react-dom";
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

  const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: anchorPoint.y,
    left: anchorPoint.x,
    zIndex: 999,
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onClose();
  };

  return ReactDOM.createPortal(
    <div style={overlayStyles} onClick={handleOverlayClick}>
      <div className={styles.menu}>{children}</div>
    </div>,
    document.body
  );
};

export default ControlledMenu;
