import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import RenderView from "../render.view.component/render.view.conponent";
import { useEffect, useMemo, useState } from "react";
import PageStore from "../../../../../stores/page.store";
import RenderPageLayout from "../render.page.layout.component/render.page.layout.component";

interface RenderPageProps {
  readonly?: boolean;
  viewStore?: ViewStore;
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  pageStore?: PageStore;

  showVisualWidgetOutline?: boolean;
  pageToRender: string;
}

const RenderPage = ({
  pageToRender,
  readonly = true,
  showVisualWidgetOutline = false,
  resourceStore,
  queryStore,
  pageStore,
}: RenderPageProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  // fetch all necessary data for the page
  useEffect(() => {
    const initializeRenderPage = async () => {
      resourceStore?.intializeResources();
      queryStore?.intializeQueries();

      if (pageToRender) {
        const page = await pageStore?.intializePage(pageToRender);
        setIsLoading(false);
        return page;
      }
    };

    initializeRenderPage();
  }, [pageToRender]);

  // get the layout config of the current page
  const layoutConfig = useMemo(() => {
    return pageStore?.currentSelectedPage?.layoutConfig;
  }, [pageStore?.currentSelectedPage?.layoutConfig]);

  // find the default view to render
  const viewToRender = useMemo(() => {
    const views = pageStore?.currentSelectedPage?.views;
    const defaultView = views?.find((view) => view.defaultView) || views?.[0];
    return defaultView?.viewID;
  }, [pageStore?.currentSelectedPage?.views]);

  if (isLoading || viewToRender == null) {
    return <div>Loading Page...</div>;
  }

  return (
    <RenderPageLayout pageLayoutConfig={layoutConfig}>
      <RenderView
        viewToRender={viewToRender}
        readonly={readonly}
        showVisualWidgetOutline={showVisualWidgetOutline}
      />
    </RenderPageLayout>
  );
};

export default inject(
  "viewStore",
  "pageStore",
  "queryStore",
  "resourceStore"
)(observer(RenderPage));
