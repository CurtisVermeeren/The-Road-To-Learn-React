import React, { Component } from 'react';
import axios from 'axios';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Search from "./Search";
import Table from "./Table";
import Button from "./Button";
import Loading from "./Loading";

import './App.css';

Enzyme.configure({adapter: new Adapter()});

// API query request
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP='hitsPerPage=';

const withLoading = (Component) => ({isLoading, ...rest}) => 
	isLoading ? <Loading /> : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
	const { searchKey, results } = prevState;
	const oldHits = results && results[searchKey]
		? results[searchKey].hits
		: [];
	const updatedHits = [
		...oldHits,
		...hits
	];
	return {
		results: {
			...results,
			[searchKey]: { hits: updatedHits, page }
		},
		isLoading: false
	};
};

class App extends Component {
	_isMounted = false;

	constructor(props) {
		super(props);

		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
			isLoading: false,
		};

		this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
		this.setSearchTopStories = this.setSearchTopStories.bind(this);
		this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onSearchSubmit = this.onSearchSubmit.bind(this);
		this.onDismiss = this.onDismiss.bind(this);
	}

	needsToSearchTopStories(searchTerm) {
		return !this.state.results[searchTerm];
	}

	// Update the result value
	setSearchTopStories(result) {
		const {hits, page} = result;
		this.setState(updateSearchTopStoriesState(hits, page));
	}

	componentDidMount() {
		this._isMounted = true;

		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		this.fetchSearchTopStories(searchTerm);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}


	onSearchSubmit(event) {
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		if (this.needsToSearchTopStories(searchTerm)) {
			this.fetchSearchTopStories(searchTerm);
		}
		event.preventDefault();
	}

	// Make a request to the api with search term and page number
	fetchSearchTopStories(searchTerm, page = 0) {
		this.setState({isLoading: true});
		axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(result => this._isMounted && this.setSearchTopStories(result.data))
			.catch(error => this._isMounted && this.setState({ error }));
	}

	// Update the state with search value
	onSearchChange(event) {
		this.setState({searchTerm: event.target.value});
	}

	// Filter id from the list
	onDismiss(id) {
		const {searchKey, results} = this.state;
		const {hits, page} = results[searchKey];
		const isNotId = (item) => item.objectID !== id;
		const updatedHits = hits.filter(isNotId);
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			}
		});
	}	

	render() {
		const {
			searchTerm,
			results,
			searchKey,
			error,
			isLoading,
		} = this.state;

		const page = (
			results && results[searchKey] && results[searchKey].page
		) || 0;

		const list = (
			results && results[searchKey] && results[searchKey].hits 
		) || [];

		const helloWorld = "Welcome to the Road to Learn React";

		return (
			<div className="page">
				<div className="interactions">
					<h2>{helloWorld}</h2>
					<Search 
						value={searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}
					>
					Search by title
					</Search>
				</div>
				{ error ? 
					<div className="interactions">
						<p>Something went wrong!</p>
					</div>
				: <Table 
					list={list}
					onDismiss={this.onDismiss}
				/>
				}
				<div className="interactions">
					<ButtonWithLoading
						isLoading={isLoading}
						onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
						More
					</ButtonWithLoading>
				</div>
			</div>
		);
	}
}

export default App;
