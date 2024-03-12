import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./icon.button.component.module.scss";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import RunningText from "../text.components/running.text.component/running.text.component";
import classNames from "classnames";

interface IconButtonCompinentProps {
  onClick?: (event: any) => void | Promise<void>;
  icon: IconProp;
  label?: string;
  disabled?: boolean;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  form?: string;
  showBorder?: boolean;
  className?: string;
}

const IconButton = ({
  onClick,
  icon,
  label,
  disabled = false,
  type = "button",
  form,
  showBorder = false,
  className,
}: IconButtonCompinentProps): JSX.Element => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onClick && !disabled) {
      onClick(event);
    }
  };

  const iconButtonClassNames = classNames(
    styles.filledButton,
    {
      [styles.iconTabBar]: true,
      [styles.showBorder]: showBorder,
      [styles.disabled]: disabled,
      [styles.withLabel]: label,
    },
    className
  );

  return (
    <button
      form={form}
      type={type}
      className={iconButtonClassNames}
      onClick={handleClick}
      disabled={disabled}
    >
      <FontAwesomeIcon icon={icon} className={styles.icon} />
      {label && <RunningText className={styles.label}>{label}</RunningText>}
    </button>
  );
};

export default IconButton;
