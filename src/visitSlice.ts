import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Visit {
  id: string;
  customer: string;
  purpose: string;
  notes: string;
  location: string;
  date: string;
  visit_start_time: string;
  visit_end_time: string;
  started_visit_at: string;
  check_in_time: string;
  check_out_time: string;
  meeting_latitude: any;
  meeting_longitude: any;
  status: string;
}

interface VisitState {
  selectedVisit: Visit | null;
}

const initialState: VisitState = {
  selectedVisit: null,
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    setSelectedVisit: (state, action: PayloadAction<Visit>) => {
      state.selectedVisit = action.payload;
    },
    clearSelectedVisit: (state) => {
      state.selectedVisit = null;
    },
  },
});

export const { setSelectedVisit, clearSelectedVisit } = visitSlice.actions;
export default visitSlice.reducer;
