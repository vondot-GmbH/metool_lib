import React, {
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useState,
} from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import styles from "./outlined.text.input.component.module.scss";
import Column from "../column.component/column.component";
import RunningText from "../text.components/running.text.component/running.text.component";
import SmallText from "../text.components/small.text.component/small.text.component";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  inputRef?: any;
  icon?: IconProp;
  onValueChange?: (value: string | number) => void;
  validationMessage?: string | null;
  className?: string;
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
      ...props
    }: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [inputValue, setInputValue] = useState(props.value);

    // const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    //   if (type === "number" && onValueChange) {
    //     const value = parseFloat(event.target.value);
    //     if (!isNaN(value)) {
    //       onValueChange(value);
    //     }
    //   } else {
    //     onValueChange?.(event.target.value);
    //   }
    // };

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    //   setInputValue(event.target.value);
    // };

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
    });

    const inputClasses = classNames(styles.input, {});

    return (
      <Column className={className}>
        {label && <RunningText className={styles.label}>{label}</RunningText>}
        <div className={inputWrapperClasses}>
          {icon && <FontAwesomeIcon className={styles.icon} icon={icon} />}
          <input
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
        {validationMessage ? (
          <SmallText className={styles.errorText}>
            {validationMessage}
          </SmallText>
        ) : (
          <SmallText className={styles.errorText}>&nbsp;</SmallText>
        )}
      </Column>
    );
  }
);

export default TextInput;
