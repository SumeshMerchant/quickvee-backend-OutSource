import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  BASE_URL,
  GET_REORDER_INVENTORY_LIST,
} from "../../../../Constants/Config";

const initialState = {
  loading: false,
  ReorderData: [],
  status:false,
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchReorderInventoryData = createAsyncThunk(
  "ReorderInventoryList/fetchReorderInventoryData.",
  async (data, { rejectWithValue }) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(
        BASE_URL + GET_REORDER_INVENTORY_LIST,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.status === true) {
        // console.log(response);
        const arr = response.data.reorder_array;
        const status = response.data.status
        return {arr, status};
      }else if ( response.data.status === false ) {
        const arr = [];
        const status = false;
        return {arr, status};
      }
    } catch (error) {
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);

const ReorderInventorySlice = createSlice({
  name: "ReorderInventoryList",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchReorderInventoryData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReorderInventoryData.fulfilled, (state, action) => {
      state.loading = false;
      state.ReorderData = action.payload.arr;
      state.status= action.payload.status;
      state.error = "";
    });
    builder.addCase(fetchReorderInventoryData.rejected, (state, action) => {
      state.loading = false;
      state.ReorderData = [];
      state.error = action.error.message;
    });
  },
});

export default ReorderInventorySlice.reducer;
