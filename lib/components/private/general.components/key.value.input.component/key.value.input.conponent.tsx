import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import Row from "../row.component/row.component";
import styles from "./key.value.input.conponent.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import TextInput from "../outlined.text.input.component/outlined.text.input.component";

interface KeyValue {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  label?: string;
  defaultEntries?: KeyValue[];
  fields?: any[];
  append?: (obj: any) => void;
  remove?: (index: number) => void;
  register?: any;
  keyLabel?: string;
  valueLabel?: string;
  arrayFieldName?: string;
  disabled?: boolean;
  className?: string;
  validationErrors?: any;
}

const KeyValueInput = ({
  label,
  defaultEntries = [],
  fields,
  append,
  remove,
  register,
  keyLabel = "key",
  valueLabel = "value",
  arrayFieldName,
  disabled = false,
  className,
  validationErrors,
}: KeyValueInputProps) => {
  const [internalEntries, setInternalEntries] =
    useState<KeyValue[]>(defaultEntries);

  useEffect(() => {
    if (!fields) {
      setInternalEntries(defaultEntries);
    }
  }, [defaultEntries, fields]);

  const handleAddEntry = () => {
    if (append) {
      append({ key: "", value: "" });
    } else {
      setInternalEntries([...internalEntries, { key: "", value: "" }]);
    }
  };

  const handleRemoveEntry = (index: number) => {
    if (remove) {
      remove(index);
    } else {
      const updatedEntries = internalEntries.filter((_, i) => i !== index);
      setInternalEntries(updatedEntries);
    }
  };

  const entries = fields || internalEntries;

  return (
    <div
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
    >
      {label && <RunningText>{label}</RunningText>}
      {entries.map((field, index) => {
        const keyError =
          validationErrors?.[arrayFieldName as any]?.[index]?.key?.message;
        const valueError =
          validationErrors?.[arrayFieldName as any]?.[index]?.value?.message;

        return (
          <Row key={field.key + index} className={styles.row}>
            <TextInput
              disabled={disabled}
              {...(register ? register(`${arrayFieldName}.${index}.key`) : {})}
              validationMessage={keyError}
              defaultValue={field.key}
              placeholder={keyLabel}
              onChange={(e) =>
                !register &&
                setInternalEntries((entries) =>
                  entries.map((entry, i) =>
                    i === index ? { ...entry, key: e.target.value } : entry
                  )
                )
              }
            />

            <TextInput
              disabled={disabled}
              {...(register
                ? register(`${arrayFieldName}.${index}.value`)
                : {})}
              validationMessage={valueError}
              defaultValue={field.value}
              placeholder={valueLabel}
              onChange={(e) =>
                !register &&
                setInternalEntries((entries) =>
                  entries.map((entry, i) =>
                    i === index ? { ...entry, value: e.target.value } : entry
                  )
                )
              }
            />

            {!disabled && (
              <FontAwesomeIcon
                className={styles.removeButton}
                icon={faXmarkCircle}
                onClick={() => handleRemoveEntry(index)}
              />
            )}
          </Row>
        );
      })}

      {!disabled && (
        <button
          type="button"
          className={styles.addButton}
          onClick={handleAddEntry}
        >
          Add Entry
        </button>
      )}
    </div>
  );
};

export default KeyValueInput;
