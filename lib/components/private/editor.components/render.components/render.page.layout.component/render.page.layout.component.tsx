import React from "react";
import ConfigProvider from "../../../../../config/config.provider";
import { PageLayoutConfig } from "../../../../../schemas/page.schemas/page.schema";

interface RenderPageLayoutProps {
  pageLayoutConfig?: PageLayoutConfig;
  children?: React.ReactNode;
}

const RenderPageLayout = ({
  pageLayoutConfig,
  children,
}: RenderPageLayoutProps) => {
  if (!pageLayoutConfig) {
    return <>{children}</>;
  }

  const configProvider = ConfigProvider.getInstance();
  const corePageLayoutConfig = configProvider.getPageLayoutConfig(
    pageLayoutConfig.layoutID
  );

  if (!corePageLayoutConfig) {
    return <>{children}</>;
  }

  // generate the content for a layout area
  const getPageLayoutAreaContent = (layoutAreaID: string) => {
    if (pageLayoutConfig?.areas && pageLayoutConfig.areas[layoutAreaID]) {
      return (
        <div key={layoutAreaID}>Dynamischer Inhalt für {layoutAreaID}</div>
      );
    }

    return null;
  };

  // extract the layout component and areas from the core layout config
  const { component: LayoutComponent, areas } = corePageLayoutConfig;

  // generate the props for the layout content
  const contentLayoutProps = areas.reduce(
    (props, areaConfig) => {
      const { layoutAreaID, propName } = areaConfig;
      props[propName] = getPageLayoutAreaContent(layoutAreaID);
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

  // render the defined layout component with the prepared props
  return <LayoutComponent {...layoutProps} />;
};

export default RenderPageLayout;
