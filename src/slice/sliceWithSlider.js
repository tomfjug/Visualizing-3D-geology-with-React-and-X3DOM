import React from 'react';
import Modal from "../modal.js";
import Toggle from "../toggle.js"
import {convertUTMcoordinates} from '../UTM/UTMUtils.js';

class SliceWithSlider extends React.Component {
	constructor(props) {
        super(props);

        this.state = {  
			isModalOpen: false,
			image: "./resources/Slices/" + 0 + ".png",
			pos: [0, 0, 0],
			value: 0,
			isVisible: true,
        };
        
		this.sliceRef = React.createRef();
		this.toggleRef = React.createRef();
        this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.selectSlice = this.selectSlice.bind(this);
		this.changeVisibility = this.changeVisibility.bind(this);
	}

	//Add eventListners AFTER initial render
	componentDidMount(){
		this.sliceRef.current.onclick = () => this.openModal();
		this.toggleRef.current.onclick = () => this.changeVisibility();
	}

	//Calucalte positions BEFORE initial render
	componentWillMount(){
		let position = convertUTMcoordinates(this.props.slice.start_longitude, this.props.slice.start_latitude, 
		this.props.slice.end_longitude, this.props.slice.end_latitude, this.props.slice.start_depth, this.props.slice.end_depth);
		
		this.setState( { pos: position } );
	}

	//Each time this method runs the isVisible state will change between true or false
	changeVisibility() {
		this.setState(prevState => ({ isVisible: !prevState.isVisible }));
    }
	
	//Get a given slice from the value of a range slider
	selectSlice(event){
		let slicePos = parseFloat(event.target.value);
		slicePos = slicePos/5000;
		this.setState({
			image: "./resources/Slices/" + event.target.value + ".png",
			value: event.target.value
		})
	}

	//Open a dialog prompt window
	openModal() {
		this.setState({ isModalOpen: true, });
	}
	
	//Closes a dialog prompt window
	closeModal() {
		this.setState({ isModalOpen: false })
	}

	render() {
		return (
			<React.Fragment>
				<transform name="slider" ref={this.sliceRef} translation={this.state.pos.x + " " + this.state.pos.y + " " + this.state.pos.z}  rotation='1 0 0 1.57079633'>
					<transform scale="75 75 0.0001">
						<shape render={this.state.isVisible ? 'true' : 'false'}>
							<appearance>
								<imagetexture url={this.state.image}/>
							</appearance>
							<box></box>
						</shape>
					</transform>					
					<viewpoint id={"sliceRange"} position="0 -50 350" description={"SliceWithSlider"}></viewpoint>
				</transform>

				<Toggle ref={this.toggleRef} 
						toggle={this.state.pos.x + " " + (this.state.pos.y) + " " + (this.state.pos.z - 90)}>
				</Toggle>

				<Modal isOpen={this.state.isModalOpen} onClose={this.closeModal}>
           			<h1>{this.props.slice.name}</h1>
           			<p>{this.props.slice.description}</p>
            		<img src={this.state.image} />
					<br></br>
					<input type="range" min="0" max="10" step="1" value={this.state.value} onChange={this.selectSlice}></input>
            		<h3>Releated Articles</h3>
            		<p><a href={this.props.slice.article} target="_blank">{this.props.slice.article}</a></p>
           			<p><button onClick={this.closeModal}>Close</button></p>
        		</Modal>
			</React.Fragment>
		);
	}
}

export default SliceWithSlider;