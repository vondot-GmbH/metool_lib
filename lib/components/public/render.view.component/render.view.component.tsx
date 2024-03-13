import StoreProvider from "../../private/store.provider.component/store.provider.component";
import RenderViewConponent from "../../private/editor.components/render.components/render.view.component/render.view.conponent";

interface RenderViewProps {
  viewToRender: string;
}

const RenderView = ({ viewToRender }: RenderViewProps): JSX.Element => {
  return (
    <StoreProvider>
      <RenderViewConponent viewToRender={viewToRender} />;
    </StoreProvider>
  );
};

export default RenderView;
