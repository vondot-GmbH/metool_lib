import React, { useState, useEffect } from "react";

import SmallText from "../text.components/small.text.component/small.text.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/pro-regular-svg-icons";
import styles from "./state.input.text.component.module.scss";
import { inject, observer } from "mobx-react";
import StateStore from "../../../../stores/state.store";

interface StateInputEditorProps {
  label?: string;
  value: string;
  onChange: (newValue: string, oldValue: string) => void;
  onSubscribeState: (stateName: string) => void; // Platzhalter für die Abonnement-Logik
  onUnsubscribeState: (stateName: string) => void; // Platzhalter für die Deabonnement-Logik
  stateStore?: StateStore;
}

interface Suggestion {
  id: string;
  displayName: string;
}

interface ValidationMatch {
  fullMatch: string;
  innerText: string;
}

const StateInputEditor: React.FC<StateInputEditorProps> = ({
  label,
  value,
  onChange,
  onSubscribeState,
  onUnsubscribeState,
  stateStore,
}) => {
  const allStates = stateStore?.getAllStates();

  const [internalValue, setInternalValue] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [previousValue, setPreviousValue] = useState<string>("");

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const newValue = `{{${suggestion.displayName}}}`;
    setInternalValue(newValue);
    onChange(newValue, previousValue);
    setShowSuggestions(false);

    onSubscribeState(suggestion.displayName);
    if (previousValue) {
      onUnsubscribeState(previousValue);
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

  // Auto-Vorschläge basierend auf dem aktuellen Eingabetext
  const updateSuggestions = (inputCode: string): void => {
    const matches = validateSyntax(inputCode);
    if (matches) {
      const availableStates: Suggestion[] = [
        { id: "state1", displayName: "State 1" },
        { id: "state2", displayName: "State 2" },
        { id: "state3", displayName: "State 3" },
      ];

      const filteredSuggestions = availableStates.filter((state) =>
        matches.some((match) => state.displayName?.includes(match.innerText))
      );

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleBlur = () => {
    const matches = validateSyntax(internalValue);

    if (matches) {
      // Wenn die Syntax gültig ist, abonniere den neuen State
      onSubscribeState(matches[0].innerText); // Abonnieren des neuen State
      if (previousValue && previousValue !== matches[0].innerText) {
        onUnsubscribeState(previousValue); // Deabonnieren des alten State, wenn sich der Wert geändert hat
      }
      setPreviousValue(matches[0].innerText); // Speichern des aktuellen Wertes als "vorherigen" Wert für den nächsten Durchlauf
    } else {
      // Wenn die Syntax ungültig ist oder ein fester Wert eingegeben wurde
      if (previousValue) {
        onUnsubscribeState(previousValue); // Deabonnieren des alten State, da kein gültiger State-Referenzwert mehr vorliegt
      }
      setPreviousValue(""); // Zurücksetzen des vorherigen Wertes, da keine gültige State-Referenz mehr vorhanden ist
    }

    onChange(internalValue, previousValue); // Update des Wertes unabhängig von der Validität der Syntax
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
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <SmallText>{suggestion.displayName}</SmallText>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default inject("stateStore")(observer(StateInputEditor));
