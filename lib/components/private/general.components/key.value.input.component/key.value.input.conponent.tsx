import { useState, useEffect } from "react";
import Row from "../row.component/row.component";
import styles from "./key.value.input.conponent.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";
import TextInput from "../outlined.text.input.component/outlined.text.input.component";
import IconButton from "../icon.button.component/icon.button.component";
import { faAdd, faX } from "@fortawesome/pro-regular-svg-icons";

interface KeyValue {
  key: string;
  value: string;
}

interface KeyValueInputProps {
  addLabel?: string;
  label?: string;
  defaultEntries?: KeyValue[];
  fields?: any[];
  append?: (obj: any) => void;
  remove?: (index: number) => void;
  register?: any;
  keyLabel?: string;
  valueLabel?: string;
  keyFieldName?: string;
  valueFieldName?: string;
  arrayFieldName?: string;
  disabled?: boolean;
  className?: string;
  validationErrors?: any;
}

const KeyValueInput = ({
  addLabel = "Add Entry",
  label,
  defaultEntries = [],
  fields,
  append,
  remove,
  register,
  keyLabel = "key",
  valueLabel = "value",
  keyFieldName = "key",
  valueFieldName = "value",
  arrayFieldName,
  disabled = false,
  className,
  validationErrors,
}: KeyValueInputProps) => {
  const [internalEntries, setInternalEntries] = useState<any[]>(defaultEntries);

  useEffect(() => {
    if (!fields) {
      setInternalEntries(defaultEntries);
    }
  }, [defaultEntries, fields]);

  const handleAddEntry = () => {
    if (append) {
      append({ [keyFieldName]: "", [valueFieldName]: "" });
    } else {
      setInternalEntries([
        ...internalEntries,
        { [keyFieldName]: "", [valueFieldName]: "" },
      ]);
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
      {label && <RunningText className={styles.label}>{label}</RunningText>}
      {entries.map((field, index) => {
        const keyError =
          validationErrors?.[arrayFieldName as any]?.[index]?.[keyFieldName]
            ?.message;
        const valueError =
          validationErrors?.[arrayFieldName as any]?.[index]?.[valueFieldName]
            ?.message;

        return (
          <Row key={field[keyFieldName] + index} className={styles.row}>
            <TextInput
              {...(register
                ? register(`${arrayFieldName}.${index}.${keyFieldName}`)
                : {})}
              validationMessage={keyError}
              defaultValue={field[keyFieldName]}
              placeholder={keyLabel}
              disabled={disabled}
              onChange={(e) =>
                !register &&
                setInternalEntries((entries) =>
                  entries.map((entry, i) =>
                    i === index
                      ? { ...entry, [keyFieldName]: e.target.value }
                      : entry
                  )
                )
              }
            />

            <TextInput
              disabled={disabled}
              {...(register
                ? register(`${arrayFieldName}.${index}.${valueFieldName}`)
                : {})}
              validationMessage={valueError}
              defaultValue={field[valueFieldName]}
              placeholder={valueLabel}
              onChange={(e) =>
                !register &&
                setInternalEntries((entries) =>
                  entries.map((entry, i) =>
                    i === index
                      ? { ...entry, [valueFieldName]: e.target.value }
                      : entry
                  )
                )
              }
            />

            {!disabled && (
              <IconButton
                className={styles.removeButton}
                icon={faX}
                onClick={() => handleRemoveEntry(index)}
              />
            )}
          </Row>
        );
      })}

      {!disabled && (
        <Row justifyContent="center">
          <IconButton
            icon={faAdd}
            onClick={handleAddEntry}
            label={addLabel}
            showBorder
          />
        </Row>
      )}
    </div>
  );
};

export default KeyValueInput;
