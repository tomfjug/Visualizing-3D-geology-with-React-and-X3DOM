import React from 'react';

class Box extends React.Component {
	render(){
		return (
			<transform translation={this.props.pos}>
				<shape>
					<appearance>
						<material diffusecolor={this.props.col}></material>
					</appearance>
					<box></box>
				</shape>
			</transform>
		);
	}
}

export default Box;