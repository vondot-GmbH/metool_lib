import { useRef, useState } from "react";
import styles from "./css.property.editor.component.module.scss";
import TextInput from "../../outlined.text.input.component/outlined.text.input.component";
import SmallText from "../../text.components/small.text.component/small.text.component";
import IconButton from "../../icon.button.component/icon.button.component";
import { faPlus, faX } from "@fortawesome/pro-regular-svg-icons";
import ThemeDropdown from "../theme.dropdown.component/theme.dropdown.component";
import { useClickedOutside } from "../../../../../globals/helpers/hook.helper";

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
  const typeSelectorRef = useRef<HTMLDivElement>(null);
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [typeSelectorPosition, setTypeSelectorPosition] = useState({
    top: 0,
    left: 0,
  });
  const [properties, setProperties] = useState<CSSProperty[]>(
    Object.entries(initialProperties).map(([type, value]) => ({
      type: type as CssPropertyType,
      value,
    }))
  );

  useClickedOutside(typeSelectorRef, () => {
    setIsTypeSelectorOpen(false);
  });

  const handleAddPropertyClick = (event: React.MouseEvent) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setTypeSelectorPosition({
      top: buttonRect.bottom + window.scrollY + 5,
      left: buttonRect.left + window.scrollX - 170,
    });
    setIsTypeSelectorOpen(!isTypeSelectorOpen);
  };

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
          onClick={(event) => handleAddPropertyClick(event)}
        />
        {isTypeSelectorOpen && (
          <div
            ref={typeSelectorRef}
            className={styles.typeSelector}
            style={{
              top: `${typeSelectorPosition.top}px`,
              left: `${typeSelectorPosition.left}px`,
            }}
          >
            {cssPropertiesConfig.map((config) => (
              <div
                key={config.type}
                className={styles.typeOption}
                onClick={() => handleAddProperty(config.type)}
              >
                <SmallText>{config.label}</SmallText>
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

      {!properties.length && (
        <div className={styles.emptyState}>
          <SmallText>No properties added yet</SmallText>
        </div>
      )}
    </div>
  );
};

export default CSSPropertyEditor;
