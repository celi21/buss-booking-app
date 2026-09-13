import React, { useEffect, useState } from "react";

const TicketPriceInput = ({
  handlePriceChange,
  fromLocation,
  toLocation,
  inputValue,
}) => {
  const [value, setValue] = useState(inputValue || "");

  useEffect(() => {
    setValue(inputValue !== undefined && inputValue !== null ? inputValue : "");
  }, [inputValue]);

  return (
    <input
      type="number"
      className="form-control shadow-none"
      placeholder="0.00"
      min={0}
      step="any"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handlePriceChange(fromLocation, toLocation, e.target.value);
      }}
    />
  );
};

export default TicketPriceInput;

