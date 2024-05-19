import React, { ChangeEvent } from 'react';
import { parse } from 'csv-parse/browser/esm/sync';
import { useDispatch, useSelector } from 'react-redux';
import DynamicInput from './DynamicInput';
import { RootState } from 'store/store';
import { setFileData, saveWorkflow } from 'store/workflowSlice';
import { setNodeData, setSelectedNodeData } from 'store/nodeSlice';
import Button from 'components/Button';

const CsvFileSelectInput = ({ nodeId }: { nodeId?: string }) => {
	const dispatch = useDispatch();
	const currentWorkflow = useSelector((state: RootState) =>
		state.workflows.workflows.find(
			(workflow) => workflow.id === state.workflows.currentWorkflowId,
		),
	);
	const selectedNode = useSelector(
		(state: RootState) => state.nodes.selectedNodeData,
	);

	const handleRemoveFile = () => {
		dispatch(setFileData({ fileName: '', data: [] }));
	};

	const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const text = e.target?.result as string;
				const records = parse(text, {
					columns: true,
					skip_empty_lines: true,
				});
				dispatch(setFileData({ fileName: file.name, data: records }));
				if (selectedNode) {
					dispatch(
						setNodeData({
							id: selectedNode.nodeId,
							type: selectedNode.type,
							data: records,
							position: selectedNode.position,
						}),
					);
					dispatch(
						setSelectedNodeData({
							nodeId: selectedNode.nodeId,
							type: selectedNode.type,
							data: records,
							position: selectedNode.position,
						}),
					);
				}
				dispatch(saveWorkflow());
			};
			reader.readAsText(file);
		}
	};

	return (
		<div>
			{!currentWorkflow?.selectedFileName && (
				<DynamicInput
					type="file"
					accept=".csv"
					label="Add CSV File"
					onChange={handleFileUpload}
					disabled={!!currentWorkflow?.selectedFileName}
				/>
			)}
			{currentWorkflow?.selectedFileName && (
				<span className="my-4 flex items-center gap-4">
					{currentWorkflow.selectedFileName}
					<Button onClick={handleRemoveFile}>X</Button>
				</span>
			)}
		</div>
	);
};

export default CsvFileSelectInput;
