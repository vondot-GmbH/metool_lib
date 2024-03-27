import { useFieldArray, useForm } from "react-hook-form";
import TextInput from "../../../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Page,
  pageSchema,
} from "../../../../../../../../schemas/page.schemas/page.schema";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import CollapsibleSection from "../../../../../../general.components/collapsible.section.component/collapsible.section.component";
import ConfigProvider from "../../../../../../../../config/config.provider";

interface DashboardPageLayoutFormProps {
  initialPage?: Page;
  onFormSubmit: (page: Page) => void;
  disabled?: boolean;
}

const DashboardPageLayoutForm = ({
  onFormSubmit,
  initialPage,
  disabled = false,
}: DashboardPageLayoutFormProps): JSX.Element | null => {
  const configProvider = ConfigProvider.getInstance();
  const brakpointLayoutConfigs =
    configProvider.getBreakpointLayoutConfigForLevel("root");

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pageSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: (initialPage as any) ?? {},
  });

  const { fields } = useFieldArray({
    control,
    name: "areas",
  });

  return (
    <form
      id="dashboard-page-layout-form"
      onSubmit={handleSubmit((data, e) => {
        e?.preventDefault();
        onFormSubmit(data as Page);
      })}
    >
      <TextInput
        {...register("name")}
        label="Page Name"
        className={defaultStyles.mt10}
        validationMessage={errors.name?.message?.toString()}
        disabled={disabled}
      />

      {brakpointLayoutConfigs &&
        brakpointLayoutConfigs.map((layoutConfig) => {
          return (
            <CollapsibleSection
              key={layoutConfig.breakpoint}
              title={layoutConfig.title ?? "-"}
              initialOpen={false}
              icon={layoutConfig.icon}
            >
              <div>test</div>
            </CollapsibleSection>
          );
        })}
    </form>
  );
};

export default DashboardPageLayoutForm;
