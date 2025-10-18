import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IdState {
  expenseId: string | null;
  leaveId: string | null;
}

const initialState: IdState = {
  expenseId: null,
  leaveId: null,
};

const idSlice = createSlice({
  name: "ids",
  initialState,
  reducers: {
    setExpenseId: (state, action: PayloadAction<string | null>) => {
      state.expenseId = action.payload;
    },
    setLeaveId: (state, action: PayloadAction<string | null>) => {
      state.leaveId = action.payload;
    },
    clearIds: (state) => {
      state.expenseId = null;
      state.leaveId = null;
    },
  },
});

export const { setExpenseId, setLeaveId, clearIds } = idSlice.actions;
export default idSlice.reducer;
