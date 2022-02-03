import { createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface FirebaseState {
  list: [];
  params: [];
}

// Define the initial state using that type
const initialState: FirebaseState = {
  list: [],
  params: [],
};

export const counterSlice = createSlice({
  name: 'collection',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    getColl: (state, action) => {
      state.list = action.payload;
    },
    getParams: (state, action) => {
      state.params = action.payload;
    },
  },
});

export const { getColl, getParams } = counterSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectCount = (state: RootState) => state.counter.value

export default counterSlice.reducer;
