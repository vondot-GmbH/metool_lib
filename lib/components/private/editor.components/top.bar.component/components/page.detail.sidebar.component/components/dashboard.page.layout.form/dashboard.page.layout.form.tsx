import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "../../../../../../general.components/outlined.text.input.component/outlined.text.input.component";
import CollapsibleSection from "../../../../../../general.components/collapsible.section.component/collapsible.section.component";
import {
  Page,
  pageSchema,
} from "../../../../../../../../schemas/page.schemas/page.schema";
import ConfigProvider from "../../../../../../../../config/config.provider";
import defaultStyles from "../../../../../../../../styles/index.module.scss";
import IconButton from "../../../../../../general.components/icon.button.component/icon.button.component";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import styles from "./dashboard.page.layout.form.module.scss";
import RunningText from "../../../../../../general.components/text.components/running.text.component/running.text.component";
import SelectDropDown from "../../../../../../general.components/input.components/select.dropdown.component/select.dropdown.component";
import {
  DASHBOARD_PAGE_LAYOUT_SIDEBAR_AREA_DEFAULT,
  DASHBOARD_PAGE_LAYOUT_TOPBAR_AREA_DEFAULT,
} from "../../../../../../../../globals/config/page.layout.config";

interface DashboardPageLayoutFormProps {
  initialPage: Page;
  onFormSubmit: (page: Page) => void;
  disabled?: boolean;
}

const DashboardPageLayoutForm = ({
  onFormSubmit,
  initialPage,
  disabled = false,
}: DashboardPageLayoutFormProps) => {
  const configProvider = ConfigProvider.getInstance();
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(pageSchema),
    defaultValues: { ...initialPage },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "layoutConfig.areas",
  });

  const coreLayoutConfig = configProvider.getPageLayoutConfig(
    initialPage?.layoutConfig?.layoutID
  );

  const rootBreakpoints =
    configProvider?.getBreakpointLayoutConfigForLevel("root");

  const layoutTypeItems = [
    {
      label: "Sidebar First",
      value: "sidebarFirst",
    },
    {
      label: "Topbar First",
      value: "topbarFirst",
    },
  ];

  const addPageLayoutArea = (areaID: string) => {
    let defaultValues = { layoutAreaID: areaID } as any;
    switch (areaID) {
      case "sidebar":
        defaultValues = DASHBOARD_PAGE_LAYOUT_SIDEBAR_AREA_DEFAULT;
        break;
      case "topbar":
        defaultValues = DASHBOARD_PAGE_LAYOUT_TOPBAR_AREA_DEFAULT;
        break;
      default:
        defaultValues = {};
    }
    append(defaultValues);
  };

  return (
    <form
      id="dashboard-page-layout-form"
      onSubmit={handleSubmit((data) => onFormSubmit(data as Page))}
    >
      <TextInput
        {...register("name")}
        label="Page Name"
        className={defaultStyles.mt20}
        validationMessage={errors.name?.message?.toString()}
        disabled={disabled}
      />

      <SelectDropDown
        className={defaultStyles.mb20}
        label="Layout Type"
        selectedItem={initialPage?.layoutConfig?.options?.layoutType}
        items={layoutTypeItems}
        disabled={disabled}
        onChange={(item) => {
          if (item?.value != null) {
            setValue("layoutConfig.options.layoutType", item?.value);
          }
        }}
      />

      <div className={styles.layoutAreaWrapper}>
        <RunningText>Layout Areas</RunningText>

        <div className={styles.availableLayoutAreas}>
          {coreLayoutConfig?.areas
            .filter(
              (coreArea) =>
                !fields.some(
                  (field) => field.layoutAreaID === coreArea.layoutAreaID
                )
            )
            .map((area) => (
              <button
                className={styles.addLayoutAreaButton}
                key={area.layoutAreaID}
                type="button"
                onClick={() => addPageLayoutArea(area.layoutAreaID)}
              >
                Add {area.layoutAreaID}
              </button>
            ))}
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className={styles.layoutArea}>
            <div className={styles.layoutAreaHeader}>
              <RunningText className={styles.layoutAreaName}>
                {field.layoutAreaID}
              </RunningText>
              <IconButton
                icon={faTrash}
                onClick={() => remove(index)}
                showBorder
              />
            </div>
            {rootBreakpoints.map((breakpoint) => (
              <CollapsibleSection
                key={breakpoint.key}
                title={`${breakpoint.title}`}
                initialOpen={false}
                icon={breakpoint.icon}
              >
                <TextInput
                  {...register(
                    `layoutConfig.areas[${index}].options.${breakpoint.key}.height` as any
                  )}
                  label="Height"
                  disabled={disabled}
                />
                <TextInput
                  {...register(
                    `layoutConfig.areas[${index}].options.${breakpoint.key}.width` as any
                  )}
                  label="Width"
                  disabled={disabled}
                />

                <TextInput
                  type="color"
                  {...register(
                    `layoutConfig.areas[${index}].options.${breakpoint.key}.backgroundColor` as any
                  )}
                  label="Background Color"
                  disabled={disabled}
                />

                <TextInput
                  type="text"
                  {...register(
                    `layoutConfig.areas[${index}].options.${breakpoint.key}.border` as any
                  )}
                  label="Border"
                  disabled={disabled}
                />

                <TextInput
                  type="text"
                  {...register(
                    `layoutConfig.areas[${index}].options.${breakpoint.key}.borderRadius` as any
                  )}
                  label="borderRadius"
                  disabled={disabled}
                />
              </CollapsibleSection>
            ))}
          </div>
        ))}
      </div>
    </form>
  );
};

export default DashboardPageLayoutForm;
