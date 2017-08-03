import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulContent.css';


export default class CommunityNewsletter extends Component {

	state ={
		newsletterContent : ''
	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/community/${entry}`).then(res => {
					const data = res.data;
					this.setState({newsletterContent:data.body});
				}).catch(e =>{
					console.log(e);	
		});
	}

  render() {
    return (
    	<div id="textbookContentContainer">
    		{ReactHtmlParser(this.state.newsletterContent)}
      	</div>
    );
  }
}

