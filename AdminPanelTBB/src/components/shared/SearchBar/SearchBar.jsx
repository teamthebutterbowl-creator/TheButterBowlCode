import React from "react";
import { Search } from "lucide-react";
import "./SearchBar.css";

const SearchBar = ({ placeholder = "Search", value, onChange }) => {
  return (
    <div className="search-bar">
      <Search className="search-icon" size={18} />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchBar;