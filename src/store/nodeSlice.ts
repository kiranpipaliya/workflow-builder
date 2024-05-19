import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
	[key: string]: string | number | boolean;
}

interface NodeData {
	id: string;
	data: TableRow[];
	type: string;
	position: { x: number; y: number };
}

interface NodeState {
	nodesData: NodeData[];
	selectedNodeData: {
		nodeId: string;
		type: string;
		position: { x: number; y: number };
		data: TableRow[];
	} | null;
}

const initialState: NodeState = {
	nodesData: [],
	selectedNodeData: null,
};

const nodeSlice = createSlice({
	name: 'nodes',
	initialState,
	reducers: {
		addNode: (
			state,
			action: PayloadAction<{
				id: string;
				type: string;
				data: TableRow[];
				position: { x: number; y: number };
			}>,
		) => {
			state.nodesData.push({
				id: action.payload.id,
				data: action.payload.data,
				type: action.payload.type,
				position: action.payload.position,
			});
		},
		setNodeData: (state, action: PayloadAction<NodeData>) => {
			const existingNodeIndex = state.nodesData.findIndex(
				(node) => node.id === action.payload.id,
			);
			if (existingNodeIndex !== -1) {
				state.nodesData[existingNodeIndex] = action.payload;
			} else {
				state.nodesData.push(action.payload);
			}
		},
		setNodePosition: (
			state,
			action: PayloadAction<{
				id: string;
				position: { x: number; y: number };
			}>,
		) => {
			const node = state.nodesData.find(
				(node) => node.id === action.payload.id,
			);
			if (node) {
				node.position = action.payload.position;
			}
		},
		setSelectedNodeData: (
			state,
			action: PayloadAction<{
				nodeId: string;
				type: string;
				data: TableRow[];
				position: { x: number; y: number };
			}>,
		) => {
			state.selectedNodeData = { ...action.payload };
		},
	},
});

export const { addNode, setNodeData, setNodePosition, setSelectedNodeData } =
	nodeSlice.actions;

export default nodeSlice.reducer;
