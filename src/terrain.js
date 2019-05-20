import React from 'react';

class Terrain extends React.Component {
	constructor(props) {
    super(props);

    this.state = {  
			isVisible: this.props.render
		};

		this.toggleRef = React.createRef();
		this.changeVisibility = this.changeVisibility.bind(this);
	}
	
	componentDidMount() {
		//The size attribute of the terrain, needs to be set here
		document.getElementById('terrain').setAttribute('size', '1024 1646.866787736353');
	}

	//Each time this method runs the isVisible state will change between true or false
	changeVisibility() {
		this.setState(prevState => ({
			isVisible: !prevState.isVisible
		}));
  }
	
	render() {
		return(
			<React.Fragment>
				<bvhrefiner
					render={this.props.render ? 'true' : 'false'}
					id="terrain" 					
					maxdepth="1"
					mindepth="0"
					interactiondepth="5"
					smoothloading="17"
					subdivision="64 64"
					factor="2.5" 
					maxelevation="50" 
					elevationurl={"resources/" + this.props.name + "/elevation"} 
					textureurl={"resources/" + this.props.name + "/textures"}
					normalurl=""
					usenormals="false"
					solid="false"
					elevationformat='png' textureformat='png' normalformat='png' 
					mode="3d"  >
				</bvhrefiner>
			</React.Fragment>
		);
	}
}

//If the render property is not defined it will default as true
Terrain.defaultProps = {
	render: true
};

export default Terrain;