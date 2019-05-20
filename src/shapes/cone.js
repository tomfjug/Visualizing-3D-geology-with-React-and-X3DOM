import React from 'react';

const Cone = (props) => {
	return (
		<transform translation={props.pos}>
			<shape render={props.render} id={props.id}>
				<appearance>
					<material diffusecolor={props.col}></material>
				</appearance>
				<cone></cone>
			</shape>
		</transform>
	);
}

export default Cone;