import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import MainLayout from "../../../../../layouts/main.layout/main.layout";
import RenderView from "../render.view.component/render.view.conponent";
import RunningText from "../../../general.components/text.components/running.text.component/running.text.component";
import { useEffect, useState } from "react";
import PageStore from "../../../../../stores/page.store";

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
  viewStore,
}: RenderPageProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewToRender, setViewToRender] = useState<string | undefined>(
    undefined
  );

  // TODO remove hardcoded stuff for development
  useEffect(() => {
    const initializeRenderPage = async () => {
      await resourceStore?.intializeResources();
      await queryStore?.intializeQueries();

      if (pageToRender) {
        // initialize page
        const page = await pageStore?.intializePage(pageToRender);
        if (page != null && page?.views != null) {
          const views = await viewStore?.fetchAndSaveViews(page.views);
          if (views != null) {
            setViewToRender((views as any)[0].viewID); // TODO make this dynamic
          }
        }
        setIsLoading(false);
      }
    };

    initializeRenderPage();
  }, [pageToRender]);

  const buildTopBar = () => {
    return (
      <div>
        <RunningText> render bar</RunningText>
        <RunningText> render bar</RunningText>
      </div>
    );
  };

  if (isLoading || viewToRender == null) {
    return <div>Loading Page...</div>;
  }

  return (
    <MainLayout topBars={[buildTopBar()]} sideBars={[buildTopBar()]}>
      <RenderView
        viewToRender={viewToRender ?? ""}
        readonly={readonly}
        showVisualWidgetOutline={showVisualWidgetOutline}
      />
    </MainLayout>
  );
};

export default inject(
  "viewStore",
  "pageStore",
  "queryStore",
  "resourceStore"
)(observer(RenderPage));
