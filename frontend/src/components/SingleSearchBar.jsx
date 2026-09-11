import React, { useEffect, useState } from "react";

export default function SingleSearchBar({
  onSearch,
  placeholder = "Search by filename or tags...",
  filters // optional: { type, sort }
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      const q = value.trim();

      // Preserve old behavior if sort not provided:
      const computedSort =
        filters?.sort ?? (q ? "relevance" : "newest");

      onSearch({
        query: q || "",
        sort: computedSort,
        type: filters?.type || undefined
      });
    }, 350);

    return () => clearTimeout(t);
  }, [value, filters?.type, filters?.sort, onSearch]);

  return (
    <div className="singleSearch">
      <input
        className="singleSearch__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />

      {value.trim() ? (
        <button
          type="button"
          className="singleSearch__clear"
          onClick={() => setValue("")}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}