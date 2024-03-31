import React, { useState, useEffect } from "react";
import ThemeDropdown from "../theme.dropdown.component/theme.dropdown.component";
import TextInput from "../../outlined.text.input.component/outlined.text.input.component";
import {
  faSquare,
  faSquareDashed,
  faSquareDashedCirclePlus,
} from "@fortawesome/pro-regular-svg-icons";
import Row from "../../row.component/row.component";
import SmallText from "../../text.components/small.text.component/small.text.component";
import styles from "./border.input.component.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BorderEditorProps {
  label?: string;
  initialValue: string;
  onChange: (border: string) => void;
}

const borderStyles = [
  { label: "Solid", value: "solid", icon: faSquare },
  { label: "Dashed", value: "dashed", icon: faSquareDashed },
  { label: "Dotted", value: "dotted", icon: faSquareDashedCirclePlus },
];

const BorderEditor: React.FC<BorderEditorProps> = ({
  initialValue,
  onChange,
  label = "Border",
}) => {
  const [thickness, setThickness] = useState("");
  const [style, setStyle] = useState(borderStyles[0].value);
  const [color, setColor] = useState("");
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    const { initialThickness, initialStyle, initialColor } =
      parseInitialValue(initialValue);

    console.log(initialThickness, initialStyle, initialColor);
    setThickness(initialThickness);
    setColor(initialColor);
    const foundIndex = borderStyles.findIndex(
      (item) => item.value === initialStyle
    );
    if (foundIndex !== -1) {
      setStyleIndex(foundIndex);
      setStyle(initialStyle);
    }
  }, [initialValue]);

  const handleThicknessChange = (value: string) => {
    setThickness(value);
    commitChanges(value, style, color);
  };

  const handleStyleChange = () => {
    const newIndex = (styleIndex + 1) % borderStyles.length;
    setStyleIndex(newIndex);
    const newStyle = borderStyles[newIndex].value;
    setStyle(newStyle);
    commitChanges(thickness, newStyle, color);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    commitChanges(thickness, style, newColor);
  };

  const commitChanges = (
    newThickness: string,
    newStyle: string,
    newColor: string
  ) => {
    onChange(`${newThickness} ${newStyle} ${newColor}`);
  };

  return (
    <div>
      <SmallText className={styles.borderInputLabel}>{label}</SmallText>
      <Row className={styles.borderEditorWrapper}>
        <TextInput
          key={thickness}
          label="Thickness"
          value={thickness}
          onValueChange={(value) => handleThicknessChange(value as string)}
          className={styles.thicknessInput}
        />
        <div className={styles.styleWrapper}>
          <SmallText className={styles.styleLabel}>Style</SmallText>
          <FontAwesomeIcon
            className={styles.styleButton}
            icon={borderStyles[styleIndex].icon}
            onClick={handleStyleChange}
          />
        </div>

        <ThemeDropdown
          label="Color"
          category="colors"
          onChange={handleColorChange}
          selectedItem={color}
          variant="small"
          className={styles.colorDropdown}
        />
      </Row>
    </div>
  );
};

const parseInitialValue = (borderString: string) => {
  const [initialThickness, initialStyle, initialColor] =
    borderString.split(" ");
  return { initialThickness, initialStyle, initialColor };
};

export default BorderEditor;
