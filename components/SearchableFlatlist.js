import Fuse from 'fuse.js';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FlatList } from 'react-native';


export default class SearchableFlatlist extends Component{
	static INCLUDES = "includes";
	static WORDS = "words";
	
	getFilteredResults(){
		let { data, type, searchProperty, searchTerm } = this.props;
		
		const useNotTerriblyUselessSearch = true;
		
		if( useNotTerriblyUselessSearch ){
			// TODO: the type should be respected here and apply the probably existing related config thing, not needed for the current purposes though
			const options = {
				includeScore: true,
				useExtendedSearch: true,
				threshold: .45,
				distance: 80,
				// findAllMatches: true,
				keys: [searchProperty],
			};
			
			const fuse = new Fuse( data, options );
			const result = fuse.search( searchTerm );
			
			return result.map( r => r.item );
		}
		
		return data.filter(
			item =>
				type && type === SearchableFlatlist.WORDS
				? new RegExp( `\\b${ searchTerm }`, "gi" ).test( item[searchProperty] )
				: new RegExp( `${ searchTerm }`, "gi" ).test( item[searchProperty] ),
		);
	}
	
	render(){
		return <FlatList { ...this.props } data={ this.getFilteredResults() } />;
	}
}

SearchableFlatlist.propTypes = {
	data: PropTypes.array.isRequired,
	searchProperty: PropTypes.string.isRequired,
	searchTerm: PropTypes.string.isRequired,
	type: PropTypes.string,
};
