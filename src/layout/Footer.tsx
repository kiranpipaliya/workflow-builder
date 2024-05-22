import React from 'react';
import './FooterStyle.css';
import Table from 'components/Table';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';
import Button from 'components/Button';
import { convertToCSV } from 'utils/convertToCSV';
import { saveAs } from 'file-saver';

const Footer: React.FC = () => {
	const selectedNodeData = useSelector(
		(state: RootState) => state.nodes.selectedNodeData,
	);

	const exportCSV = () => {
		if (selectedNodeData?.data) {
			const csvData = convertToCSV(selectedNodeData.data);
			const blob = new Blob([csvData], {
				type: 'text/csv;charset=utf-8;',
			});
			saveAs(blob, 'node_data.csv');
		}
	};

	return (
		<footer className="output-footer">
			<div className="footer-header">
				<h4>OUTPUT</h4>
				{!!selectedNodeData?.data?.length && (
					<Button onClick={exportCSV} variant="outlet">
						Export CSV
					</Button>
				)}
			</div>
			<div className="footer-body">
				{selectedNodeData?.data && (
					<Table data={selectedNodeData.data} />
				)}
			</div>
		</footer>
	);
};

export default Footer;
