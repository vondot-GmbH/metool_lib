import * as yup from "yup";

export interface Page {
  _id?: string;
  pageID: string;
  name: string;
  layoutConfig: PageLayoutConfig;
  views: PageView[];
}

export interface PageView {
  viewID: string;
  defaultView: boolean;
}

export interface PageLayoutConfig {
  layoutID: string;
  options?: LayoutOptions;
  areas?: Record<string, AreaOptions>;
}

export interface AreaOptions {
  height?: string;
  width?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
}

export interface LayoutOptions {
  backgroundColor?: string;
  layoutType?: string;
}

export const pageSchema = yup.object().shape({
  name: yup.string().required(),
});

export const layoutConfigSchema = yup.object().shape({
  layoutID: yup.string().required(),
  options: yup.object().shape({
    backgroundColor: yup.string(),
    layoutType: yup.string(),
  }),
});

export const areaOptionsSchema = yup.object().shape({
  height: yup.string().notRequired(),
  width: yup.string().notRequired(),
  backgroundColor: yup.string().notRequired(),
  padding: yup.string().notRequired(),
  margin: yup.string().notRequired(),
  border: yup.string().notRequired(),
  borderRadius: yup.string().notRequired(),
});
