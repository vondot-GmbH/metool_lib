import React, { useState, useEffect } from "react";

import SmallText from "../text.components/small.text.component/small.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/pro-regular-svg-icons";
import styles from "./state.input.text.component.module.scss";
import { inject, observer } from "mobx-react";
import StateStore from "../../../../stores/state.store";
import fuzzysort from "fuzzysort";

interface StateInputEditorProps {
  label?: string;
  value: string;
  onChange: (newValue: string, oldValue: string) => void;
  stateStore?: StateStore;
}

interface ValidationMatch {
  fullMatch: string;
  innerText: string;
}

const StateInputEditor: React.FC<StateInputEditorProps> = ({
  label,
  value,
  onChange,
  stateStore,
}) => {
  const [internalValue, setInternalValue] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [previousValue, setPreviousValue] = useState<string>("");

  useEffect(() => {
    const globalStates = stateStore?.getAllStates();
    const stateSuggestions: string[] = globalStates
      ? Array.from(globalStates.keys())
      : [];

    console.log("stateSuggestions");
    console.log(stateSuggestions);
    setAvailableStates(stateSuggestions);
  }, [stateStore]);

  const handleSuggestionClick = (suggestion: string) => {
    const newValue = `{{${suggestion}}}`;
    setInternalValue(newValue);
    onChange(newValue, previousValue);
    setShowSuggestions(false);

    console.log("subscription");
    console.log(suggestion);
    if (previousValue) {
      console.log("onUnsubscribeState");
      console.log(previousValue);
    }

    setPreviousValue(newValue);
  };

  // Syntax-Validator
  const validateSyntax = (inputCode: string): ValidationMatch[] | null => {
    const regex = /\{\{([\w\s]+)\}\}/g;
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

  const updateSuggestions = (inputCode: string): void => {
    const syntaxMatch = validateSyntax(inputCode);

    // Setze Vorschläge zurück und zeige sie nicht an, wenn die Syntax nicht gültig ist
    if (!syntaxMatch) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Extrahiere den Suchbegriff aus dem ersten gültigen Syntax-Match
    const searchTerm = syntaxMatch[0].innerText.trim();

    // Führe die Fuzzy-Suche nur mit dem gültigen Suchbegriff durch
    const results = fuzzysort.go(searchTerm, availableStates, {
      threshold: -1000, // Du kannst diesen Wert anpassen, um die Empfindlichkeit der Suche zu steuern
      limit: 6, // Begrenze die Anzahl der Ergebnisse
    });

    // Extrahiere die Originalstrings aus den Suchergebnissen
    const filteredSuggestions = results.map((result) => result.target);

    setSuggestions(filteredSuggestions);
    setShowSuggestions(filteredSuggestions.length > 0);
  };

  const handleBlur = () => {
    const matches = validateSyntax(internalValue);

    if (matches) {
      //   onSubscribeState(matches[0].innerText);

      console.log("subscription");
      console.log(matches[0].innerText);

      if (previousValue && previousValue !== matches[0].innerText) {
        // onUnsubscribeState(previousValue);
        console.log("onUnsubscribeState");
        console.log(previousValue);
      }
      setPreviousValue(matches[0].innerText);
    } else {
      // check if the previous value was a valid state
      if (previousValue) {
        // onUnsubscribeState(previousValue);
        console.log("onUnsubscribeState");
        console.log(previousValue);
      }
      setPreviousValue("");
    }

    onChange(internalValue, previousValue);
  };

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    updateSuggestions(internalValue);
  }, [internalValue]);

  return (
    <div className={styles.editorWrapper}>
      {label && <SmallText className={styles.label}>{label}</SmallText>}
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={handleBlur}
          className={styles.input}
        />
        {internalValue?.includes("{{") && internalValue?.includes("}}") && (
          <FontAwesomeIcon icon={faCode} className={styles.codeIcon} />
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
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
    </div>
  );
};

export default inject("stateStore")(observer(StateInputEditor));
