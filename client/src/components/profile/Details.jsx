import React from 'react';
const { ListGroup, ListGroupItem } = require("reactstrap");
export const Details = (props) =>{
	return(
	<ListGroup>
		<ListGroupItem>
			<b>Fame Rating</b> : {props.user.fameRating}
		</ListGroupItem>
		<ListGroupItem>
			<b>Total Views</b> : {props.user.views}
		</ListGroupItem>
	</ListGroup>
	)
}