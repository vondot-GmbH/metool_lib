import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import styles from "./theme.dropdown.component.module.scss";
import ConfigProvider from "../../../../../config/config.provider";
import {
  ThemeConfig,
  ThemeOption,
} from "../../../../../globals/interfaces/config.interface";
import { useClickedOutside } from "../../../../../globals/helpers/hook.helper";
import SmallText from "../../text.components/small.text.component/small.text.component";
import RunningText from "../../text.components/running.text.component/running.text.component";

type ThemeCategory = keyof ThemeConfig;

interface ThemeDropdownProps {
  onChange: (value: string) => void;
  selectedItem?: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  category: ThemeCategory;
  variant?: "small" | "default";
}

const ThemeDropdown = ({
  onChange,
  selectedItem,
  label,
  disabled = false,
  className,
  category,
  variant = "default",
  placeholder = "Select a theme variable",
}: ThemeDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [themeOptions, setThemeOptions] = useState<ThemeOption[]>([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const dropdownClassName = classNames(styles.dropdown, className, {
    [styles.disabled]: disabled,
  });

  const selectedItemClassName = classNames({
    [styles.selectedItem]: true,
    [styles.selectedItemSmall]: variant === "small",
  });

  const handleToggleDropdown = () => !disabled && setIsOpen(!isOpen);

  useEffect(() => {
    const configProvider = ConfigProvider.getInstance();
    const themeConfig = configProvider.getThemeVariablesForCategory(category);
    if (themeConfig) {
      setThemeOptions(themeConfig);
    }
  }, [category]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  useClickedOutside(optionsRef, () => setIsOpen(false));

  const handleOptionSelect = (option: ThemeOption) => {
    onChange(option.formattedValue);
    setIsOpen(false);
  };

  const buildOptionItem = (
    option: ThemeOption,
    handleClick?: () => void,
    variant: "small" | "default" = "default"
  ) => {
    return (
      <div
        key={option.value}
        className={styles.option}
        onClick={handleClick ? () => handleClick() : undefined}
      >
        {option.value && (
          <div
            className={styles.colorIndicator}
            style={{ backgroundColor: option.value }}
          />
        )}

        {variant === "default" && (
          <SmallText className={styles.optionLabel}>{option.label}</SmallText>
        )}
      </div>
    );
  };

  const buildSelectedItemElement = () => {
    const selectedOption = themeOptions.find(
      (option) => option.formattedValue === selectedItem
    );

    if (selectedOption == null) {
      if (variant === "small") {
        return (
          <div
            className={styles.selectedItemPlaceholder}
            onClick={handleToggleDropdown}
          >
            <div
              className={classNames(
                styles.colorIndicator,
                styles.colorIndicatorTransparent
              )}
            />
          </div>
        );
      } else {
        return (
          <RunningText
            onClick={handleToggleDropdown}
            className={styles.optionPlaceholder}
          >
            {placeholder}
          </RunningText>
        );
      }
    }

    return buildOptionItem(selectedOption, handleToggleDropdown, variant);
  };

  return (
    <div className={dropdownClassName} ref={dropdownRef}>
      {label && (
        <div className={styles.label}>
          <SmallText>{label}</SmallText>
        </div>
      )}
      <div className={selectedItemClassName}>{buildSelectedItemElement()}</div>
      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={optionsRef}
            className={styles.options}
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              position: "fixed",
            }}
          >
            {themeOptions.map((option) =>
              buildOptionItem(option, () => handleOptionSelect(option))
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default ThemeDropdown;
