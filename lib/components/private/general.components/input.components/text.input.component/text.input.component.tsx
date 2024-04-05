import React, {
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "./text.input.component.module.scss";
import Column from "../../ui.components/column.component/column.component";
import RunningText from "../../text.components/running.text.component/running.text.component";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  inputRef?: any;
  icon?: IconProp;
  onValueChange?: (value: string | number) => void;
  validationMessage?: string | null;
  className?: string;
  disabled?: boolean;
}

const TextInput = forwardRef(
  (
    {
      label,
      icon,
      validationMessage,
      onValueChange,
      type = "text",
      className,
      inputRef,
      disabled = false,
      ...props
    }: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [inputValue, setInputValue] = useState(props.value);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      if (type === "number") {
        const value = parseFloat(event.target.value);
        if (!isNaN(value)) {
          onValueChange?.(value);
        }
      } else {
        onValueChange?.(event.target.value);
      }
      props.onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(event.target.value);
      props.onChange?.(event);
    };

    const inputWrapperClasses = classNames(styles.wrapper, {
      [styles.wrapperWithError]: validationMessage,
      [styles.wrapperWithIcon]: !!icon,
      [styles.disabled]: disabled,
    });

    const inputClasses = classNames(styles.input, {
      [styles.disabled]: disabled,
    });

    return (
      <Column className={className}>
        {label && <RunningText className={styles.label}>{label}</RunningText>}
        <div className={inputWrapperClasses}>
          {icon && <FontAwesomeIcon className={styles.icon} icon={icon} />}
          <input
            disabled={disabled}
            {...props}
            {...inputRef}
            type={type}
            value={inputValue}
            ref={ref}
            className={inputClasses}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </Column>
    );
  }
);

export default TextInput;
