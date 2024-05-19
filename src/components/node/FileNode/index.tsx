import CsvFileSelectInput from 'components/Form/CsvFileSelectInput';
import { Handle, Position } from 'reactflow';

const handleStyle = {
	height: '100%',
	borderRadius: '0 10px 10px 0',
	backgroundColor: '#6866ac',
	border: '0',
	width: '25px',
	right: '-24px',
};

const FileNode = ({ data }: any) => {
	return (
		<div className="bg-background border border-workflow-color">
			<div className="py-2 px-3 border-b border-border-color">File</div>
			<div className="py-2 px-3 border-b border-border-color">
				<CsvFileSelectInput nodeId={data.id} />
			</div>
			<Handle
				type="source"
				style={handleStyle}
				position={Position.Right}
				id="a"
			/>
		</div>
	);
};

export default FileNode;
