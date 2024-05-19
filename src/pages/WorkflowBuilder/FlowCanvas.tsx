import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
	Background,
	Controls,
	addEdge,
	useEdgesState,
	useNodesState,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import { setNodePosition, setSelectedNodeData } from 'store/nodeSlice';
import { setEdgesData } from 'store/edgeSlice';
import FileNode from 'components/node/FileNode';
import 'reactflow/dist/style.css';

const FlowCanvas = () => {
	const dispatch = useDispatch();
	const currentWorkflow = useSelector((state: RootState) =>
		state.workflows.workflows.find(
			(workflow) => workflow.id === state.workflows.currentWorkflowId,
		),
	);
	const nodesData = useSelector((state: RootState) => state.nodes.nodesData);
	const edgesData = useSelector((state: RootState) => state.edge.edgesData);

	const nodeTypes = useMemo(() => ({ FileNode: FileNode }), []);

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);

	useEffect(() => {
		if (currentWorkflow) {
			const workflowNodes = nodesData.map((nodeData, index) => ({
				id: nodeData.id,
				type: nodeData.type,
				data: {
					label: `Node ${index + 1}`,
					id: nodeData.id,
					data: nodeData.data,
				},
				position: nodeData.position,
			}));
			setNodes(workflowNodes);
			setEdges(edgesData);
		}
	}, [currentWorkflow, nodesData, edgesData, setNodes, setEdges]);

	const onConnect = useCallback(
		(params: any) => {
			setEdges((eds) => {
				const newEdges = addEdge(params, eds);
				dispatch(setEdgesData(newEdges));
				return newEdges;
			});
		},
		[dispatch, setEdges],
	);

	const handleNodeClick = useCallback(
		(event: any, node: any) => {
			const nodeData =
				nodesData.find((n) => n.id === node.id)?.data || [];

			dispatch(
				setSelectedNodeData({
					nodeId: node.id,
					type: node.type,
					data: nodeData,
					position: node.position,
				}),
			);
		},
		[nodesData, dispatch],
	);

	const onNodesChangeCapture = useCallback(
		(changes: any) => {
			changes.forEach((change: any) => {
				if (change.type === 'position' && change.position) {
					dispatch(
						setNodePosition({
							id: change.id,
							position: change.position,
						}),
					);
				}
			});
			onNodesChange(changes);
		},
		[dispatch, onNodesChange],
	);

	return (
		<div className="w-full h-full">
			<ReactFlow
				nodeTypes={nodeTypes}
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChangeCapture}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				onNodeClick={handleNodeClick}
			>
				<Background />
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default FlowCanvas;
