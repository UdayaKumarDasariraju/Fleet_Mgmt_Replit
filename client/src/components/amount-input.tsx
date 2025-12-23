import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function AmountInput({
  value,
  onChange,
  placeholder = "0.00",
  disabled = false,
}: AmountInputProps) {
  const [inputValue, setInputValue] = useState(
    value ? (value / 100).toFixed(2) : ""
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      // Allow only numbers and one decimal point
      if (input === "" || input === ".") {
        setInputValue(input);
        return;
      }

      // Validate: only digits and decimal
      if (!/^\d*\.?\d*$/.test(input)) {
        return;
      }

      // Limit to 2 decimal places
      const parts = input.split(".");
      if (parts.length > 2) return;
      if (parts[1] && parts[1].length > 2) return;

      setInputValue(input);

      // Update parent only when input is valid
      const numValue = parseFloat(input);
      if (!isNaN(numValue)) {
        onChange(Math.round(numValue * 100));
      }
    },
    [onChange]
  );

  const handleBlur = () => {
    // Format on blur
    if (inputValue === "" || inputValue === ".") {
      setInputValue("");
      onChange(0);
    } else {
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        setInputValue(numValue.toFixed(2));
        onChange(Math.round(numValue * 100));
      }
    }
  };

  return (
    <Input
      type="text"
      inputMode="decimal"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
