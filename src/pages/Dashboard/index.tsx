import React, { useEffect, useState } from 'react';
import './DashboardStyle.css';
import Button from 'components/Button';
import DynamicInput from 'components/Form/DynamicInput';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { useNavigate } from 'react-router-dom';
import {
	createNewWorkflow,
	loadAllWorkflows,
	saveWorkflow,
	setCurrentWorkflow,
} from 'store/workflowSlice';

const Dashboard = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const workflows = useSelector(
		(state: RootState) => state.workflows.workflows,
	);
	const [newWorkflowName, setNewWorkflowName] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		dispatch(loadAllWorkflows());
	}, []);

	const handleCreateWorkflow = () => {
		const newWorkflowId = `workflow-${Date.now()}`;

		if (!newWorkflowName.trim()) {
			setError('Workflow name cannot be empty.');
			return;
		}

		const isDuplicate = workflows.some(
			(workflow) => workflow.name === newWorkflowName.trim(),
		);

		if (isDuplicate) {
			setError('Workflow name already exists.');
			return;
		}
		setError('');

		dispatch(
			createNewWorkflow({ id: newWorkflowId, name: newWorkflowName }),
		);
		dispatch(saveWorkflow(null));
		dispatch(setCurrentWorkflow(newWorkflowId));
		navigate(`/workflow/${newWorkflowId}`);
		setNewWorkflowName('');
	};

	const handleSelectWorkflow = (workflowId: string) => {
		navigate(`/workflow/${workflowId}`);
		dispatch(setCurrentWorkflow(workflowId));
	};

	return (
		<div className="dashboard-container">
			<div className="header">
				<DynamicInput
					type="text"
					error={error}
					placeholder="New Workflow Name"
					value={newWorkflowName}
					onChange={(e) => setNewWorkflowName(e.target.value)}
				/>
				<Button onClick={handleCreateWorkflow}>
					Create New Workflow
				</Button>
			</div>
			<div>
				<h3>Existing Workflows</h3>
				<ul>
					{workflows.map((workflow) => (
						<li key={workflow.id}>
							<button
								onClick={() =>
									handleSelectWorkflow(workflow.id)
								}
							>
								{workflow.name}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Dashboard;
