import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TableRow {
	[key: string]: string | number | boolean;
}

interface Workflow {
	id: string;
	name: string;
	selectedFileName: string | null;
}

interface WorkflowState {
	workflows: Workflow[];
	currentWorkflowId: string | null;
}

const initialState: WorkflowState = {
	workflows: [],
	currentWorkflowId: null,
};

const workflowSlice = createSlice({
	name: 'workflows',
	initialState,
	reducers: {
		createNewWorkflow: (
			state,
			action: PayloadAction<{ id: string; name: string }>,
		) => {
			const newWorkflow: Workflow = {
				id: action.payload.id,
				name: action.payload.name,
				selectedFileName: null,
			};
			state.workflows.push(newWorkflow);
			state.currentWorkflowId = action.payload.id;
		},
		setCurrentWorkflow: (state, action: PayloadAction<string>) => {
			state.currentWorkflowId = action.payload;
		},
		saveWorkflow: (state) => {
			const currentWorkflow = state.workflows.find(
				(workflow) => workflow.id === state.currentWorkflowId,
			);
			if (currentWorkflow) {
				localStorage.setItem(
					`workflow-${currentWorkflow.id}`,
					JSON.stringify(currentWorkflow),
				);
			}
		},
		loadAllWorkflows: (state) => {
			const allKeys = Object.keys(localStorage);
			state.workflows = allKeys
				.filter((key) => key.startsWith('workflow-'))
				.map(
					(key) =>
						JSON.parse(
							localStorage.getItem(key) || '{}',
						) as Workflow,
				);
		},
		loadWorkflow: (state, action: PayloadAction<string>) => {
			const workflowData = localStorage.getItem(
				`workflow-${action.payload}`,
			);
			if (workflowData) {
				const workflow = JSON.parse(workflowData) as Workflow;
				const existingWorkflowIndex = state.workflows.findIndex(
					(workflow) => workflow.id === action.payload,
				);
				if (existingWorkflowIndex !== -1) {
					state.workflows[existingWorkflowIndex] = workflow;
				} else {
					state.workflows.push(workflow);
				}
				state.currentWorkflowId = action.payload;
			}
		},
		setFileData: (
			state,
			action: PayloadAction<{ fileName: string; data: TableRow[] }>,
		) => {
			const workflow = state.workflows.find(
				(workflow) => workflow.id === state.currentWorkflowId,
			);
			if (workflow) {
				workflow.selectedFileName = action.payload.fileName;
			}
		},
	},
});

export const {
	createNewWorkflow,
	setCurrentWorkflow,
	saveWorkflow,
	loadAllWorkflows,
	loadWorkflow,
	setFileData,
} = workflowSlice.actions;

export default workflowSlice.reducer;
