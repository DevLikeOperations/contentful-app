import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulComponent.css';


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
    	<div id="textbookContentContainer">
    		{ReactHtmlParser(this.state.textbookContent)}
      	</div>
    );
  }
}

