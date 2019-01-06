import React from 'react';


// Default class to create mobx provider
export default class DefaultContainer extends React.Component {
	render() {
		return (
			<div>
				{this.props.children}
			</div>
		)
	}
}
