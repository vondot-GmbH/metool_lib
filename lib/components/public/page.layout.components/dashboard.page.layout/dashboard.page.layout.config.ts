import { PageLayoutConfig } from "../../../../globals/interfaces/config.interface";
import DashboardPageLayout from "./dashboard.page.layout.component";

export const DashboardPageLayoutConfig: PageLayoutConfig = {
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
