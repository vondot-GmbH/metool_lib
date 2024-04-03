import * as yup from "yup";

export interface View {
  _id?: string;
  name: string;
  viewID: string;
  params?: { key: string; type: string }[]; // TODO make a type for this
}

//! yup schema for validation

export const viewSchema = yup.object().shape({
  name: yup.string().required(),
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
