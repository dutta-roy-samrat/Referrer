import {
  ChangeEventHandler,
  Dispatch,
  forwardRef,
  SetStateAction,
  useState,
} from "react";
import StyledButton from "../buttons/styled-button";

const defaultArr: string[] = [];
const ChipsInput = forwardRef<
  HTMLInputElement,
  { chips?: string[]; setChips: Dispatch<SetStateAction<string[]>> }
>(({ chips = defaultArr, setChips }, ref) => {
  const [inputValue, setInputValue] = useState("");
  const maxChips = 15;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = event.target.value;

    if (value.includes(",")) {
      if (chips.length >= maxChips) {
        setInputValue("");
        return;
      }

      const words = value.split(",");
      const newChips = words.slice(0, -1);
      const trimmedChips = newChips
        .map((chip) => chip.trim())
        .filter((chip) => chip && !chips.includes(chip));

      setChips((prevChips) =>
        [...prevChips, ...trimmedChips].slice(0, maxChips),
      );
      return setInputValue("");
    }
    return setInputValue(value);
  };

  const handleDeleteChip = (chipToDelete: string) => {
    setChips((prevChips) => prevChips.filter((chip) => chip !== chipToDelete));
  };

  return (
    <>
      <div
        tabIndex={-1}
        className="flex flex-wrap items-center rounded-lg border p-3 focus-within:border-2 focus-visible:border-2"
        ref={ref}
      >
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
          >
            {chip}
            <StyledButton
              onClick={() => handleDeleteChip(chip)}
              aria-label={`Delete ${chip}`}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            >
              &times;
            </StyledButton>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type here ..."
          disabled={chips.length >= maxChips}
          className={`max-w-[140px] flex-1 border-none p-2 text-sm outline-none sm:max-w-full ${chips.length >= maxChips ? "bg-gray-200 text-gray-500" : "bg-white"}`}
        />
      </div>
      <p
        className={`mt-2 text-sm ${chips.length >= maxChips ? "text-red-500" : "text-gray-600"}`}
      >
        {chips.length >= maxChips
          ? "Maximum chips reached. Remove a chip to add more."
          : `${chips.length}/${maxChips} skills added.`}
      </p>
    </>
  );
});

export default ChipsInput;
