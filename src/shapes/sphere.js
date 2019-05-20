import React from 'react';

const Sphere = (props) => {
	return (
		<transform translation={props.pos}>
			<shape name={props.name} des={props.des} render={props.render} id={props.id}>
				<appearance>
					<material diffusecolor={props.col}></material>
				</appearance>
				<sphere radius={props.rad}></sphere>
			</shape>
		</transform>
	);
}

export default Sphere;