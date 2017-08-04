import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulContent.css';


export default class CommunityArticle extends Component {

	state ={
		articleContent : '',
		title:''

	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/community/${entry}`).then(res => {
					const data = res.data;
					this.setState({articleContent:data.body,
									title:data.title});
				}).catch(e =>{
					console.log(e);	
				});
	}

  render() {
    return (
    	<div id="textbookContentContainer">	
    		{ReactHtmlParser(this.state.articleContent)}
      	</div>
    );
  }
}

