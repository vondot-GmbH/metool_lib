import React from "react";
import ConfigProvider from "../../../../../config/config.provider";

interface RenderPageLayoutProps {
  pageLayoutID: string;
  children?: React.ReactNode;
}

const RenderPageLayout = ({
  pageLayoutID,
  children,
}: RenderPageLayoutProps) => {
  const configProvider = ConfigProvider.getInstance();
  const pageLayoutConfig = configProvider.getPageLayoutConfig(pageLayoutID);

  // if no layout is defined, render the view without a layout
  if (pageLayoutConfig == null) {
    return <>{children}</>;
  }

  // get the layout component and the areas from the layout config
  const { component: LayoutComponent, areas } = pageLayoutConfig;

  const getPageLayoutAreaContent = (layoutAreaID: string) => {
    return <div key={layoutAreaID}>Dynamischer Inhalt für {layoutAreaID}</div>;
  };

  // generate the props for the layout component
  const layoutProps = areas.reduce(
    (props, areaConfig) => {
      const { layoutAreaID, propName } = areaConfig;
      props[propName] = getPageLayoutAreaContent(layoutAreaID);
      return props;
    },
    { children: children } as Record<string, React.ReactNode>
  );

  return <LayoutComponent {...layoutProps} />;
};

export default RenderPageLayout;
