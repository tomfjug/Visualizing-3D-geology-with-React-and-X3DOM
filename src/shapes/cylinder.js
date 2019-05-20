import React from 'react';

const Cylinder = (props) => {
	return (
		<transform translation={props.pos}>
			<shape render={props.render} id={props.id}>
				<appearance>
					<material diffusecolor={props.col}></material>
				</appearance>
				<cylinder></cylinder>
			</shape>
		</transform>
	);
}

export default Cylinder;