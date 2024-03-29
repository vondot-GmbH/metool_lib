import React, { useEffect, useState } from "react";
import ConfigProvider from "../../../../../config/config.provider";
import LayoutAreaGridLayout from "../../layout.area.grid.layout.component/layout.area.grid.layout.component";
import LayoutStore from "../../../../../stores/layout.store";
import { inject, observer } from "mobx-react";
import { WidgetHierarchyMap } from "../../../../../schemas/widget.schemas/widget.schema";
import PageStore from "../../../../../stores/page.store";
import RenderWidget from "../render.widget.component/render.widget.component";
import EditorStore from "../../../../../stores/editor.store";
import { CorePageLayoutAreaConfig } from "../../../../../globals/interfaces/config.interface";

interface RenderPageLayoutProps {
  children?: React.ReactNode;
  readonly?: boolean;
  showVisualWidgetOutline?: boolean;
  layoutStore?: LayoutStore;
  editorStore?: EditorStore;
  pageStore?: PageStore;
}

const RenderPageLayout = ({
  children,
  readonly = true,
  showVisualWidgetOutline = false,
  layoutStore,
  pageStore,
  editorStore,
}: RenderPageLayoutProps) => {
  const configProvider = ConfigProvider.getInstance();
  const pageLayoutConfig = pageStore?.currentPageToRender?.layoutConfig;
  const pageToRender = pageStore?.currentPageToRender?.pageID;
  const selectedWidgetID = editorStore?.selectedWidget?.widget.widgetID;
  const currentBreakpoint = editorStore?.currentBreakpoint;

  const [isLoading, setIsLoading] = useState(true);
  const [structuredWidgets, setStructuredWidgets] = useState<
    WidgetHierarchyMap | undefined
  >(undefined);

  const corePageLayoutConfig = configProvider.getPageLayoutConfig(
    pageLayoutConfig?.layoutID
  );

  useEffect(() => {
    const initializeRenderPageLayout = async () => {
      if (pageToRender && corePageLayoutConfig) {
        await layoutStore?.initLayoutAreaWidgetsAndProcess(pageToRender);
        const structuredData = layoutStore?.getStructuredLayoutAreaWidget();
        setStructuredWidgets(structuredData);
        setIsLoading(false);
      }
    };

    initializeRenderPageLayout();
  }, [pageToRender]);

  if (isLoading) {
    return <div></div>;
  }

  if (corePageLayoutConfig == null) {
    return <>{children}</>;
  }

  const renderLayoutAreaWidgets = (
    layoutAreaConfig: CorePageLayoutAreaConfig
  ) => {
    const layoutAreaID = layoutAreaConfig.layoutAreaID;
    const areaWidgets = layoutStore?.getWidgetsForLayoutArea(layoutAreaID);

    return (
      <LayoutAreaGridLayout
        key={`layout-area-grid-layout-${layoutAreaID}-${areaWidgets?.length}`}
        content={structuredWidgets as WidgetHierarchyMap}
        readonly={readonly}
        selectedWidgetID={selectedWidgetID}
        layoutAreaID={layoutAreaID}
      >
        {areaWidgets?.map((widget) => (
          <div key={widget.widget.widgetID}>
            <RenderWidget
              showVisualWidgetOutline={showVisualWidgetOutline}
              readonly={readonly}
              widgetToRender={widget}
            />
          </div>
        ))}
      </LayoutAreaGridLayout>
    );
  };

  const { component: LayoutComponent, areas } = corePageLayoutConfig;

  const contentLayoutProps = areas.reduce(
    (props, areaConfig) => {
      props[areaConfig.propName] = renderLayoutAreaWidgets(areaConfig);
      return props;
    },
    { children: children } as Record<string, React.ReactNode>
  );

  const layoutProps = {
    currentBreakpoint: currentBreakpoint,
    options: pageLayoutConfig?.options,
    areas: pageLayoutConfig?.areas,
    children: children,
    ...contentLayoutProps,
  };

  return <LayoutComponent {...layoutProps} />;
};

export default inject(
  "layoutStore",
  "pageStore",
  "editorStore"
)(observer(RenderPageLayout));
