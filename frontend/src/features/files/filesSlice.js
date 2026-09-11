import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../api/axios";

export const uploadFile = createAsyncThunk("files/upload", async ({ file, tags }) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("tags", tags); // comma-separated
  const { data } = await api.post("/api/files/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data.file;
});

export const searchFiles = createAsyncThunk("files/search", async (params) => {
  const { data } = await api.get("/api/files/search", { params });
  return data.files;
});

export const getFileById = createAsyncThunk("files/getById", async (id) => {
  const { data } = await api.get(`/api/files/${id}`);
  return data.file;
});

const filesSlice = createSlice({
  name: "files",
  initialState: { items: [], selected: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(searchFiles.fulfilled, (s, a) => { s.items = a.payload; })
     .addCase(getFileById.fulfilled, (s, a) => { s.selected = a.payload; })
     .addCase(uploadFile.fulfilled, (s, a) => { s.items = [a.payload, ...s.items]; });
  }
});

export default filesSlice.reducer;