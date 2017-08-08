import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulContent.css';


export default class FullTextbook extends Component {

	state ={
		textbookContent : ''
	}

	componentWillMount(){	
		//Get all chapters
		axios.get('/api/textbook').then(res => {
				const textbookContent = res.data.join('<br>');
				this.setState({textbookContent});
			}).catch(e =>{
				console.log(e);	
			});
	}

  	render() {
	    return (
	    	<div className="textbook contentfulContainer">
	    		<div>
					<h1 id="textbookHeader"> The Crisis Text Line Textbook </h1>
	    		</div>
		    	<div>
		    		{ReactHtmlParser(this.state.textbookContent)}
		      	</div>
	      	</div>
	    );
  }
}

