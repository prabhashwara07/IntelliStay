import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentQuery: ''
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.currentQuery = action.payload;
    },
    
    clearSearchQuery: (state) => {
      state.currentQuery = '';
    }
  }
});

// Export actions
export const {
  setSearchQuery,
  clearSearchQuery
} = searchSlice.actions;

// Export selectors
export const selectCurrentQuery = (state) => state.search.currentQuery;

// Export reducer
export default searchSlice.reducer;