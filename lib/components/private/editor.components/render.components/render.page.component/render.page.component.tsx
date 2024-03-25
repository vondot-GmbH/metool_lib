import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import RenderView from "../render.view.component/render.view.conponent";
import { useEffect, useState } from "react";
import PageStore from "../../../../../stores/page.store";
import RenderPageLayout from "../render.page.layout.component/render.page.layout.component";
import LayoutStore from "../../../../../stores/layout.store";

interface RenderPageProps {
  readonly?: boolean;
  viewStore?: ViewStore;
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  pageStore?: PageStore;
  layoutStore?: LayoutStore;

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
  const layoutConfig = pageStore?.currentPageToRender?.layoutConfig;
  const viewIdToRender = pageStore?.currentViewIdToRender;

  useEffect(() => {
    const initializeRenderPage = async () => {
      resourceStore?.intializeResources();
      queryStore?.intializeQueries();

      // set the initial page to render
      await pageStore?.setAndFetchPageToRender(initialPageToRender);

      setIsLoading(false);
    };

    initializeRenderPage();
  }, [initialPageToRender]);

  if (isLoading || viewIdToRender == null) {
    return <div>Loading...</div>;
  }

  return (
    <RenderPageLayout readonly={readonly}>
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
  "resourceStore",
  "layoutStore"
)(observer(RenderPage));
