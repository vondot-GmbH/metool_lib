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
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const initialMouseXRef = useRef<number>(0);
  const initialWidthRef = useRef<number>(500);

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

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      if (!isResizing) return;

      const widthChange = e.clientX - initialMouseXRef.current;
      const newWidth = Math.min(
        Math.max(initialWidthRef.current + widthChange, minWidth ?? 0),
        maxWidth ?? Infinity
      );

      setWidth(newWidth);
      editorStore?.setCurrentScreenWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (isResizing) {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isResizing, minWidth, maxWidth, editorStore]);

  const handleMouseDown = (e: any) => {
    e.preventDefault();
    setIsResizing(true);

    initialMouseXRef.current = e.clientX;
    initialWidthRef.current = width;
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
          isHovering || isResizing ? styles.hover : ""
        }`}
      ></div>
      <div
        className={`${styles.visualGuideLeft} ${
          isHovering || isResizing ? styles.hover : ""
        }`}
      ></div>
      <div
        className={styles.centralResizer}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={styles.resizerIcon}></div>
      </div>
      <div
        className={styles.sreenWidth}
        style={{ display: isHovering || isResizing ? "block" : "none" }}
      >
        {width} PX
      </div>
    </div>
  );
};

export default inject("editorStore")(observer(ResizableScreenWrapper));
