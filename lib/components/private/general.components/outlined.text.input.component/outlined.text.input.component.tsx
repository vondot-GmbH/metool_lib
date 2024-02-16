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

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label?: string;
  icon?: IconProp;
  onValueChange?: (value: string) => void;
  hasError?: boolean;
}

const TextInput = forwardRef(
  (
    { label, icon, hasError, onValueChange, ...props }: TextInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ): JSX.Element => {
    const [inputValue, setInputValue] = useState(props.value);

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      onValueChange?.(event.target.value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setInputValue(event.target.value);
      // Hier nicht onValueChange aufrufen, da wir warten bis onBlur ausgelöst wird
    };

    const inputWrapperClasses = classNames(styles.wrapper, {
      [styles.wrapperWithError]: hasError,
      [styles.wrapperWithIcon]: !!icon,
    });

    const inputClasses = classNames(styles.input, {
      [styles.inputWithError]: hasError,
    });

    return (
      <Column>
        {label && <RunningText className={styles.label}>{label}</RunningText>}
        <div className={inputWrapperClasses}>
          {icon && <FontAwesomeIcon className={styles.icon} icon={icon} />}
          <input
            {...props}
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
