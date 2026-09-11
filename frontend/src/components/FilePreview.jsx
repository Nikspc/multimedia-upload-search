import React from "react";

export default function FilePreview({ file }) {
  if (!file) return null;

  const { secureUrl, mimeType, originalName } = file;

  if (mimeType.startsWith("image/")) {
    return <img src={secureUrl} alt={originalName} style={{ maxWidth: "100%" }} />;
  }
  if (mimeType.startsWith("video/")) {
    return <video src={secureUrl} controls style={{ width: "100%" }} />;
  }
  if (mimeType.startsWith("audio/")) {
    return <audio src={secureUrl} controls style={{ width: "100%" }} />;
  }
  if (mimeType === "application/pdf") {
    return <iframe title={originalName} src={secureUrl} style={{ width: "100%", height: 600 }} />;
  }
  return <a href={secureUrl} target="_blank" rel="noreferrer">Open file</a>;
}