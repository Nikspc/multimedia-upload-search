import React from "react";
import { Link } from "react-router-dom";

export default function FileCard({ file }) {
  if (!file) return null;

  return (
    <div className="card">
      <div><b>{file.originalName}</b></div>
      <div>Type: {file.resourceType} ({file.mimeType})</div>
      <div>Views: {file.viewCount}</div>
      <div>Tags: {(file.tags || []).join(", ")}</div>
      <Link to={`/files/${file._id}`}>Open</Link>
    </div>
  );
}