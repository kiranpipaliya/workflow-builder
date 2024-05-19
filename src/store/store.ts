import { configureStore } from '@reduxjs/toolkit';

import nodeSlice from './nodeSlice';
import workflowSlice from './workflowSlice';
import edgeSlice from './edgeSlice';

export const store = configureStore({
	reducer: {
		workflows: workflowSlice,
		nodes: nodeSlice,
		edge: edgeSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
