import {
  ChangeEventHandler,
  Dispatch,
  forwardRef,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import uniq from "lodash/uniq";
import without from "lodash/without";

import StyledButton from "@/components/ui/button/styled-button";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";
import { getInputClass } from "@/helpers/utils";

const ChipsInput = forwardRef<
  HTMLInputElement,
  {
    chips?: string[];
    setChips: Dispatch<SetStateAction<string[]>>;
    checkErrors: boolean;
  }
>(({ chips = [], setChips, checkErrors = false }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocussed, setIsInputFocussed] = useState(false);

  const maxChips = 15;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;

    if (value.includes(",")) {
      if (chips.length >= maxChips) {
        setInputValue("");
        return;
      }
      const newChips = uniq(
        value
          .split(",")
          .map((chip) => chip.trim())
          .filter((chip) => chip && !chips.includes(chip)),
      );

      setChips((prevChips) =>
        uniq([...prevChips, ...newChips]).slice(0, maxChips),
      );
      setInputValue("");
    } else {
      setInputValue(value);
    }
  };

  const handleDeleteChip = (chipToDelete: string) => {
    setChips((prevChips) => without(prevChips, chipToDelete));
  };

  const chipsList = useMemo(() => {
    return chips.map((chip, index) => (
      <div key={index} className={styles.chip}>
        {chip}
        <StyledButton
          onClick={() => handleDeleteChip(chip)}
          aria-label={`Delete ${chip}`}
          className={styles.chipDeleteBtn}
        >
          &times;
        </StyledButton>
      </div>
    ));
  }, [chips]);

  return (
    <>
      <div
        className={getInputClass({
          className: cn(
            styles.defaultChipsInput,
            isInputFocussed ? styles.focusedChipsInput : "",
          ),
          error: checkErrors && chips.length === 0,
        })}
      >
        {chipsList}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type here ..."
          disabled={chips.length >= maxChips}
          className={cn(
            styles.defaultTextInput,
            chips.length >= maxChips
              ? styles.diabledTextInput
              : styles.enabledTextInput,
          )}
          ref={ref}
          onFocus={() => setIsInputFocussed(true)}
          onBlur={() => setIsInputFocussed(false)}
        />
      </div>
      <p
        className={`${styles.inputStatusInfo} ${
          chips.length >= maxChips ? styles.errorText : styles.skillsAddedText
        }`}
      >
        {chips.length >= maxChips
          ? "Maximum chips reached. Remove a chip to add more."
          : `${chips.length}/${maxChips} skills added.`}
      </p>
    </>
  );
});

export default ChipsInput;
