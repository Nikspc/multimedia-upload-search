import React, { useMemo, useState } from "react";

export default function SearchPanel({ onSearch }) {
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("relevance");

  const params = useMemo(() => ({
    query: query || undefined,
    tags: tags || undefined,
    name: name || undefined,
    type: type || undefined,
    sort
  }), [query, tags, name, type, sort]);

  return (
    <div className="searchCard">
      <div className="searchCard__titleRow">
        <h2>Search</h2>
        <button
          className="btn btn--ghost"
          onClick={() => {
            setQuery(""); setTags(""); setName(""); setType(""); setSort("relevance");
            onSearch({ sort: "newest" });
          }}
        >
          Clear
        </button>
      </div>

      <div className="searchCard__grid">
        <div>
          <label className="label">Keyword (name or tags)</label>
          <input
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. invoice, meeting, demo..."
          />
        </div>

        <div>
          <label className="label">Tags (comma separated)</label>
          <input
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. invoice,2025,pdf"
          />
        </div>

        <div>
          <label className="label">File name contains</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. IMG_1023"
          />
        </div>

        <div>
          <label className="label">Type</label>
          <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All</option>
            <option value="image">Images</option>
            <option value="video">Video/Audio</option>
            <option value="raw">PDF/Raw</option>
          </select>
        </div>

        <div>
          <label className="label">Sort</label>
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="views">Most viewed</option>
          </select>
        </div>

        <div className="searchCard__actions">
          <button className="btn" onClick={() => onSearch(params)}>Search</button>
        </div>
      </div>
    </div>
  );
}