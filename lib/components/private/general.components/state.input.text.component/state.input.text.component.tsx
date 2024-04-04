import { useState, useEffect, useCallback, useRef } from "react";
import SmallText from "../text.components/small.text.component/small.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faText } from "@fortawesome/pro-regular-svg-icons";
import styles from "./state.input.text.component.module.scss";
import { inject, observer } from "mobx-react";
import StateStore from "../../../../stores/state.store";
import fuzzysort from "fuzzysort";
import { debounce } from "lodash";
import { useClickedOutside } from "../../../../globals/helpers/hook.helper";
import classNames from "classnames";
import { isValidStateSyntax } from "../../../../globals/helpers/state.helper";

interface StateInputEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  stateStore?: StateStore;
  className?: string;
}

interface ValidationMatch {
  fullMatch: string;
  innerText: string;
}

enum InputType {
  DYNAMIC = "dynamic",
  FIXED = "fixed",
}

const StateInputEditor = ({
  label,
  value,
  onChange,
  stateStore,
  className,
}: StateInputEditorProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);

  const [internalValue, setInternalValue] = useState<string>(value);
  const [initialValue, setInitialValue] = useState<string>(value);
  const [inputType, setInputType] = useState<InputType>(
    isValidStateSyntax(value) ? InputType.DYNAMIC : InputType.FIXED
  );

  const editorRef = useRef(null);

  // handle click outside for the dropdown of suggestions
  useClickedOutside(editorRef, () => setShowSuggestions(false));

  useEffect(() => {
    const globalStates = stateStore?.globalStates;
    const stateSuggestions: string[] = globalStates
      ? Array.from(globalStates.keys())
      : [];
    setAvailableStates(stateSuggestions);
  }, [stateStore]);

  useEffect(() => {
    if (value !== initialValue) {
      setInternalValue(value);
      setInitialValue(value);
    }
  }, [value, initialValue]);

  const debouncedUpdateSuggestions = useCallback(
    debounce((inputCode: string) => {
      const syntaxMatch = validateSyntax(inputCode);
      if (!syntaxMatch) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const searchTerm = syntaxMatch[0].innerText.trim();

      const results = fuzzysort.go(searchTerm, availableStates, {
        threshold: -1000,
        limit: 6,
      });

      const filteredSuggestions = results.map((result) => result.target);

      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    }, 300),
    [availableStates]
  );

  useEffect(() => {
    if (inputType === InputType.DYNAMIC) {
      debouncedUpdateSuggestions(internalValue);
    }
  }, [internalValue, inputType, debouncedUpdateSuggestions]);

  const editorWrapperClassName = classNames(className, {
    [styles.editorWrapper]: true,
  });

  const validateSyntax = (inputCode: string): ValidationMatch[] | null => {
    const regex = /\{\{([\w\s.]+)\}\}/g;
    let matches;
    const results: ValidationMatch[] = [];

    while ((matches = regex.exec(inputCode)) !== null) {
      results.push({
        fullMatch: matches[0],
        innerText: matches[1],
      });
    }

    return results.length > 0 ? results : null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInternalValue(newValue);
    setInputType(
      isValidStateSyntax(newValue) ? InputType.DYNAMIC : InputType.FIXED
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newValue = `{{${suggestion}}}`;

    setInternalValue(newValue);
    setShowSuggestions(false);

    if (inputType === InputType.DYNAMIC) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    if (inputType === InputType.FIXED) {
      onChange(internalValue);
    } else if (inputType === InputType.DYNAMIC) {
      const matches = validateSyntax(internalValue);

      if (matches && availableStates.includes(matches[0].innerText)) {
        onChange(internalValue);
      }
    }
  };

  const buildSuggestions = (): JSX.Element => {
    return (
      <>
        {inputType === InputType.DYNAMIC &&
          isFocused &&
          showSuggestions &&
          suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <SmallText>{suggestion}</SmallText>
                </li>
              ))}
            </ul>
          )}
      </>
    );
  };

  return (
    <div className={editorWrapperClassName} ref={editorRef}>
      {label && <SmallText className={styles.label}>{label}</SmallText>}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={styles.input}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
        />

        <div className={styles.iconWrapper}>
          {inputType === InputType.DYNAMIC ? (
            <FontAwesomeIcon icon={faCode} className={styles.codeIcon} />
          ) : (
            <FontAwesomeIcon icon={faText} className={styles.codeIcon} />
          )}
        </div>
      </div>
      {buildSuggestions()}
    </div>
  );
};

export default inject("stateStore")(observer(StateInputEditor));
