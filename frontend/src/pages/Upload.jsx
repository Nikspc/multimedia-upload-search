import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "../features/files/filesSlice";

export default function Upload() {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    await dispatch(uploadFile({ file, tags }));
    setFile(null);
    setTags("");
    alert("Uploaded");
  };

  return (
    <div>
      <h2>Upload</h2>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tags: invoice,2025,pdf"
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}