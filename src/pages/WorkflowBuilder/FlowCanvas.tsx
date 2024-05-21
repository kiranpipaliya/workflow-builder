import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
	Background,
	Controls,
	addEdge,
	useEdgesState,
	useNodesState,
	Connection,
} from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/store';
import {
	loadNodes,
	setNodePosition,
	setSelectedNodeData,
	setNodeData,
} from 'store/nodeSlice';
import { loadEdges, setEdgesData } from 'store/edgeSlice';
import FileNode from 'components/Node/FileNode';
import FilterNode from 'components/Node/FilterNode';
import 'reactflow/dist/style.css';
import { TableRow } from 'store/workflowSlice';

const FlowCanvas = () => {
	const dispatch = useDispatch();
	const currentWorkflow = useSelector((state: RootState) =>
		state.workflows.workflows.find(
			(workflow) => workflow.id === state.workflows.currentWorkflowId,
		),
	);
	const nodesData = useSelector((state: RootState) => state.nodes.nodesData);
	const edgesData = useSelector((state: RootState) => state.edges.edgesData);

	const nodeTypes = useMemo(() => ({ FileNode, FilterNode }), []);

	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const reactFlowWrapper = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (currentWorkflow) {
			dispatch(loadNodes(currentWorkflow.id));
			dispatch(loadEdges(currentWorkflow.id));
		}
	}, [currentWorkflow?.id, dispatch]);

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
		(params: Connection) => {
			setEdges((eds) => {
				const newEdges = addEdge({ ...params, animated: true }, eds);

				const sourceNode = nodes.find(
					(node) => node.id === params.source,
				);
				const targetNode = nodes.find(
					(node) => node.id === params.target,
				);
				if (sourceNode && targetNode) {
					dispatch(
						setNodeData({
							id: targetNode.id,
							type: targetNode?.type,
							data: sourceNode.data,
							position: targetNode.position,
							selectedFile: null,
						}),
					);
				}

				dispatch(setEdgesData(newEdges));
				return newEdges;
			});
		},
		[dispatch, nodes, setEdges],
	);

	const handleNodeClick = useCallback(
		(event: any, node: any) => {
			const nodeData =
				nodesData.find((n) => n.id === node.id)?.data || [];
			const data =
				'data' in nodeData ? (nodeData.data as TableRow[]) : nodeData;
			dispatch(
				setSelectedNodeData({
					nodeId: node.id,
					type: node.type,
					data,
					position: node.position,
					selectedFile: null,
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

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				reactFlowWrapper.current &&
				!reactFlowWrapper.current.contains(target as Node) &&
				!target.closest('.custom-table')
			) {
				dispatch(setSelectedNodeData(null));
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dispatch]);

	return (
		<div className="w-full h-full">
			<ReactFlow
				ref={reactFlowWrapper}
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
