/* eslint-disable @typescript-eslint/no-unused-vars */
import { inject, observer } from "mobx-react";
import { useRef } from "react";
import { useClickedOutside } from "../../../../globals/helpers/hook.helper";
import ControlledMenu from "../../general.components/context.menu.components/controlled.menu.component/controlled.menu.component";
import MenuItem from "../../general.components/context.menu.components/menu.item.component/menu.item.component";

interface WidgetContextMenuProps {
  isOpen: boolean;
  anchorPoint: { x: number; y: number };
  onClose: () => void;
  widgetID: string;
}

const WidgetContextMenu = ({
  isOpen,
  anchorPoint,
  onClose,
  widgetID,
}: WidgetContextMenuProps): JSX.Element => {
  const menuRef = useRef(null);
  useClickedOutside(menuRef, onClose); // TODO the menu is not closing if the click is on the widget

  // const handleDeleteWidget = (e: any) => {
  //   console.log("delete widget");
  // };

  return (
    <ControlledMenu anchorPoint={anchorPoint} onClose={onClose} isOpen={isOpen}>
      <MenuItem
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          console.log("delete widget");
        }}
      >
        delete selected widget
      </MenuItem>

      <MenuItem>item2</MenuItem>
      <MenuItem>item3</MenuItem>
      <MenuItem>item4</MenuItem>
    </ControlledMenu>
  );
};

export default inject("widgetStore")(observer(WidgetContextMenu));
