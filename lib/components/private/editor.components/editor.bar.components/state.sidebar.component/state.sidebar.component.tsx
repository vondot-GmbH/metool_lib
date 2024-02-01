/* eslint-disable no-empty-pattern */
import Column from "../../../general.components/column.component/column.component";
import ComponentWrapper from "../../../general.components/component.wrapper.component/component.wrapper.component";

interface StateSidebarProps {}

const StateSidebar = ({}: StateSidebarProps): JSX.Element => {
  return (
    <ComponentWrapper title={"State"}>
      <Column justifyContent="center">isLoading: false</Column>
      <Column justifyContent="center">selectedItem: null</Column>
      <Column justifyContent="center">test: false</Column>
    </ComponentWrapper>
  );
};

export default StateSidebar;
