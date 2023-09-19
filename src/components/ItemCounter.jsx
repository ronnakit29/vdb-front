import React from "react";
import { FaChevronRight } from "react-icons/fa";
const ItemCounter = ({number}) => (
  <div className="flex items-center gap-1 text-default-400">
    <span className="text-small">{number}</span>
    <FaChevronRight/>
  </div>
);

export default ItemCounter;