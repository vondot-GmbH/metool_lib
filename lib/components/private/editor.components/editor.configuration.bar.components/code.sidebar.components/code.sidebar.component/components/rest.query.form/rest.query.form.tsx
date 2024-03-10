import { inject, observer } from "mobx-react";
import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../../../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import KeyValueInput from "../../../../../../general.components/key.value.input.component/key.value.input.conponent";
import {
  RestQuery,
  restQuerySchema,
} from "../../../../../../../../schemas/query.schemas/query.schema";
import QueryStore from "../../../../../../../../stores/query.store";
import Row from "../../../../../../general.components/row.component/row.component";
import SelectDropDown from "../../../../../../general.components/select.dropdown.component/select.dropdown.component";

interface RestQueryFormprops {
  iniitialQuery?: RestQuery;
  onFormSubmit: (query: RestQuery) => void;
  queryStore?: QueryStore;
}

const RestQueryForm = ({
  onFormSubmit,
  iniitialQuery,
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
    defaultValues: (iniitialQuery as any) ?? {},
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
    fields: defaultHeadersFields,
    append: appendDefaultHeader,
    remove: removeDefaultHeader,
  } = useFieldArray({
    control,
    name: "resource.defaultHeaders",
  });

  const {
    fields: headersFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: "headers",
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
        className={defaultStyles.mb20}
        validationMessage={errors.title?.message?.toString()}
      />
      <TextInput
        {...register("description")}
        label="Description"
        className={defaultStyles.mb20}
        validationMessage={errors.description?.message?.toString()}
      />

      <Row alignItems="center">
        <TextInput
          disabled={true}
          {...register("resource.baseUrl")}
          label="Base URL"
          className={defaultStyles.mb20}
        />

        <TextInput
          {...register("url")}
          label="URL"
          className={defaultStyles.mb20}
          validationMessage={errors.url?.message?.toString()}
        />
      </Row>

      <SelectDropDown
        className={defaultStyles.mb20}
        label="Method"
        selectedItem={iniitialQuery?.method}
        items={methodItems}
        validationMessage={errors.method?.message?.toString()}
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
        fields={defaultHeadersFields}
        append={appendDefaultHeader}
        remove={removeDefaultHeader}
        register={register}
        arrayFieldName={"resource.defaultHeaders"}
      />

      <KeyValueInput
        className={defaultStyles.mb20}
        label="Headers"
        fields={headersFields}
        append={appendHeader}
        remove={removeHeader}
        register={register}
        arrayFieldName={"headers"}
        validationErrors={errors}
      />

      <TextInput
        validationMessage={errors.body?.message?.toString()}
        {...register("body")}
        label="body"
        className={defaultStyles.mb20}
      />
    </form>
  );
};

export default inject("queryStore")(observer(RestQueryForm));
