import React from 'react';
import './SidePanelStyle.css';
import Button from 'components/Button';
import { useDispatch } from 'react-redux';
import { addNode } from 'store/nodeSlice';

const SidePanel = () => {
	const dispatch = useDispatch();

	const handleAddNode = () => {
		const newNodeId = `node-${Date.now()}`;
		dispatch(
			addNode({
				id: newNodeId,
				type: 'FileNode',
				data: [],
				position: { x: 100, y: 100 },
			}),
		);
	};
	return (
		<aside className="side-panel">
			<div className="flex flex-col gap-5">
				<h4>Input</h4>
				<Button onClick={handleAddNode}>Add File Node</Button>
			</div>
		</aside>
	);
};

export default SidePanel;
