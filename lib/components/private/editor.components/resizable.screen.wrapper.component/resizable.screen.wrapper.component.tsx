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
      console.log("editorConfig", editorConfig);
      setMinWidth(editorConfig.minWidth);
      setMaxWidth(editorConfig.maxWidth);
    }
  }, [editorStore?.currentBreakpoint]);

  useEffect(() => {
    setWidth(editorStore?.currentScreenWidth ?? 500);
    console.log("current break point::: ", editorStore?.currentBreakpoint);
  }, [editorStore?.currentScreenWidth]);

  // handle mouse down event for resizing
  // const handleMouseDown = (e: {
  //   preventDefault: () => void;
  //   clientX: number;
  // }) => {
  //   e.preventDefault();
  //   // get the dimensions of the sidebar and the initial mouse position.
  //   // because it can be that the sidebar is not at the left edge of the screen.
  //   const sidebarRect = sidebarRef.current?.getBoundingClientRect();
  //   const initialMouseX = e.clientX - (sidebarRect ? sidebarRect.left : 0);

  //   // handle mouse move during resizing.
  //   const handleMouseMove = (e: { clientX: number }) => {
  //     if (!sidebarRect) return;
  //     const widthChange = e.clientX - sidebarRect.left - initialMouseX;

  //     // Calculate the new width of the sidebar within the min and max width.
  //     const newWidth = Math.min(
  //       Math.max(width + widthChange, minWidth),
  //       maxWidth
  //     );
  //     setWidth(newWidth);
  //     editorStore?.setCurrentScreenWidth(newWidth);
  //   };

  //   // handle mouse up event for resizing (stop resizing)
  //   const handleMouseUp = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   // Add event listeners for mouse move and mouse up events
  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

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
