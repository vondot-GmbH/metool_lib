import StoreProvider from "../../private/store.provider.component/store.provider.component";
import CanvasEditorComponent from "../../private/editor.components/canvas.editor.component/canvas.editor.component";

interface CanvasEditorProps {
  pageToRender: string;
}

const CanvasEditor = ({ pageToRender }: CanvasEditorProps): JSX.Element => {
  return (
    <StoreProvider>
      <CanvasEditorComponent pageToRender={pageToRender} />
    </StoreProvider>
  );
};

export default CanvasEditor;
