import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../../../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import KeyValueInput from "../../../../../../general.components/key.value.input.component/key.value.input.conponent";
import {
  RestQuery,
  restQuerySchema,
} from "../../../../../../../../schemas/query.schemas/query.schema";
import Row from "../../../../../../general.components/row.component/row.component";
import SelectDropDown from "../../../../../../general.components/select.dropdown.component/select.dropdown.component";
import { Resource } from "../../../../../../../../main";
import SizedContainer from "../../../../../../general.components/sized.container.component/sized.container.component";

interface RestQueryFormprops {
  initialQuery?: RestQuery;
  onFormSubmit: (query: RestQuery) => void;
  resource: Resource;
  disabled?: boolean;
}

const RestQueryForm = ({
  onFormSubmit,
  initialQuery,
  resource,
  disabled = false,
}: RestQueryFormprops): JSX.Element | null => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(restQuerySchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: (initialQuery as any) ?? {},
  });

  const methodItems = [
    {
      label: "GET",
      value: "GET",
    },
    {
      label: "POST",
      value: "POST",
    },
    {
      label: "PUT",
      value: "PUT",
    },
    {
      label: "DELETE",
      value: "DELETE",
    },
  ];

  const {
    fields: headersFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headers",
  });

  const {
    fields: paramsFields,
    append: appendParams,
    remove: removeParams,
  } = useFieldArray({
    control,
    name: "params",
  });

  return (
    <form
      id="rest-query-form"
      onSubmit={handleSubmit((data, e) => {
        e?.preventDefault();
        onFormSubmit(data as RestQuery);
      })}
    >
      <TextInput
        {...register("title")}
        label="Name"
        className={defaultStyles.mt10}
        validationMessage={errors.title?.message?.toString()}
        disabled={disabled}
      />
      <TextInput
        {...register("description")}
        label="Description"
        className={defaultStyles.mb10}
        validationMessage={errors.description?.message?.toString()}
        disabled={disabled}
      />

      <Row alignItems="center">
        <TextInput
          disabled={true}
          value={resource?.baseUrl}
          label="Base URL"
          className={defaultStyles.mb10}
          style={{ fontSize: "12px" }}
        />

        <SizedContainer customSize={300} size="CUSTOM">
          <TextInput
            style={{ width: "150px" }}
            {...register("url")}
            label="URL"
            className={defaultStyles.mb10}
            validationMessage={errors.url?.message?.toString()}
            disabled={disabled}
          />
        </SizedContainer>
      </Row>

      <SelectDropDown
        className={defaultStyles.mb30}
        label="Method"
        selectedItem={initialQuery?.method}
        items={methodItems}
        validationMessage={errors.method?.message?.toString()}
        disabled={disabled}
        onChange={(item) => {
          if (item?.value != null) {
            setValue("method", item?.value);
          }
        }}
      />

      <KeyValueInput
        className={defaultStyles.mb20}
        disabled={true}
        label="Default Headers"
        fields={resource?.defaultHeaders}
      />

      <KeyValueInput
        className={defaultStyles.mb20}
        disabled={disabled}
        label="Headers"
        fields={headersFields}
        append={appendHeader}
        remove={removeHeader}
        register={register}
        arrayFieldName={"headers"}
        validationErrors={errors}
        addLabel="+ Add Header"
      />

      <KeyValueInput
        className={defaultStyles.mb20}
        disabled={disabled}
        label="Params"
        fields={paramsFields}
        append={appendParams}
        remove={removeParams}
        register={register}
        arrayFieldName={"params"}
        validationErrors={errors}
        addLabel="+ Add Param"
      />

      <TextInput
        validationMessage={errors.body?.message?.toString()}
        {...register("body")}
        label="body"
        className={defaultStyles.mb10}
        disabled={disabled}
      />
    </form>
  );
};

export default RestQueryForm;
