import * as yup from "yup";

export interface View {
  _id?: string;
  name: string;
  viewID: string;
}

//! yup schema for validation

export const viewSchema = yup.object().shape({
  name: yup.string().required(),
});
