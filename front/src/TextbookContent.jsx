import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulContent.css';


export default class TextbookContent extends Component {

	state ={
		textbookContent : ''
	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/${entry}`).then(res => {
					const data = res.data;
					this.setState({textbookContent:data});
				}).catch(e =>{
					console.log(e);	
				});
	}

  render() {
    return (
    	<div className="textbook contentfulContainer">
    		{ReactHtmlParser(this.state.textbookContent)}
      	</div>
    );
  }
}

