import ViewStore from "../../../../../stores/view.store";
import { inject, observer } from "mobx-react";
import QueryStore from "../../../../../stores/query.store";
import ResourceStore from "../../../../../stores/resource.store";
import RenderView from "../render.view.component/render.view.conponent";
import { useEffect, useState } from "react";
import PageStore from "../../../../../stores/page.store";
import RenderPageLayout from "../render.page.layout.component/render.page.layout.component";
import { PageLayoutConfig } from "../../../../../schemas/page.schemas/page.schema";

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
  const [layoutConfig, setLayoutConfig] = useState<
    PageLayoutConfig | undefined
  >(undefined);

  useEffect(() => {
    const initializeRenderPage = async () => {
      // set core data for render page if they allready exist they will be overwritten
      resourceStore?.intializeResources();
      queryStore?.intializeQueries();

      if (pageToRender) {
        // initialize page
        const page = await pageStore?.intializePage(pageToRender);

        // if page is not null set layout config and fetch views
        if (page != null && page?.views != null) {
          setLayoutConfig(page?.layoutConfig);
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

  if (isLoading || viewToRender == null) {
    return <div>Loading Page...</div>;
  }

  return (
    <RenderPageLayout pageLayoutConfig={layoutConfig}>
      <RenderView
        viewToRender={viewToRender ?? ""}
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
