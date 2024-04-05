import {
  RestResource,
  resourceRestSchema,
} from "../../../../../../../../schemas/resource.schemas/resource.schema";
import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../../../../../../general.components/input.components/text.input.component/text.input.component";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import KeyValueInput from "../../../../../../general.components/input.components/key.value.input.component/key.value.input.component";

interface ResourceRestFormProps {
  iniitialResource?: RestResource;
  onFormSubmit: (resource: RestResource) => void;
  disabled?: boolean;
}

const ResourceRestForm = ({
  onFormSubmit,
  iniitialResource,
  disabled = false,
}: ResourceRestFormProps): JSX.Element | null => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resourceRestSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: iniitialResource ?? {},
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "defaultHeaders",
  });

  return (
    <form
      id="rest-resource-form"
      onSubmit={handleSubmit((data, e) => {
        e?.preventDefault();
        onFormSubmit(data as RestResource);
      })}
    >
      <TextInput
        {...register("title")}
        label="Name"
        className={defaultStyles.mb10}
        validationMessage={errors.title?.message?.toString()}
        disabled={disabled}
      />

      <TextInput
        {...register("description")}
        label="Description"
        className={defaultStyles.mb10}
        disabled={disabled}
        validationMessage={errors.description?.message?.toString()}
      />

      <TextInput
        {...register("baseUrl")}
        label="Base URL"
        className={defaultStyles.mb20}
        disabled={disabled}
        validationMessage={errors.baseUrl?.message?.toString()}
      />

      <KeyValueInput
        label="Headers"
        fields={fields}
        append={append}
        remove={remove}
        register={register}
        arrayFieldName={"defaultHeaders"}
        validationErrors={errors}
        disabled={disabled}
      />
    </form>
  );
};

export default ResourceRestForm;
