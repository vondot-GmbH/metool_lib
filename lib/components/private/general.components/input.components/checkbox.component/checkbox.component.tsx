import RunningText from "../../text.components/running.text.component/running.text.component";
import styles from "./checkbox.component.module.scss";

interface CheckboxProps {
  className?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  isDisabled?: boolean;
  label?: string;
}

const Checkbox = ({
  className,
  onChange,
  checked,
  isDisabled,
  label,
}: CheckboxProps): JSX.Element => {
  const handleChange = () => {
    if (onChange && checked !== undefined && !isDisabled) {
      onChange(!checked);
    }
  };

  return (
    <label className={`${styles.checkboxWrapper} ${className || ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={isDisabled}
        className={styles.checkboxInput}
      />
      <span className={styles.checkmark}></span>
      {label && <RunningText>{label}</RunningText>}
    </label>
  );
};

export default Checkbox;
