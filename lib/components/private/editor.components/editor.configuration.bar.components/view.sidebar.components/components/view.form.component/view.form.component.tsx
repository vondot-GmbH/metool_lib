import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../styles/index.module.scss";
import {
  View,
  viewSchema,
} from "../../../../../../../schemas/view.schemas/view.schema";
import TextInput from "../../../../../general.components/input.components/text.input.component/text.input.component";
import KeyValueInput from "../../../../../general.components/input.components/key.value.input.component/key.value.input.component";

interface ViewFormProps {
  initialView?: View;
  onFormSubmit: (view: View) => void;
  disabled?: boolean;
}

const ViewForm = ({
  onFormSubmit,
  initialView,
  disabled = false,
}: ViewFormProps): JSX.Element | null => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(viewSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: initialView ?? {},
  });

  const {
    fields: viewParams,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control,
    name: "params",
  });

  return (
    <form
      id="view-form"
      onSubmit={handleSubmit((data, e) => {
        e?.preventDefault();
        onFormSubmit(data as View);
      })}
    >
      <TextInput
        {...register("name")}
        label="Name"
        className={defaultStyles.mb10}
        validationMessage={errors.name?.message?.toString()}
        disabled={disabled}
      />

      <KeyValueInput
        className={defaultStyles.mb20}
        disabled={disabled}
        label="View Params"
        fields={viewParams}
        append={appendParam}
        remove={removeParam}
        register={register}
        arrayFieldName={"params"}
        validationErrors={errors}
        addLabel="Add Param"
        keyFieldName="key"
        valueFieldName="type"
        keyLabel="Key"
        valueLabel="Type"
      />
    </form>
  );
};

export default ViewForm;
