import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import RenderView from "../render.view.component/render.view.conponent";
import { useEffect, useState } from "react";
import PageStore from "../../../../../stores/page.store";
import RenderPageLayout from "../render.page.layout.component/render.page.layout.component";
import LayoutStore from "../../../../../stores/layout.store";
import NavigationStore from "../../../../../stores/navigation.store";
import { NavigationActionType } from "../../../../../globals/interfaces/navigation.interface";

interface RenderPageProps {
  readonly?: boolean;
  viewStore?: ViewStore;
  queryStore?: QueryStore;
  resourceStore?: ResourceStore;
  pageStore?: PageStore;
  layoutStore?: LayoutStore;
  navigationStore?: NavigationStore;

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
  navigationStore,
}: RenderPageProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const viewIdToRender = pageStore?.currentViewIdToRender;

  useEffect(() => {
    const initializeRenderPage = async () => {
      resourceStore?.intializeResources();
      queryStore?.intializeQueries();

      // set the initial page to render
      await pageStore?.setAndFetchPageToRender(initialPageToRender);

      // Initialize navigation states for the current page
      navigationStore?.initializeCurrentNavigationStates({
        targetID: initialPageToRender,
        actionType: NavigationActionType.PAGE,
        params: {}, // TODO
      });

      setIsLoading(false);
    };

    initializeRenderPage();
  }, [initialPageToRender]);

  if (isLoading || viewIdToRender == null) {
    return <div></div>;
  }

  return (
    <RenderPageLayout
      readonly={readonly}
      showVisualWidgetOutline={showVisualWidgetOutline}
    >
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
  "layoutStore",
  "navigationStore"
)(observer(RenderPage));
