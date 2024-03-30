import { useState } from "react";
import styles from "./css.property.editor.component.module.scss";
import TextInput from "../../outlined.text.input.component/outlined.text.input.component";
import SmallText from "../../text.components/small.text.component/small.text.component";
import IconButton from "../../icon.button.component/icon.button.component";
import { faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import RunningText from "../../text.components/running.text.component/running.text.component";
import ThemeDropdown from "../theme.dropdown.component/theme.dropdown.component";

// types of available CSS properties
enum CssPropertyType {
  Color = "color",
  BackgroundColor = "backgroundColor",
  FontSize = "fontSize",
}

// assign CSS properties to the corresponding type
const cssPropertiesConfig = [
  { label: "Background Color", type: CssPropertyType.BackgroundColor },
  { label: "Text Color", type: CssPropertyType.Color },
  { label: "Font Size", type: CssPropertyType.FontSize },
];

interface CSSProperty {
  type: CssPropertyType;
  value: string;
}

interface CSSPropertyEditorProps {
  onChange: (properties: Record<string, string>) => void;
  initialProperties?: Record<string, string>;
  label?: string;
}

const CSSPropertyEditor = ({
  onChange,
  initialProperties = {},
  label = "CSS Properties",
}: CSSPropertyEditorProps) => {
  const [properties, setProperties] = useState<CSSProperty[]>(
    Object.entries(initialProperties).map(([type, value]) => ({
      type: type as CssPropertyType,
      value,
    }))
  );
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);

  const handleAddProperty = (type: CssPropertyType) => {
    setIsTypeSelectorOpen(false);
    setProperties([...properties, { type, value: "" }]);
  };

  const handlePropertyChange = (index: number, value: string) => {
    const updatedProperties = [...properties];
    updatedProperties[index].value = value;
    setProperties(updatedProperties);
    onChange(convertPropertiesToRecord(updatedProperties));
  };

  const handleRemoveProperty = (index: number) => {
    const updatedProperties = [...properties];
    updatedProperties.splice(index, 1);
    setProperties(updatedProperties);
    onChange(convertPropertiesToRecord(updatedProperties));
  };

  const convertPropertiesToRecord = (
    properties: CSSProperty[]
  ): Record<string, string> => {
    return properties.reduce((acc, { type, value }) => {
      acc[type] = value;
      return acc;
    }, {} as Record<string, string>);
  };

  const renderPropertyInput = (property: CSSProperty, index: number) => {
    switch (property.type) {
      case CssPropertyType.BackgroundColor:
      case CssPropertyType.Color:
        return (
          <ThemeDropdown
            category="colors"
            label={
              cssPropertiesConfig.find(
                (config) => config.type === property.type
              )?.label || ""
            }
            onChange={(item) => handlePropertyChange(index, item.value)}
            selectedItem={property.value}
          />
        );
      default:
        return (
          <TextInput
            label={
              cssPropertiesConfig.find(
                (config) => config.type === property.type
              )?.label
            }
            value={property.value}
            onChange={(value) => handlePropertyChange(index, value as any)}
          />
        );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerHeader}>
        <SmallText>{label}</SmallText>
        <IconButton
          icon={faPlus}
          onClick={() => setIsTypeSelectorOpen(!isTypeSelectorOpen)}
        />
        {isTypeSelectorOpen && (
          <div className={styles.typeSelector}>
            {cssPropertiesConfig.map((config) => (
              <div
                key={config.type}
                className={styles.typeOption}
                onClick={() => handleAddProperty(config.type)}
              >
                <RunningText>{config.label}</RunningText>
              </div>
            ))}
          </div>
        )}
      </div>
      {properties.map((property, index) => (
        <div key={index} className={styles.propertyRow}>
          {renderPropertyInput(property, index)}
          <IconButton icon={faX} onClick={() => handleRemoveProperty(index)} />
        </div>
      ))}
    </div>
  );
};

export default CSSPropertyEditor;
