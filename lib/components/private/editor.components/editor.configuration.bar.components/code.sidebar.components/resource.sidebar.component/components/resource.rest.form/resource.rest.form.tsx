import {
  RestResource,
  resourceRestSchema,
} from "../../../../../../../../schemas/resource.schemas/resource.schema";
import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../../../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import KeyValueInput from "../../../../../../general.components/key.value.input.component/key.value.input.conponent";

interface ResourceRestFormProps {
  iniitialResource?: RestResource;
  onFormSubmit: (resource: RestResource) => void;
}

const ResourceRestForm = ({
  onFormSubmit,
  iniitialResource,
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
        className={defaultStyles.mb20}
        validationMessage={errors.title?.message?.toString()}
      />

      <TextInput
        {...register("description")}
        label="Description"
        className={defaultStyles.mb20}
        validationMessage={errors.description?.message?.toString()}
      />

      <TextInput
        {...register("baseUrl")}
        label="Base URL"
        className={defaultStyles.mb20}
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
      />
    </form>
  );
};

export default ResourceRestForm;
