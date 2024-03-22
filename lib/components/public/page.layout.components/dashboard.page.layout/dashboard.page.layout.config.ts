import { CorePageLayoutConfig } from "../../../../globals/interfaces/config.interface";
import DashboardPageLayout from "./dashboard.page.layout.component";

export const DashboardPageLayoutConfig: CorePageLayoutConfig = {
  layoutID: "defaultDashboardLayout",
  name: "Dashboard Layout",
  component: DashboardPageLayout,
  areas: [
    {
      layoutAreaID: "topbar",
      propName: "topBar",
    },
    {
      layoutAreaID: "sidebar",
      propName: "sideBar",
    },
  ],
};
