import React, { Component } from 'react';
import axios from 'axios';
import Search from "./Search";
import Table from "./Table";
import './App.css';
import Button from "./Button";

// API query request
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP='hitsPerPage=';


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			results: null,
			searchKey: '',
			searchTerm: DEFAULT_QUERY,
			error: null,
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
		const {searchKey, results} = this.state;

		const oldHits = results && results[searchKey] 
			? results[searchKey].hits
			: [];
		
		const updatedHits = [
			...oldHits,
			...hits,
		];
		this.setState({
			results: {
				...results,
				[searchKey]: {hits: updatedHits, page}
			}
		});
	}

	componentDidMount() {
		const {searchTerm} = this.state;
		this.setState({searchKey: searchTerm});
		this.fetchSearchTopStories(searchTerm);
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
		console.log("Making API request...");
		axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
			.then(result => this.setSearchTopStories(result.data))
			.catch(error => this.setState({error}));
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
					<Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
						More
					</Button>
				</div>
			</div>
		);
	}
}

export default App;
