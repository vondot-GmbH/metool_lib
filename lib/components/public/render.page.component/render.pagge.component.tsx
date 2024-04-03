import StoreProvider from "../../private/store.provider.component/store.provider.component";
import RenderPageComponent from "../../private/editor.components/render.components/render.page.component/render.page.component";
import { NavigationParams } from "../../../globals/interfaces/navigation.interface";

interface RenderPageProps {
  pageToRender: NavigationParams;
}

const RenderPage = ({ pageToRender }: RenderPageProps): JSX.Element => {
  return (
    <StoreProvider>
      <RenderPageComponent pageToRender={pageToRender} />
    </StoreProvider>
  );
};

export default RenderPage;
