import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFileById } from "../features/files/filesSlice";
import FilePreview from "../components/FilePreview";

export default function FileDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const file = useSelector(s => s.files.selected);

  useEffect(() => { dispatch(getFileById(id)); }, [dispatch, id]);

  return (
    <div>
      <h2>File</h2>
      {file && (
        <>
          <div><b>{file.originalName}</b></div>
          <div>Views: {file.viewCount}</div>
          <FilePreview file={file} />
        </>
      )}
    </div>
  );
}