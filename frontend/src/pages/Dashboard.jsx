import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchFiles } from "../features/files/filesSlice";
import FileCard from "../components/FileCard";
import SingleSearchBar from "../components/SingleSearchBar";

export default function Dashboard() {
  const dispatch = useDispatch();
  const files = useSelector((s) => s.files.items);

  const [type, setType] = useState("");          // "" | image | video | raw
  const [sort, setSort] = useState("relevance"); // relevance | newest | views

  useEffect(() => {
    // initial load
    dispatch(searchFiles({ query: "", sort: "newest" }));
  }, [dispatch]);

  const onSearch = useCallback((params) => {
    dispatch(searchFiles(params));
  }, [dispatch]);

  return (
    <div>
      <h2>Search</h2>

      {/* Filters row */}
      <div className="searchFilters">
        <div className="searchFilters__field">
          <label className="label">Type</label>
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            <option value="image">Image</option>
            <option value="video">Video/Audio</option>
            <option value="raw">PDF/Raw</option>
          </select>
        </div>

        <div className="searchFilters__field">
          <label className="label">Sort</label>
          <select
            className="select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="views">Most viewed</option>
          </select>
        </div>
      </div>

      {/* Single search bar (filename + tags only) */}
      <SingleSearchBar
        onSearch={onSearch}
        filters={{ type, sort }}
      />

      <div className="resultsBar">
        <div className="resultsBar__count">{files.length} result(s)</div>
      </div>

      <div className="grid">
        {files.map((f) => (
          <FileCard key={f._id} file={f} />
        ))}
      </div>

      {files.length === 0 && (
        <div className="emptyState">
          No matching files. Try searching with a tag or part of the filename.
        </div>
      )}
    </div>
  );
}