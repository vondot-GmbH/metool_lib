import * as yup from "yup";

export interface Page {
  _id?: string;
  pageID: string;
  name: string;
  layoutConfig: PageLayoutConfig;
  views: PageView[];
  params?: { key: string; type: string }[]; // TODO make a type for this
}

export interface PageView {
  viewID: string;
  defaultView: boolean;
}

export interface PageLayoutConfig {
  layoutID: string;
  options?: LayoutOptions;
  areas?: AreaOptions[];
}

export interface AreaOptions {
  layoutAreaID: string;
  options: {
    [breakpoint: string]: BreakpointSpecificAreaOptions;
  };
}
export interface BreakpointAreaOptions {
  height?: string;
  width?: string;
  backgroundColor?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
}

export interface BreakpointSpecificAreaOptions {
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

const breakpointSpecificAreaOptionsSchema = yup.object().shape({
  height: yup.string().notRequired(),
  width: yup.string().notRequired(),
  backgroundColor: yup.string().notRequired(),
  padding: yup.string().notRequired(),
  margin: yup.string().notRequired(),
  border: yup.string().notRequired(),
  borderRadius: yup.string().notRequired(),
});

const areaOptionsSchema = yup.object().shape({
  layoutAreaID: yup.string().required(),
  options: yup
    .object()
    .shape({
      small: breakpointSpecificAreaOptionsSchema,
      medium: breakpointSpecificAreaOptionsSchema,
      large: breakpointSpecificAreaOptionsSchema,
    })
    .required(),
});

const layoutOptionsSchema = yup.object().shape({
  backgroundColor: yup.string().notRequired(),
  layoutType: yup.string().notRequired(),
});

const pageLayoutConfigSchema = yup.object().shape({
  layoutID: yup.string().required(),
  options: layoutOptionsSchema,
  areas: yup.array().of(areaOptionsSchema).notRequired(),
});

export const pageSchema = yup.object().shape({
  name: yup.string().required(),
  pageID: yup.string().required(),
  views: yup.array().of(
    yup.object().shape({
      viewID: yup.string().required(),
      defaultView: yup.bool().required(),
    })
  ),
  layoutConfig: pageLayoutConfigSchema,
  params: yup.array().of(
    yup
      .object()
      .shape({
        key: yup.string().required(),
        type: yup.string().required(),
      })
      .notRequired()
  ),
});
