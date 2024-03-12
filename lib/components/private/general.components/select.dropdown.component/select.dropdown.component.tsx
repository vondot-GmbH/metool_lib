import { useEffect, useState } from "react";
import Select, { ActionMeta } from "react-select";
import classNames from "classnames";
import styles from "./select.dropdown.component.module.scss";
import Row from "../row.component/row.component";
import Image from "../image.component/image.component";
import SmallText from "../text.components/small.text.component/small.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RunningText from "../text.components/running.text.component/running.text.component";

interface SelectDropDownProps {
  items: any[];
  onChange?: (value: any, actionMeta?: ActionMeta<any>) => void;
  selectedItem?: any;
  isMulti?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  labelPropertyName?: string;
  valuePropertyName?: string;
  imagePropertyName?: string;
  iconPropertyName?: string;
  className?: any;
  isLoading?: boolean;
  showBorder?: boolean;
  menuIsOpen?: boolean;
  validationMessage?: string;
  inputRef?: any;
}

const SelectDropDown = ({
  items,
  onChange,
  selectedItem,
  isMulti = false,
  label,
  placeholder = "Auswählen",
  disabled = false,
  labelPropertyName = "label",
  valuePropertyName = "value",
  imagePropertyName = "image",
  iconPropertyName = "icon",
  className,
  isLoading = false,
  menuIsOpen,
  validationMessage,
  inputRef,
}: SelectDropDownProps): JSX.Element => {
  const resolve = (path: string, obj: any): any => {
    return path.split(".").reduce(function (prev, curr) {
      return prev ? prev[curr] : null;
    }, obj || self);
  };

  // const [selectedValue, setSelectedValue] = useState(selectedItem);
  const [selectedValue, setSelectedValue] = useState(() => {
    return items.find(
      (item) => resolve(valuePropertyName, item) === selectedItem
    );
  });

  let selectClass = classNames(styles.selectContainer, className);

  if (disabled) {
    selectClass += styles.selectContainerDisabled;
  }

  // input label color on validation error
  let inputLabelClass = classNames();

  if (label != null) {
    inputLabelClass += styles.selectLabel;
  }

  if (validationMessage != null && validationMessage !== "") {
    selectClass += styles.selectLabelError;
  }

  useEffect(() => {
    if (items == null) {
      return;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (typeof item === "object" && "options" in item) {
        delete item.options;
      }
    }
  }, [items]);

  useEffect(() => {
    // Call initial if undefined
    if (onChange != null && selectedItem == null) {
      onChange(selectedItem);
    }
  }, [selectedItem]);

  const getOptionLabel = (option: any): any => {
    const image = option[imagePropertyName];
    const icon = option[iconPropertyName];

    return (
      <Row alignItems="center">
        {image && <Image imageUrl={image} className={styles.icon} />}
        {icon && <FontAwesomeIcon icon={icon} className={styles.icon} />}
        <RunningText>{resolve(labelPropertyName, option)}</RunningText>
      </Row>
    );
  };

  const buildSelect = (): JSX.Element => {
    return (
      <div className={selectClass}>
        <input {...inputRef} type="hidden" />
        {label != null && (
          <SmallText className={inputLabelClass}>{label}</SmallText>
        )}
        <Select
          menuPortalTarget={document.body}
          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          isLoading={isLoading}
          menuIsOpen={menuIsOpen}
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          getOptionLabel={(option: any) => {
            return getOptionLabel(option);
          }}
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          getOptionValue={(option: any) => {
            return resolve(valuePropertyName, option);
          }}
          className={styles.select}
          classNamePrefix={styles.dropdownSelectionControl}
          value={selectedValue ?? null}
          onChange={(val) => {
            setSelectedValue(val);

            if (onChange != null) {
              onChange(val);
            }
          }}
          options={items}
          isMulti={isMulti}
          placeholder={placeholder}
          isDisabled={disabled}
        />
        {validationMessage != null && (
          <SmallText className={styles.validationMessage}>
            {validationMessage}
          </SmallText>
        )}
      </div>
    );
  };

  return buildSelect();
};

export default SelectDropDown;
