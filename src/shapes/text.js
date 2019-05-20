import React from 'react';

const Text = (props) => {
	return (
		<transform translation={props.pos}>
			<shape render={props.render} id={props.id}>
				<appearance>
					<material diffusecolor={props.col}></material>
				</appearance>
				<text string={props.word}></text>
			</shape>
		</transform>
	);
}

export default Text;