/* eslint-disable @typescript-eslint/no-explicit-any */
// GridLayout.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridLayoutProps {
  items: any[]; // Ersetzen Sie any durch den tatsächlichen Typ Ihrer Items
  itemRenderer: (item: any) => JSX.Element; // Ersetzen Sie any entsprechend
  breakpoints: { [key: string]: number };
  layouts: { [key: string]: Layout[] };
  cols: { [key: string]: number };
  width: number;
  margin: { [key: string]: [number, number] };
  rowHeight: number;
  isEditing: boolean;
  onLayoutChange: (layout: Layout[], breakpoint: string) => void;
  showGrid: boolean; // Zustand zum Ein- und Ausschalten des Grids
}

const GridLayout: React.FC<GridLayoutProps> = ({
  items,
  itemRenderer,
  breakpoints,
  layouts,
  cols,
  width,
  margin,
  rowHeight,
  isEditing,
  onLayoutChange,
  //   showGrid,
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("");

  // Funktion zum Ermitteln des aktuellen Breakpoints
  const getCurrentBreakpoint = useCallback(
    (width: number): string => {
      let breakpoint = "lg"; // Standardwert als Beispiel
      for (const [bp, bpWidth] of Object.entries(breakpoints)) {
        if (width <= bpWidth) {
          breakpoint = bp;
          break;
        }
      }
      return breakpoint;
    },
    [breakpoints]
  );

  useEffect(() => {
    setCurrentBreakpoint(getCurrentBreakpoint(width));
  }, [width, getCurrentBreakpoint]);

  const onLayoutChangeWrapped = useCallback(
    (nextLayout: Layout[]) => onLayoutChange(nextLayout, currentBreakpoint),
    [onLayoutChange, currentBreakpoint]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   const gridStyle = useMemo(
  //     () => ({
  //       width,
  //       // Optional: Ändern Sie die Hintergrundfarbe oder fügen Sie ein Bild hinzu, wenn das Grid angezeigt werden soll
  //       //   background: showGrid ? "rgba(0, 0, 0, 0.1)" : "transparent", // Beispiel für ein einfaches Rastermuster
  //       background: "black",
  //     }),
  //     [width, showGrid]
  //   );

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={rowHeight}
      width={width}
      margin={margin[currentBreakpoint]}
      isDraggable={isEditing}
      isResizable={isEditing}
      onLayoutChange={onLayoutChangeWrapped}
      style={{
        background: "black",
      }}
    >
      {items.map((item) => (
        <div key={item.id}>{itemRenderer(item)}</div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default GridLayout;
