import { Responsive, WidthProvider } from "react-grid-layout";
import {
  convertToGridLayout,
  generateGridLayoutBackground,
} from "../../../../globals/helpers/layout.helper";
import {
  LayoutBreakpoint,
  Widget,
} from "../../../../schemas/widget.schemas/widget.schema";
import { useEffect, useState } from "react";

interface GridLayoutProps {
  key: string;
  children: JSX.Element[];
  content: Widget[];
  rowHeight?: number;
  breakpoints: { [key: string]: number };
  cols: { [key in LayoutBreakpoint]: number };
  onDragStart?: ReactGridLayout.ItemCallback | undefined;
}

const ResponsiveGridLayout = WidthProvider(Responsive);
type BreakpointType = string;

const GridLayout = ({
  key,
  children,
  content,
  rowHeight = 50,
  breakpoints,
  cols,
  onDragStart,
}: GridLayoutProps): JSX.Element => {
  const layouts = convertToGridLayout(content);

  const [currentBreakpoint, setCurrentBreakpoint] = useState(""); // TODO set initial breakpoint based on window size
  const [gridBackground, setGridBackground] = useState("");

  const onBreakpointChange = (newBreakpoint: BreakpointType) => {
    console.log("onBreakpointChange", newBreakpoint);
    console.log();
    setCurrentBreakpoint(newBreakpoint);
  };

  useEffect(() => {
    const newGridBackground = generateGridLayoutBackground({
      cols,
      rowHeight,
      currentBreakpoint: currentBreakpoint as LayoutBreakpoint, // TODO
    });
    setGridBackground(newGridBackground);
  }, [currentBreakpoint, cols, rowHeight]);

  return (
    <ResponsiveGridLayout
      key={key}
      // className={styles.layout}
      onDragStart={onDragStart}
      margin={[0, 0]}
      layouts={layouts}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={rowHeight}
      style={{ background: gridBackground, height: "100%" }}
      onBreakpointChange={onBreakpointChange}
      compactType={null}
    >
      {children}
    </ResponsiveGridLayout>
  );
};

export default GridLayout;
