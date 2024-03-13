import StoreProvider from "../../private/store.provider.component/store.provider.component";
import CanvasEditorComponent from "../../private/editor.components/canvas.editor.component/canvas.editor.component";

interface CanvasEditorProps {
  viewToRender: string;
}

const CanvasEditor = ({ viewToRender }: CanvasEditorProps): JSX.Element => {
  return (
    <StoreProvider>
      <CanvasEditorComponent viewToRender={viewToRender} />;
    </StoreProvider>
  );
};

export default CanvasEditor;
