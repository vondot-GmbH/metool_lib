import { useState } from "react";
import styles from "./multi.switch.component.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RunningText from "../text.components/running.text.component/running.text.component";

interface Option {
  label?: string;
  icon?: IconProp;
  value: string;
}

interface MultiSwitchProps {
  key?: string;
  label?: string;
  options: Option[];
  initialValue?: string | undefined;
  onChange?: (value: string) => void;
}

const MultiSwitch = ({
  options,
  label,
  initialValue,
  onChange,
  key,
}: MultiSwitchProps) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  const buildLabel = (option: Option) => {
    if (option.icon) {
      return <FontAwesomeIcon icon={option.icon} />;
    }

    if (option.label) {
      return <RunningText>{option.label}</RunningText>;
    }

    return <RunningText>{option.value}</RunningText>;
  };

  return (
    <div className={styles.multiSwitchWrapper} key={key}>
      <RunningText>{label}</RunningText>
      <div className={styles.multiSwitch}>
        {options.map((option) => (
          <button
            key={option.value}
            className={`${styles.switchOption} ${
              selectedValue === option.value ? styles.active : ""
            }`}
            onClick={() => handleChange(option.value)}
          >
            {buildLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MultiSwitch;
