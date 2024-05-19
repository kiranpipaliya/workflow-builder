import React from 'react';
import './FooterStyle.css';
import Table from 'components/Table';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

const Footer: React.FC = () => {
	const selectedNodeData = useSelector(
		(state: RootState) => state.nodes.selectedNodeData,
	);

	return (
		<footer className="output-footer">
			<div className="footer-header">
				<h4>OUTPUT</h4>
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
