import { useRef, useState } from "react";
import styles from "./resizable.screen.wrapper.component.module.scss";

interface ResizableSidebarProps {
  children: React.ReactNode;
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

const ResizableScreenWrapper = ({
  children,
  initialWidth = 300,
  minWidth = 100,
  maxWidth = 500,
}: ResizableSidebarProps): JSX.Element => {
  const [width, setWidth] = useState(initialWidth);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // handle mouse down event for resizing
  const handleMouseDown = (e: { clientX: number }) => {
    // get the dimensions of the sidebar and the initial mouse position.
    // because it can be that the sidebar is not at the left edge of the screen.
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const initialMouseX = e.clientX - (sidebarRect ? sidebarRect.left : 0);

    // handle mouse move during resizing.
    const handleMouseMove = (e: { clientX: number }) => {
      if (!sidebarRect) return;
      const widthChange = e.clientX - sidebarRect.left - initialMouseX;

      // Calculate the new width of the sidebar within the min and max width.
      const newWidth = Math.min(
        Math.max(width + widthChange, minWidth),
        maxWidth
      );
      setWidth(newWidth);
    };

    // handle mouse up event for resizing (stop resizing)
    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    // Add event listeners for mouse move and mouse up events
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      ref={sidebarRef}
      className={styles.screenWrapper}
      style={{ width: `${width}px` }}
    >
      {children}
      <div className={styles.resizer} onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default ResizableScreenWrapper;
