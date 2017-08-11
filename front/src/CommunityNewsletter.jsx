import React, { Component } from 'react';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import './css/ContentfulContent.css';
import moment from 'moment';

export default class CommunityNewsletter extends Component {

	state ={
		newsletterContent : '',
		title:'',
		date: '',
	}

	componentDidMount(){	
		const entry = this.props.match.params.id;
		axios.get(`/api/community/${entry}`).then(res => {
					const data = res.data;
					const newsletterContent = data.body;
					const title = data.title;
					const date = moment(data.date).format("MMMM D, YYYY");
					this.setState({newsletterContent,
									title,
									date
								});
				}).catch(e =>{
					console.log(e);	
		});
	}



	render() {
		return (
			<div className="community contentfulContainer">
				<div className="header">
					<h1>{this.state.date}</h1>
				</div>
				<div>
					{ReactHtmlParser(this.state.newsletterContent)}
				</div>    		
		  	</div>
		);
	}
}

