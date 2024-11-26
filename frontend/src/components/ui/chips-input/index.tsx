import { ChangeEventHandler, forwardRef, useState } from "react";

const defaultArr: string[] = [];
const ChipsInput = forwardRef(({ chips = defaultArr, setChips }, ref) => {
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
                .filter((chip) => chip && !chips.includes(chip)); // Prevent duplicates

            setChips((prevChips) =>
                [...prevChips, ...trimmedChips].slice(0, maxChips)
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
            <div tabIndex={-1} className="flex flex-wrap items-center border p-3 rounded-lg focus-visible:border-2  focus-within:border-2" ref={ref} >
                {chips.map((chip, index) => {
                    return (
                        <div
                            key={index}
                            className="flex items-center bg-black text-white text-sm font-medium rounded-full px-4 py-2 m-1"
                        >
                            {chip}
                            <button
                                onClick={() => handleDeleteChip(chip)}
                                aria-label={`Delete ${chip}`}
                                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                            >
                                &times;
                            </button>
                        </div>
                    );
                })}
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type here ..."
                    disabled={chips.length >= maxChips}
                    className={`flex-1 max-w-[140px] sm:max-w-full border-none outline-none p-2 text-sm
                        ${chips.length >= maxChips ? "bg-gray-200 text-gray-500" : "bg-white"}
                        `}
                    onFocus={() => { ref.current.focus() }}
                />
            </div>
            <p className={`text-sm mt-2 ${chips.length >= maxChips ? "text-red-500" : "text-gray-600"}`}>
                {chips.length >= maxChips
                    ? "Maximum chips reached. Remove a chip to add more."
                    : `${chips.length}/${maxChips} skills added.`}
            </p>
        </>
    );
});

export default ChipsInput;
