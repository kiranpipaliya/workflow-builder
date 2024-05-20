import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeData, TableRow } from './workflowSlice';

export interface NodeState {
	nodesData: NodeData[];
	selectedNodeData: {
		nodeId: string;
		type: string;
		position: { x: number; y: number };
		data: TableRow[] | [];
		selectedFile: string | null;
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
		removeNodeData: (state, action: PayloadAction<string>) => {
			const findNodeIndex = state.nodesData.findIndex(
				(n) => n.id === action.payload,
			);
			if (findNodeIndex !== -1) {
				state.nodesData[findNodeIndex] = {
					...state.nodesData[findNodeIndex],
					selectedFile: null,
					data: [],
				};
				if (state.selectedNodeData) {
					state.selectedNodeData.data = [];
					state.selectedNodeData.selectedFile = null;
				}
			}
		},
		loadNodes: (state, action: PayloadAction<string>) => {
			const workflowData = localStorage.getItem(
				`workflow-${action.payload}`,
			);
			if (workflowData) {
				const workflow = JSON.parse(workflowData);
				state.nodesData = workflow.nodesData;
				state.selectedNodeData = workflow.selectedNodeData;
			}
		},
		addNode: (
			state,
			action: PayloadAction<{
				id: string;
				type: string;
				data: TableRow[];
				position: { x: number; y: number };
				selectedFile: string | null;
			}>,
		) => {
			state.nodesData.push({
				id: action.payload.id,
				data: action.payload.data,
				type: action.payload.type,
				position: action.payload.position,
				selectedFile: action.payload.selectedFile,
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
				selectedFile: string | null;
			}>,
		) => {
			state.selectedNodeData = action.payload;
		},
	},
});

export const {
	addNode,
	setNodeData,
	setNodePosition,
	setSelectedNodeData,
	loadNodes,
	removeNodeData,
} = nodeSlice.actions;

export default nodeSlice.reducer;
