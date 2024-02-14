import React, { useState } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./outlined.text.input.component.module.scss";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import SmallText from "../text.components/small.text.component/small.text.component";

interface OutlinedTextInputProps {
  className?: string;
  inputRef?: any;
  label?: string;
  name?: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  suffixIcon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  validationMessage?: string;
  value?: string | number | Date;
  initialValue?: string;
  onChange?: (value: string | null) => void;
  infoLabel?: string;
  onInfoLabelClick?: () => void;
  disabled?: boolean;
  allowDecimalNumbers?: boolean;
}

const OutlinedTextInput = ({
  className,
  label,
  name,
  inputRef,
  placeholder,
  type = "text",
  suffixIcon,
  onClick,
  validationMessage,
  value,
  initialValue,
  onChange,
  infoLabel,
  onInfoLabelClick,
  disabled = false,
  allowDecimalNumbers = false,
}: OutlinedTextInputProps): JSX.Element => {
  const [showPassword, setShowPassword] = useState(true);
  const [inputType, setInputType] = useState(type);

  const outlinedTextInputClassName = classNames(
    styles.outlinedTextInputContainer,
    { [styles.valiadtionBorder]: validationMessage != null },
    { [styles.mt10Mb15]: label != null },
    className
  );

  const inputFieldClass = classNames(styles.defaultInputField, {
    [styles.defaultInputFieldDisabled]: disabled,
    [styles.defaultInputFieldError]: validationMessage != null,
    [styles.defaultInputFieldInfoLabelActive]:
      infoLabel != null && infoLabel.length > 0,
  });

  const inputLabelClass = classNames(styles.defaultInputFieldLabel, {
    [styles.defaultInputFieldLabelError]: validationMessage != null,
  });

  if (type === "password") {
    suffixIcon = showPassword ? (
      <FontAwesomeIcon icon={faEye} />
    ) : (
      <FontAwesomeIcon icon={faEyeSlash} />
    );
  }

  return (
    <div className={outlinedTextInputClassName}>
      {infoLabel != null && (
        <div
          className={styles.outlinedTextInputContainerInfoTag}
          onClick={onInfoLabelClick}
        >
          {infoLabel}
        </div>
      )}
      <div className={styles.outlinedTextInputContainerWrapper}>
        <div
          className={styles.suffixIcon}
          onClick={() => {
            if (type !== "password") {
              return onClick;
            } else {
              setShowPassword(!showPassword);
              setInputType(showPassword ? "text" : "password");
            }
          }}
        >
          {suffixIcon}
        </div>
        <input
          step={
            inputType === "number" && allowDecimalNumbers ? "0.01" : undefined
          }
          name={name}
          ref={inputRef}
          className={inputFieldClass}
          type={inputType}
          placeholder={placeholder}
          value={value != null ? value.toString() : undefined}
          readOnly={disabled}
          defaultValue={initialValue}
          onChange={(event) => onChange && onChange(event.target.value)}
        />
        {label != null && <label className={inputLabelClass}>{label}</label>}
      </div>
      {validationMessage != null && (
        <SmallText className={styles.validationMessage}>
          {validationMessage}
        </SmallText>
      )}
    </div>
  );
};

export default OutlinedTextInput;
