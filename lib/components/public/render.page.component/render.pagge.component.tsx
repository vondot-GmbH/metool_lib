import StoreProvider from "../../private/store.provider.component/store.provider.component";
import RenderPageComponent from "../../private/editor.components/render.components/render.page.component/render.page.component";

interface RenderPageProps {
  viewToRender: string;
}

const RenderPage = ({ viewToRender }: RenderPageProps): JSX.Element => {
  return (
    <StoreProvider>
      <RenderPageComponent viewToRender={viewToRender} />
    </StoreProvider>
  );
};

export default RenderPage;
