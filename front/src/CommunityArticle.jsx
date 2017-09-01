import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './css/ContentfulContent.css';


export default class CommunityArticle extends Component {

	state = {
		articleContent : '',
	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/community/${entry}`).then(res => {
					const data = res.data;
					this.setState({articleContent:data.body});
				}).catch(e =>{
					console.log(e);	
				});
	}

  render() {
    return (
    	<div className="community contentfulContainer">
    	    <div>	
    		  {ReactHtmlParser(this.state.articleContent)}
    		</div>
    	</div>
    );
  }
}

