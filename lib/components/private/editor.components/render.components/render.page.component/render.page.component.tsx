import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import RenderView from "../render.view.component/render.view.conponent";
import { useEffect, useState } from "react";
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
  pageToRender: initialPageToRender,
  readonly = true,
  showVisualWidgetOutline = false,
  resourceStore,
  queryStore,
  pageStore,
}: RenderPageProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    resourceStore?.intializeResources();
    queryStore?.intializeQueries();

    // set the initial page to render
    pageStore?.setAndFetchPageToRender(initialPageToRender);
  }, [initialPageToRender]);

  useEffect(() => {
    if (pageStore?.currentPageToRender?.pageID !== initialPageToRender) {
      setIsLoading(false);
    }
  }, [pageStore?.currentPageToRender, initialPageToRender]);

  const layoutConfig = pageStore?.currentPageToRender?.layoutConfig;
  const viewIdToRender = pageStore?.currentViewIdToRender;

  if (isLoading || viewIdToRender == null) {
    console.log("Loading Page...");
    console.log("RENDER PAGE");
    console.log("isLoading", isLoading);
    console.log("viewIdToRender", viewIdToRender);
    return <div>Loading Page... RENDER PAGE</div>;
  }

  return (
    <RenderPageLayout pageLayoutConfig={layoutConfig}>
      <RenderView
        key={viewIdToRender}
        viewToRender={viewIdToRender}
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
