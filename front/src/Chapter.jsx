import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulComponent.css';


export default class Chapter extends Component {

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
    	<div id="textbookContentContainer">
    		{ReactHtmlParser(this.state.textbookContent)}
      	</div>
    );
  }
}

