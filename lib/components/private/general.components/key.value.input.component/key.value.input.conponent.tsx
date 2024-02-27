import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import Row from "../row.component/row.component";
import styles from "./key.value.input.conponent.module.scss";
import RunningText from "../text.components/running.text.component/running.text.component";

interface KeyValueInputProps {
  label?: string;
  fields: any[];
  append: (obj: any) => void;
  remove: (index: number) => void;
  register: any;
  keyLabel?: string;
  valueLabel?: string;
  arrayFieldName: string;
  disabled?: boolean;
  className?: string;
}

const KeyValueInput = ({
  disabled = false,
  label,
  fields,
  append,
  remove,
  register,
  keyLabel = "key",
  valueLabel = "value",
  arrayFieldName,
  className,
}: KeyValueInputProps) => {
  return (
    <div
      className={className ? `${styles.wrapper} ${className}` : styles.wrapper}
    >
      {/* {label && <RunningText>{label}</RunningText>} */}
      <RunningText>{label}</RunningText>
      {fields.map((field, index) => (
        <Row key={field.key + index} className={styles.row} alignItems="center">
          <input
            disabled={disabled}
            {...register(`${arrayFieldName}.${index}.key`)}
            className={styles.input}
            defaultValue={field.key}
            placeholder={keyLabel}
          />

          <input
            disabled={disabled}
            {...register(`${arrayFieldName}.${index}.value`)}
            className={styles.input}
            defaultValue={field.value}
            placeholder={valueLabel}
          />
          {!disabled && (
            <FontAwesomeIcon
              className={styles.removeButton}
              icon={faXmarkCircle}
              onClick={() => {
                if (!disabled) {
                  remove(index);
                }
              }}
            />
          )}
        </Row>
      ))}
      {!disabled && (
        <button
          className={styles.addButton}
          onClick={() => {
            if (!disabled) {
              append({ key: "", value: "" });
            }
          }}
        >
          Add Entry
        </button>
      )}
    </div>
  );
};

export default KeyValueInput;

//! outcommented code (same component as above but wihtout react-hook-form)
// TODO combine both components into one and use react-hook-form as an optional dependency

// import { useState } from "react";
// import styles from "./key.value.input.conponent.module.scss";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
// import Row from "../row.component/row.component";

// interface KeyValue {
//   key: string;
//   value: string;
// }

// interface KeyValueInputProps {
//   defaultEntries?: KeyValue[];
//   keyLabel?: string;
//   valueLabel?: string;
//   onEntriesChange?: (entries: KeyValue[]) => void;
// }

// const KeyValueInput = ({
//   defaultEntries = [],
//   keyLabel = "key",
//   valueLabel = "value",
//   onEntriesChange,
// }: KeyValueInputProps) => {
//   const [entries, setEntries] = useState<KeyValue[]>(defaultEntries);

//   const handleAddEntry = () => {
//     setEntries([...entries, { key: "", value: "" }]);
//   };

//   const handleRemoveEntry = (index: number) => {
//     const updatedEntries = entries.filter((_, i) => i !== index);
//     setEntries(updatedEntries);
//     onEntriesChange?.(updatedEntries);
//   };

//   const handleChange = (index: number, key: "key" | "value", value: string) => {
//     const updatedEntries = entries.map((entry, i) =>
//       i === index ? { ...entry, [key]: value } : entry
//     );
//     setEntries(updatedEntries);
//     onEntriesChange?.(updatedEntries);
//   };

//   return (
//     <div className={styles.wrapper}>
//       {entries.map((entry, index) => (
//         <Row key={index} className={styles.row} alignItems="center">
//           <input
//             type="text"
//             className={styles.input}
//             placeholder={keyLabel}
//             value={entry.key}
//             onChange={(e) => handleChange(index, "key", e.target.value)}
//           />

//           <input
//             type="text"
//             className={styles.input}
//             placeholder={valueLabel}
//             value={entry.value}
//             onChange={(e) => handleChange(index, "value", e.target.value)}
//           />

//           <FontAwesomeIcon
//             className={styles.removeButton}
//             icon={faXmarkCircle}
//             onClick={() => handleRemoveEntry(index)}
//           />
//         </Row>
//       ))}
//       <button className={styles.addButton} onClick={handleAddEntry}>
//         Add Entry
//       </button>
//     </div>
//   );
// };

// export default KeyValueInput;
