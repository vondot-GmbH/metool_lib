import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import defaultStyles from "../../../../../../../styles/index.module.scss";
import {
  View,
  viewSchema,
} from "../../../../../../../schemas/view.schemas/view.schema";
import TextInput from "../../../../../general.components/outlined.text.input.component/outlined.text.input.component";

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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(viewSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: initialView ?? {},
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
    </form>
  );
};

export default ViewForm;
