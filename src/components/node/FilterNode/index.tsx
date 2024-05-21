import Button from 'components/Button';
import DynamicInput from 'components/Form/DynamicInput';
import { conditionOptions } from 'constants/conditionConstant';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { removeNode } from 'store/nodeSlice';

const handleStyle = {
	height: '100%',
	borderRadius: '0 10px 10px 0',
	backgroundColor: '#6866ac',
	border: '0',
	width: '25px',
	right: '-24px',
};

const targetStyle = {
	borderRadius: '8px 0px 0px 8px',
	backgroundColor: '#6866ac',
	width: '15px',
	height: '18px',
	border: '0',
	left: '-15px',
};

interface ColumnOption {
	value: string;
	label: string;
}

const FilterNode = ({ data }: any) => {
	const updateNodeInternals = useUpdateNodeInternals();
	const [filterData, setFilterData] = useState({
		column: 'select column',
		condition: 'condition',
		value: 'select Value',
	});
	const [columnsOptions, setColumnsOptions] = useState<ColumnOption[]>([]);
	const [valueOptions, setValueOptions] = useState<ColumnOption[]>([]);

	const dispatch = useDispatch();

	const handleRemoveNode = () => {
		dispatch(removeNode(data.id));
	};

	useEffect(() => {
		if (data?.data?.data?.length > 0) {
			const firstRow = data.data.data[0];
			const columnNames = Object.keys(firstRow);
			const formattedColumns = columnNames.map((column) => ({
				value: column,
				label: column,
			}));
			setColumnsOptions(formattedColumns);
		}
	}, [data]);

	useEffect(() => {
		updateNodeInternals(data.id);
	}, [data, updateNodeInternals]);

	const handleColumnChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = event.target.value;
		setFilterData((prev) => ({
			...prev,
			column: value,
		}));

		const columnValues = data.data.data.map((row: any) => row[value]);
		const uniqueValues = Array.from(new Set(columnValues));
		const formattedValues = uniqueValues.map((val) => ({
			value: val as string,
			label: val as string,
		}));

		setValueOptions(formattedValues);
	};
	const handleConditionChange = (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const value = event.target.value;
		setFilterData((prev) => ({
			...prev,
			condition: value,
		}));
	};

	const handleValueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value;
		setFilterData((prev) => ({
			...prev,
			value: value,
		}));
	};

	const runFilter = () => {};

	return (
		<div className="bg-background border relative w-[200px] border-workflow-color">
			<div className="py-2 px-3 border-b border-border-color flex items-center justify-between">
				Filter <Button onClick={handleRemoveNode}>X</Button>
			</div>
			<div className="py-2 flex flex-col gap-3 px-3 border-b border-border-color">
				<div>
					<DynamicInput
						type="select"
						options={columnsOptions}
						placeholder={filterData.column}
						onChange={handleColumnChange}
					/>
				</div>
				<div>
					<DynamicInput
						type="select"
						options={conditionOptions}
						placeholder={filterData.condition}
						onChange={handleConditionChange}
					/>
				</div>
				<div>
					<DynamicInput
						type="select"
						options={valueOptions}
						placeholder={filterData.value}
						onChange={handleValueChange}
					/>
				</div>

				<Button variant="solid" onClick={runFilter}>
					Run
				</Button>
			</div>
			<Handle
				style={targetStyle}
				type="target"
				position={Position.Left}
				id="a"
			/>
			<Handle
				type="source"
				style={handleStyle}
				position={Position.Right}
				id="b"
			/>
		</div>
	);
};

export default FilterNode;