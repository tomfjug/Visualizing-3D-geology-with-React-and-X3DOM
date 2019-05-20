import React from 'react';

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {  
			isButtonDisabled: false,
			pos: [-50.00000, -310.00000, -100.00000],
			//pos: [0, 0, 1000.00000],
			ori: "0.99951 -0.02752 -0.01499 1.58172",
			rotationIndex: 2,
			in: 87,
			out: 83,
			left: 65,
			right: 68,
		};

		this.viewRef = React.createRef();

		this.changeViewpoint = this.changeViewpoint.bind(this);
		this.goBackToCurrentView = this.goBackToCurrentView.bind(this);
		
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.moveDirection = this.moveDirection.bind(this);
		this.rotateCamera = this.rotateCamera.bind(this);
		this.goToRotation = this.goToRotation.bind(this);
		this.returnToMap = this.returnToMap.bind(this);
	}

	//Add eventlisnter for input from the keyboard
	componentDidMount() {
		document.addEventListener('keydown', this.handleKeyPress);
		
	}
			
	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleKeyPress);
	}

	//Reset the camera to the viewpoint that is currently active in the X3D (usally would be the last element you looked at)
	goBackToCurrentView(){
		let e = document.getElementById('x3d_context');
		e.runtime.resetView();
	}
	
	//This method runs when a usere click on the next or previous view buttons, and changed the view to the next or previous
	//view in the x3dom view stack. This method also has a timer, that disable the buttons for a brief periode, this is done
	//because pressing the buttons rapidly can break the viewpoints in x3dom for some reason.
	changeViewpoint(event){
		let e = document.getElementById('x3d_context');
		if(event=="next") {
			e.runtime.nextView();
		}else if(event=="prev") {
			e.runtime.prevView();
		}
	}

	/*
	 * This method handles ALL function from user input from the keyboard
	 * Supported keyboard buttons are:
	 * W: 87, A: 65, S: 83, D: 68
	 * Q: 81, E: 69, R: 82, Shift: 16
	*/
    handleKeyPress(e) {
		console.log(e.keyCode);

		let axis; // 0: x-axis, 1: y-axis, 2: z-axis
		let direction; // Direction depends if number is positive or negative (ex: left or right, up or down, in or out)

		//This will ensure that one of the viewpoint releated to keyboard navigation is active, when a key is pressed 
		if(document.getElementById('x3d_context').runtime.viewpoint()._DEF == "over"){

		}else if (e.keyCode === 87 || e.keyCode === 83 || e.keyCode === 65 ||
			e.keyCode === 68 || e.keyCode === 81 || e.keyCode === 69) {
			
			let currentIndex = this.state.rotationIndex-1;
			if(currentIndex==0){
				currentIndex = 4;
			}
			let currentViewpoint = "on" + currentIndex;
			
			document.getElementById(currentViewpoint).setAttribute('set_bind','true');
		//This will reset the camera to the starting point
		}else if(e.keyCode === 82){
			let initialPos = [-50.00000, -310.00000, -100.00000];
			this.setState({pos: initialPos, rotationIndex: 2, in: 87, out: 83, left: 65, right: 68});
			document.getElementById("on1").setAttribute('set_bind','true');
		}
    	
		//Move in towards the screen
		if (e.keyCode === this.state.in) {
			axis = 1;
			direction = 10;
			this.moveDirection(axis, direction);
		
		//Move out from the screen
		} else if (e.keyCode === this.state.out) {
			axis = 1;
			direction = -10;
			this.moveDirection(axis, direction);
		
		// Move Left
		} else if (e.keyCode === this.state.left) {
			axis = 0;
			direction = -10;
			this.moveDirection(axis, direction);
		
		// Move Right
		} else if (e.keyCode === this.state.right) {
			axis = 0;
			direction = 10;
			this.moveDirection(axis, direction);
		
		// Move Down
		} else if (e.keyCode === 81) {
			axis = 2;
			direction = -10;
			this.moveDirection(axis, direction);
		
		// Move Up
		} else if (e.keyCode === 69) {
			axis = 2;
			direction = 10;
			this.moveDirection(axis, direction);

		// Rotate camera 90 degree around y-axis
		} else if ((e.keyCode === 16) && !(this.state.isButtonDisabled))  {
			this.rotateCamera();
			this.setState({ isButtonDisabled: true, });
			setTimeout(() => this.setState({ isButtonDisabled: false }), 1200);	
		}
	}
	
	//Moves the camera posistion along a given axis
	moveDirection(axis, direction){
		let temp = this.state.pos.slice();
		temp[axis] = temp[axis] + direction;
		this.setState({pos: temp});	
	}

	//Move the camera to a paticular viewpoint
	goToRotation(i){
		if(i==1){
			document.getElementById('on1').setAttribute('set_bind','true');
			this.setState({rotationIndex: 2, in: 87, out: 83, left: 65, right: 68});
		}else if(i==2){
			document.getElementById('on2').setAttribute('set_bind','true');
			this.setState({rotationIndex: 3, in: 65, out: 68, left: 83, right: 87});
		}else if(i==3){
			document.getElementById('on3').setAttribute('set_bind','true');
			this.setState({rotationIndex: 4, in: 83, out: 87, left: 68, right: 65});
		}else if(i==4){
			document.getElementById('on4').setAttribute('set_bind','true');
			this.setState({rotationIndex: 1, in: 68, out: 65, left: 87, right: 83});
		}
	}

	//Rotate the camera from one viewpoint to the next viewpoint
	rotateCamera(){
		if(this.state.rotationIndex==1){
			document.getElementById('on1').setAttribute('set_bind','true');
			this.setState({rotationIndex: 2, in: 87, out: 83, left: 65, right: 68});
		}else if(this.state.rotationIndex==2){
			document.getElementById('on2').setAttribute('set_bind','true');
			this.setState({rotationIndex: 3, in: 65, out: 68, left: 83, right: 87});
		}else if(this.state.rotationIndex==3){
			document.getElementById('on3').setAttribute('set_bind','true');
			this.setState({rotationIndex: 4, in: 83, out: 87, left: 68, right: 65});
		}else if(this.state.rotationIndex==4){
			document.getElementById('on4').setAttribute('set_bind','true');
			this.setState({rotationIndex: 1, in: 68, out: 65, left: 87, right: 83});
		}
	}

	//Return the camera to look down at the map from above (Application starts with this viewpoint)
	returnToMap(){
		this.setState({in: 87, out: 83, left: 65, right: 68});
		document.getElementById("over").setAttribute('set_bind','true');
	}

	render(){
		return (
			<React.Fragment>
				<viewpoint id="over"position={this.state.pos[0] + " " + this.state.pos[1] + " " + (this.state.pos[2] + 1100.0)} description="Map"></viewpoint>
				<viewpoint id="on1" position={this.state.pos[0] + " " + this.state.pos[1] + " " + this.state.pos[2]} orientation="0.99951 -0.02752 -0.01499 1.58172"></viewpoint>
				<viewpoint id="on2" position={this.state.pos[0] + " " + this.state.pos[1] + " " + this.state.pos[2]} orientation="0.58945 -0.57418 -0.56821 2.07826"></viewpoint>
				<viewpoint id="on3" position={this.state.pos[0] + " " + this.state.pos[1] + " " + this.state.pos[2]} orientation="0.00427 0.70042 0.71372 3.15033"></viewpoint>
				<viewpoint id="on4" position={this.state.pos[0] + " " + this.state.pos[1] + " " + this.state.pos[2]} orientation="0.55086 0.56377 0.61540 2.09624"></viewpoint>
			</React.Fragment>
		);
	}
}

export default Navigation;