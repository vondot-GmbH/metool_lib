import { useEffect, useState } from "react";
import ConfigProvider from "../../../../../config/config.provider";
import SelectDropDown from "../select.dropdown.component/select.dropdown.component";
import { ThemeConfig } from "../../../../../globals/interfaces/config.interface";

type ThemeCategory = keyof ThemeConfig;

interface ThemeDropdownProps {
  onChange: (value: any) => void;
  selectedItem: any;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  category: ThemeCategory;
}

const ThemeDropdown = ({
  onChange,
  selectedItem,
  label,
  placeholder = "Select a theme variable",
  disabled,
  className,
  category,
}: ThemeDropdownProps) => {
  const [themeOptions, setThemeOptions] =
    useState<{ label: string; value: string; color?: string }[]>();

  useEffect(() => {
    const configProvider = ConfigProvider.getInstance();
    const themeConfig = configProvider.getThemeVariablesForCategory(category);

    const options = themeConfig?.map((option) => ({
      label: option.label,
      value: option.formattedValue,
      color: category === "colors" ? option.value : undefined,
    }));

    if (options != null) {
      setThemeOptions(options);
    }
  }, [category]);

  if (!themeOptions) {
    return null;
  }

  return (
    <SelectDropDown
      items={themeOptions || []}
      onChange={onChange}
      selectedItem={selectedItem}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
};

export default ThemeDropdown;
