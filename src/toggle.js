import React from 'react';

const Toggle = React.forwardRef((props, ref) => (
	<transform ref={ref} name="toggle" scale="100 100 100" translation={props.toggle} render={props.render ? 'true' : 'false'}>
		<shape>
			<appearance>
				<material diffusecolor="1 0 0" transparency='0.4'></material>
			</appearance>
			<sphere radius="0.05"></sphere>
		</shape>
	</transform>
));

//If the render property is not defined it will default as true
Toggle.defaultProps = {
	render: true
};

export default Toggle;