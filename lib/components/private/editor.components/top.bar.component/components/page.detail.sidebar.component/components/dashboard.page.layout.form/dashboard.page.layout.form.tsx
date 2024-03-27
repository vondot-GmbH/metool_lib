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
import { useEffect } from "react";

interface DashboardPageLayoutFormProps {
  initialPage: Page;
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
  const coreLayoutConfig = configProvider.getPageLayoutConfig(
    initialPage?.layoutConfig?.layoutID
  );

  // Liste der definierten Bereichs-IDs in initialPage
  const definedAreaIDs = initialPage?.layoutConfig?.areas
    ? Object.keys(initialPage.layoutConfig.areas)
    : [];

  // Liste der in der Core-Konfiguration verfügbaren Bereichs-IDs
  const availableAreaIDs =
    coreLayoutConfig?.areas.map((area) => area.layoutAreaID) ?? [];

  // Fehlende Bereichs-IDs ermitteln
  const missingAreaIDs = availableAreaIDs.filter(
    (areaID) => !definedAreaIDs.includes(areaID)
  );

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

  useEffect(() => {
    definedAreaIDs.forEach((areaID) => {
      const areaOptions = initialPage?.layoutConfig?.areas?.[areaID];
      if (areaOptions) {
        Object.entries(areaOptions).forEach(([breakpoint, options]) => {
          Object.entries(options).forEach(([optionName, value]) => {
            setValue(
              `layoutConfig.areas.${areaID}.${breakpoint}.${optionName}`,
              value
            );
          });
        });
      }
    });
  }, [initialPage, setValue, definedAreaIDs]);

  const addArea = (areaID: string) => {
    console.log("addArea", areaID);
    setValue(`layoutConfig.areas.${areaID}`, {
      small: {},
      medium: {},
      large: {},
    });
  };

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

      {missingAreaIDs.map((areaID) => (
        <button
          key={areaID}
          type="button"
          onClick={() => {
            addArea(areaID);
          }}
        >
          {`Add ${areaID}`}
        </button>
      ))}

      {definedAreaIDs.map((areaID) => (
        <div key={areaID}>
          <h3>Layout Area: {areaID}</h3>
          {["small", "medium", "large"].map((breakpoint) => (
            <CollapsibleSection
              key={breakpoint}
              title={`${breakpoint.toUpperCase()} Breakpoint`}
              initialOpen={false}
            >
              <TextInput
                {...register(
                  `layoutConfig.areas.${areaID}.${breakpoint}.height`
                )}
                label="Height"
                disabled={disabled}
              />
              <TextInput
                {...register(
                  `layoutConfig.areas.${areaID}.${breakpoint}.backgroundColor`
                )}
                label="Background Color"
                disabled={disabled}
              />
            </CollapsibleSection>
          ))}
        </div>
      ))}
    </form>
  );
};

export default DashboardPageLayoutForm;
