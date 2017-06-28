import React, { Component } from 'react';
import axios from 'axios';
//import renderHTML from 'react-render-html';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulComponent.css';

export default class ContentfulComponent extends Component {
	state ={
		textbookContent : ''
	}

	componentDidMount(){		
		const entry = window.location.pathname.slice(1);
		axios.get(`/api/${entry}`).then(res => {
					const data = res.data;
					this.setState({textbookContent:data});
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

