import React, { useEffect, useState } from "react";
import ConfigProvider from "../../../../../config/config.provider";
import LayoutAreaGridLayout from "../../layout.area.grid.layout.component/layout.area.grid.layout.component";
import LayoutStore from "../../../../../stores/layout.store";
import { inject, observer } from "mobx-react";
import { WidgetHierarchyMap } from "../../../../../schemas/widget.schemas/widget.schema";
import WidgetStore from "../../../../../stores/widget.store";
import PageStore from "../../../../../stores/page.store";
import RenderWidget from "../render.widget.component/render.widget.component";

interface RenderPageLayoutProps {
  children?: React.ReactNode;
  readonly?: boolean;
  layoutStore?: LayoutStore;
  widgetStore?: WidgetStore;
  pageStore?: PageStore;
}

const RenderPageLayout = ({
  children,
  readonly = true,
  layoutStore,
  widgetStore,
  pageStore,
}: RenderPageLayoutProps) => {
  const pageLayoutConfig = pageStore?.currentPageToRender?.layoutConfig;
  const pageToRender = pageStore?.currentPageToRender?.pageID;
  const selectedWidgetID = widgetStore?.getSelectedWidget()?.widget.widgetID;
  const configProvider = ConfigProvider.getInstance();

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
        // set the viewID in the viewStore
        await layoutStore?.initLayoutAreaWidgetsAndProcess(pageToRender);
        const structuredData = layoutStore?.getStructuredLayoutAreaWidget();
        setStructuredWidgets(structuredData);
        setIsLoading(false);
      }
    };

    initializeRenderPageLayout();
  }, [pageToRender]);

  if (isLoading) {
    return <div>Loading... page layout</div>;
  }

  if (corePageLayoutConfig == null) {
    return <>{children}</>;
  }

  // render the widgets for the given layout area
  const renderLayoutAreaWidgets = (layoutAreaID: string) => {
    const areaWidgets = layoutStore?.getWidgetsForLayoutArea(layoutAreaID);

    if (
      pageLayoutConfig?.areas == null ||
      pageLayoutConfig.areas[layoutAreaID] == null
    ) {
      return null;
    }

    return (
      <LayoutAreaGridLayout
        key={`layout-area-grid-layout-${layoutAreaID}`}
        content={structuredWidgets as WidgetHierarchyMap} // TODO
        readonly={readonly}
        selectedWidgetID={selectedWidgetID}
      >
        {areaWidgets?.map((widget) => {
          return (
            <div key={widget.widget.positioning.i}>
              <RenderWidget
                showVisualWidgetOutline={false}
                readonly={readonly}
                widgetToRender={widget}
                key={widget.widget.positioning.i}
              />
            </div>
          );
        })}
      </LayoutAreaGridLayout>
    );
  };

  // extract the layout component and areas from the core layout config
  const { component: LayoutComponent, areas } = corePageLayoutConfig;

  // generate the props for the layout content
  const contentLayoutProps = areas.reduce(
    (props, areaConfig) => {
      const { layoutAreaID, propName } = areaConfig;
      props[propName] = renderLayoutAreaWidgets(layoutAreaID);
      return props;
    },
    { children: children } as Record<string, React.ReactNode>
  );

  // prepare the props for the layout component
  const layoutProps = {
    options: pageLayoutConfig?.options,
    areas: pageLayoutConfig?.areas,
    children: children,
    ...contentLayoutProps,
  };

  // render the defined layout component with the widgets
  return <LayoutComponent {...layoutProps} />;
};

export default inject(
  "layoutStore",
  "widgetStore",
  "pageStore"
)(observer(RenderPageLayout));
