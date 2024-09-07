import React, { useState } from "react";

const TicketPriceInput = ({
  handlePriceChange,
  fromLocation,
  toLocation,
  inputValue,
}) => {
  const [value, setValue] = useState(inputValue);
  return (
    <input
      type="number"
      class="form-control shadow-none"
      placeholder="Price"
      min={0}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        handlePriceChange(fromLocation, toLocation, e.target.value);
      }}
    />
  );
};

export default TicketPriceInput;
