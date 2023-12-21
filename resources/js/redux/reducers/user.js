import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'src/helpers/axios';

export const fetchUser = createAsyncThunk(
  'user',
  async () => {
    try {
      const response = await axios.get('/profile');
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    value: null
  },
  reducers: {
    storeUser: (state, action) => {
      state.value = action.payload;
    },
    updateUserFields: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.value = action.payload;
    })
  },
})

export const { storeUser, updateUserFields } = userSlice.actions;
export const selectUser = state => state.user.value;

export default userSlice.reducer;