import { useEffect, useRef, useState } from "react";
import styles from "./resizable.screen.wrapper.component.module.scss";
import { inject, observer } from "mobx-react";
import EditorStore from "../../../../stores/editor.store";

interface ResizableSidebarProps {
  children: React.ReactNode;
  editorStore?: EditorStore;
}

const ResizableScreenWrapper = ({
  children,
  editorStore,
}: ResizableSidebarProps): JSX.Element => {
  const editorConfig = editorStore?.breakpointEditorConfigForCurrentBreakpoint;
  const [width, setWidth] = useState(500);
  const [isHovering, setIsHovering] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const [minWidth, setMinWidth] = useState<number | null>(null);
  const [maxWidth, setMaxWidth] = useState<number | null>(null);

  useEffect(() => {
    if (editorConfig) {
      setMinWidth(editorConfig.minWidth);
      setMaxWidth(editorConfig.maxWidth);
    }
  }, [editorStore?.currentBreakpoint]);

  useEffect(() => {
    setWidth(editorStore?.currentScreenWidth ?? 500);
  }, [editorStore?.currentScreenWidth]);

  // handle mouse down event for resizing
  const handleMouseDown = (e: {
    preventDefault: () => void;
    clientX: number;
  }) => {
    e.preventDefault();
    const sidebarRect = sidebarRef.current?.getBoundingClientRect();
    const initialMouseX = e.clientX - (sidebarRect ? sidebarRect.left : 0);

    const handleMouseMove = (e: { clientX: number }) => {
      if (!sidebarRect) return;
      const widthChange = e.clientX - sidebarRect.left - initialMouseX;

      // Verwenden Sie 0 als Standardwert für minWidth und Infinity für maxWidth, wenn diese null sind
      const effectiveMinWidth = minWidth !== null ? minWidth : 0;
      const effectiveMaxWidth = maxWidth !== null ? maxWidth : Infinity;

      const newWidth = Math.min(
        Math.max(width + widthChange, effectiveMinWidth),
        effectiveMaxWidth
      );
      setWidth(newWidth);
      editorStore?.setCurrentScreenWidth(newWidth);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", handleMouseMove);
    });
  };

  return (
    <div
      ref={sidebarRef}
      className={styles.screenWrapper}
      style={{ width: `${width}px` }}
    >
      <div className={styles.contentContainer}>{children}</div>
      <div
        className={`${styles.visualGuideRight} ${
          isHovering ? styles.hover : ""
        }`}
      ></div>
      <div
        className={`${styles.visualGuideLeft} ${
          isHovering ? styles.hover : ""
        }`}
      ></div>
      <div
        className={styles.centralResizer}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      ></div>
    </div>
  );
};

export default inject("editorStore")(observer(ResizableScreenWrapper));
