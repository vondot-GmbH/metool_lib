/* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import styles from "./filled.button.component.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";

interface FilledButtonProps {
  color?: "primary" | "secondary" | "danger" | "warning";
  className?: string;
  label: string;
  disabled?: boolean;
  onClick?: (event: any) => void | Promise<void>;
  type?: "submit" | "button";
  form?: string;
  isLoading?: boolean;
  backgroundColor?: string;
}

const FilledButton = ({
  className,
  label,
  onClick,
  disabled = false,
  color = "secondary",
  type = "button",
  form,
  isLoading = false,
  backgroundColor,
}: FilledButtonProps): JSX.Element => {
  const style = backgroundColor ? { backgroundColor } : {};

  const handleClick = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    if (onClick) {
      onClick(event);
    }
  };

  const filledButtonClassName = classNames(
    styles.filledButton,
    {
      [styles.filledButtonLoading]: isLoading,
      [styles.filledButtonDisabled]: disabled,
      [styles.filledButtonSecondary]: color === "secondary",
      [styles.filledButtonDanger]: color === "danger",
      [styles.filledButtonWarning]: color === "warning",
    },
    className
  );

  return (
    <button
      style={style}
      type={type}
      form={form}
      className={filledButtonClassName}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* TODO add loading commponent */}
      {isLoading && <RunningText>...</RunningText>}
      {!isLoading ? label : ""}
    </button>
  );
};

export default FilledButton;
