import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './ContentfulContent.css';


export default class CommunityNewsletter extends Component {

	state ={
		newsletterContent : '',
		title:''
	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/community/${entry}`).then(res => {
					const data = res.data;
					this.setState({newsletterContent:data.body});
					this.setState({articleContent:data.body,
									title:data.title});
				}).catch(e =>{
					console.log(e);	
		});
	}

  render() {
    return (
    	<div id="textbookContentContainer">
    		<div>
				<h1 className="header">{this.state.title}</h1>
    		</div>    		
    		{ReactHtmlParser(this.state.newsletterContent)}
      	</div>
    );
  }
}

