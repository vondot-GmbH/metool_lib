import { AreaOptions } from "../../schemas/page.schemas/page.schema";

// TODO prepare default data that it will match with the root breakpoint layout config
export const DASHBOARD_PAGE_LAYOUT_SIDEBAR_AREA_DEFAULT: AreaOptions = {
  layoutAreaID: "sidebar",
  options: {
    small: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      width: "150px",
    },
    medium: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      width: "200px",
    },
    large: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      width: "250px",
    },
  },
};

export const DASHBOARD_PAGE_LAYOUT_TOPBAR_AREA_DEFAULT: AreaOptions = {
  layoutAreaID: "topbar",
  options: {
    small: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      height: "55px",
    },
    medium: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      height: "55px",
    },
    large: {
      backgroundColor: "#f5f5f5",
      border: "1px solid #e0e0e0",
      borderRadius: "5px",
      height: "55px",
    },
  },
};
