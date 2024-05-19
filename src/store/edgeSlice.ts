import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EdgeData {
	id: string;
	source: string;
	target: string;
	animated?: boolean;
}

interface EdgeState {
	edgesData: EdgeData[];
}

const initialState: EdgeState = {
	edgesData: [],
};

const edgeSlice = createSlice({
	name: 'edges',
	initialState,
	reducers: {
		setEdgesData: (state, action: PayloadAction<EdgeData[]>) => {
			state.edgesData = action.payload;
		},
	},
});

export const { setEdgesData } = edgeSlice.actions;

export default edgeSlice.reducer;
