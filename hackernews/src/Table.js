import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';
import Sort from "./Sort";
import { sortBy } from 'lodash';

// Sorting data
const SORTS = {
	NONE: list => list,
	TITLE: list => sortBy(list, 'title'),
	AUTHOR: list => sortBy(list, 'author'),
	COMMENTS: list => sortBy(list, 'num_comments').reverse(),
	POINTS: list => sortBy(list, 'points').reverse(),
};

// Table Component
const Table = ({ list, sortKey, isSortReverse, onSort, onDismiss }) => {
	const sortedList = SORTS[sortKey](list);
	const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;

	return (
		<div className="table">
			<div className="table-header">
				<span style={{ width: '40%' }}>
					<Sort
						sortKey={'TITLE'}
						onSort={onSort}
						activeSortKey={sortKey}
					>
						Title
					</Sort>
				</span>
				<span style={{ width: '30%' }}>
					<Sort
						sortKey={'AUTHOR'}
						onSort={onSort}
						activeSortKey={sortKey}
					>
						Author
					</Sort>
				</span>
				<span style={{ width: '10%' }}>
					<Sort
						sortKey={'COMMENTS'}
						onSort={onSort}
						activeSortKey={sortKey}
					>
						Comments
					</Sort>
				</span>
				<span style={{ width: '10%' }}>
					<Sort
						sortKey={'POINTS'}
						onSort={onSort}
						activeSortKey={sortKey}
					>
						Points
					</Sort>
				</span>
				<span style={{ width: '10%' }}>
				</span>
			</div>
			{reverseSortedList.map(item =>
			<div key={item.objectID} className="table-row">
				<span style={{ width: '40%' }}>
				<a href={item.url}>{item.title}</a>
				</span>
				<span style={{ width: '30%' }}>
				{item.author}
				</span>
				<span style={{ width: '10%' }}>
				{item.num_comments}
				</span>
				<span style={{ width: '10%' }}>
				{item.points}
				</span>
				<span style={{ width: '10%' }}>
				<Button
					onClick={() => onDismiss(item.objectID)}
					className="button-inline"
				>
					Dismiss
				</Button>
				</span>
			</div>
			)}
		</div>
	)
}

Table.propTypes = {
	list: PropTypes.array.isRequired,
	onDismiss: PropTypes.func.isRequired,
};

export default Table;

