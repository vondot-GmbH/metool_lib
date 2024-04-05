import { useState } from "react";
import styles from "./spacing.editor.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import Column from "../ui.components/column.component/column.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDistributeSpacingVertical } from "@fortawesome/pro-regular-svg-icons";
import MultiSwitch from "../input.components/multi.switch.component/multi.switch.component";

export interface SpacingModeValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SpacingValues {
  [key: string]: SpacingModeValues;
}

interface SpacingEditorProps {
  label?: string;
  types?: string[];
  initialValues?: SpacingValues;
  onChange?: (mode: string, values: SpacingModeValues) => void;
  className?: string;
}

const SpacingEditor = ({
  label,
  types = ["margin"],
  onChange,
  initialValues,
  className,
}: SpacingEditorProps) => {
  const [mode, setMode] = useState(types[0]);
  const [values, setValues] = useState<SpacingModeValues>(
    initialValues?.[mode] || { top: 0, right: 0, bottom: 0, left: 0 }
  );

  const handleBlur = (side: keyof SpacingModeValues, value: string): void => {
    const updatedValues = {
      ...values,
      [side]: parseInt(value, 10) || 0,
    };
    onChange?.(mode, updatedValues);
  };

  const handleChange = (side: keyof SpacingModeValues, value: string): void => {
    const updatedValues = {
      ...values,
      [side]: parseInt(value, 10) || 0,
    };
    setValues(updatedValues);
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    setValues(
      initialValues?.[newMode] || { top: 0, right: 0, bottom: 0, left: 0 }
    );
  };

  return (
    <Column className={className}>
      <RunningText>{label}</RunningText>
      <div className={styles.editor}>
        {types.length > 1 && (
          <MultiSwitch
            label="Type"
            initialValue={mode}
            onChange={handleModeChange}
            options={types.map((type) => ({ label: type, value: type }))}
          />
        )}
        <div className={styles.inputsTop}>
          <input
            className={styles.input}
            type="number"
            value={values.top}
            onChange={(e) => handleChange("top", e.target.value)}
            onBlur={(e) => handleBlur("top", e.target.value)}
            placeholder={`${mode} Top`}
          />
        </div>

        <div className={styles.inputsMiddle}>
          <input
            className={styles.input}
            type="number"
            value={values.left}
            onChange={(e) => handleChange("left", e.target.value)}
            onBlur={(e) => handleBlur("left", e.target.value)}
            placeholder={`${mode} Left`}
          />

          <div className={styles.element}>
            <FontAwesomeIcon icon={faDistributeSpacingVertical} />
          </div>

          <input
            className={styles.input}
            type="number"
            value={values.right}
            onChange={(e) => handleChange("right", e.target.value)}
            onBlur={(e) => handleBlur("right", e.target.value)}
            placeholder={`${mode} Right`}
          />
        </div>

        <div className={styles.inputsBottom}>
          <input
            className={styles.input}
            type="number"
            value={values.bottom}
            onChange={(e) => handleChange("bottom", e.target.value)}
            onBlur={(e) => handleBlur("bottom", e.target.value)}
            placeholder={`${mode} Bottom`}
          />
        </div>
      </div>
    </Column>
  );
};

export default SpacingEditor;
