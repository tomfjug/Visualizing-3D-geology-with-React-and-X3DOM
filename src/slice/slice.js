import React from 'react';
import Modal from "../modal.js";
import Toggle from "../toggle.js";
import {convertUTMcoordinates} from '../UTM/UTMUtils.js';

class Slice extends React.Component {
	constructor(props) {
    super(props);

    this.state = {  
			isModalOpen: false,
			pos: 0,
			isVisible: true
		};

		this.sliceRef = React.createRef();
		this.toggleRef = React.createRef();

		this.changeVisibility = this.changeVisibility.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	//Add eventListners AFTER initial render
	componentDidMount(){
		this.sliceRef.current.onclick = (e) => this.handleClick(e);
		this.toggleRef.current.onclick = () => this.changeVisibility();
	}

	//Calucalte positions BEFORE initial render
	componentWillMount(){
		let position = convertUTMcoordinates(this.props.slice.start_longitude, this.props.slice.start_latitude, 
		this.props.slice.end_longitude, this.props.slice.end_latitude, this.props.slice.start_depth, this.props.slice.end_depth);
		
		this.setState( { pos: position } );
	}

	//Runs when user click on the slice in the scene
	handleClick(event) {
		//Left mouse button clicked
		if(event.button == 1){
			this.openModal();
		//Right mouse button clicked
		}else if(event.button == 2){
			this.changeVisibility();
		}
	}

	//Each time this method runs the isVisible state will change between true or false
	changeVisibility() {
		this.setState(prevState => ({
			isVisible: !prevState.isVisible
		}));
  }
	
	//Open a dialog prompt window, with information of a slice
	openModal() {
		this.setState({ 
			isModalOpen: true, 
		});
	}
	
	//Closes the dialog prompt window
	closeModal() {
		this.setState({ isModalOpen: false })
	}
	
	render() {
		return (
			<React.Fragment>
				<transform ref={this.sliceRef} name="slice" translation={this.state.pos.x + " " + this.state.pos.y + " " + (this.state.pos.z - this.props.slice.start_depth)} rotation='1 0 0 1.57079633'>
			    <transform scale={((this.state.pos.startX - this.state.pos.endX)/2) + " " + -(this.state.pos.z) + " " + 0.0001}>
						<shape render={(this.props.displaySlices && this.state.isVisible) ? 'true' : 'false'} >
							<appearance>
								<imagetexture url={this.props.slice.imageUrl}/>
							</appearance>
							<box></box>
						</shape>
				  </transform>
				  <viewpoint id={"s" + this.props.index} position={0 + " " + -5 + " " + -(this.state.pos.z)*2.9} description={this.props.slice.name}></viewpoint> 
				</transform>
				
				<Toggle ref={this.toggleRef} render={this.props.displaySlices} toggle={this.state.pos.x + " " + (this.state.pos.y) + " " + ((2*this.state.pos.z) - this.props.slice.start_depth - 10)} ></Toggle>
				<Modal isOpen={this.state.isModalOpen} onClose={this.closeModal}>
          <h1>{this.props.slice.name}</h1>
          <p>{this.props.slice.description}</p>
					<a href={this.props.slice.imageUrl} target="_blank">
          	<img src={this.props.slice.imageUrl} width="400px" height="200px"/>
					</a>
          <h3>Releated Articles</h3>
          <p><a href={this.props.slice.article} target="_blank">{this.props.slice.article}</a></p>
          <p><button onClick={this.closeModal}>Close</button></p>
				</Modal>
			</React.Fragment>
		);
	}
}

export default Slice;