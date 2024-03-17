import { inject, observer } from "mobx-react";

import ControlledMenu from "../../general.components/context.menu.components/controlled.menu.component/controlled.menu.component";
import MenuItem from "../../general.components/context.menu.components/menu.item.component/menu.item.component";
import WidgetStore from "../../../../stores/widget.store";
import { useEffect } from "react";

interface WidgetContextMenuProps {
  isOpen: boolean;
  anchorPoint: { x: number; y: number };
  onClose: () => void;
  widgetStore?: WidgetStore;
}

const WidgetContextMenu = ({
  isOpen,
  anchorPoint,
  onClose,
  widgetStore,
}: WidgetContextMenuProps): JSX.Element => {
  const handleDeleteWidget = () => {
    const widgetToDelte = widgetStore?.getContextMenuState().selectedWidgetID;

    if (widgetToDelte == null) {
      return;
    }

    widgetStore?.deleteWidget(widgetToDelte);
    widgetStore?.setSelectWidget(undefined);
  };

  // add event listener to close menu on click outside
  useEffect(() => {
    document.addEventListener("click", () => {
      if (isOpen) onClose();
    });

    return () => {
      document.removeEventListener("click", () => {
        if (isOpen) onClose();
      });
    };
  }, [isOpen, onClose]);

  return (
    <ControlledMenu anchorPoint={anchorPoint} onClose={onClose} isOpen={isOpen}>
      <MenuItem
        onClick={() => {
          handleDeleteWidget();
        }}
      >
        Delete Widget
      </MenuItem>

      <MenuItem>item 3</MenuItem>
      <MenuItem>item 4</MenuItem>
    </ControlledMenu>
  );
};

export default inject("widgetStore")(observer(WidgetContextMenu));
