import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Researcher } from '../../types';

interface MatchingState {
  matches: Researcher[];
  currentMatch: Researcher | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  matches: [],
  currentMatch: null,
  isLoading: false,
  error: null,
};

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    setMatches: (state, action: PayloadAction<Researcher[]>) => {
      state.matches = action.payload;
    },
    setCurrentMatch: (state, action: PayloadAction<Researcher | null>) => {
      state.currentMatch = action.payload;
    },
    addMatch: (state, action: PayloadAction<Researcher>) => {
      state.matches.push(action.payload);
    },
    removeMatch: (state, action: PayloadAction<string>) => {
      state.matches = state.matches.filter(match => match.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setMatches, setCurrentMatch, addMatch, removeMatch, setLoading, setError } = matchingSlice.actions;
export default matchingSlice.reducer;