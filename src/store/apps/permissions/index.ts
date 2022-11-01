// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ** Axios Imports
import axios from 'axios';

// ** Config
import apiConfig from 'src/configs/api';

// 통신 성공 시 가져오게 될 데이터 타입
interface DataParams {
  q: string;
}

export let data: [];

// 비동기 통신 구현
export const fetchData = createAsyncThunk(
  'appPermissions/fetchData',
  async (params: DataParams) => {
    await axios
      .get(`${apiConfig.apiEndpoint}/permission`, {
        params,
      })
      .then((res) => {
        data = res.data;
      })
      .catch((Error) => {
        console.log('Error', Error);
      });

    return data;
  },
);

export const appPermissionsSlice = createSlice({
  name: 'appPermissions',
  initialState: {
    data: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default appPermissionsSlice.reducer;
