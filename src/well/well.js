import React from "react";

import {convertUTMcoordinate} from '../UTM/UTMUtils.js';

import Toggle from "../toggle.js";
import Modal from "../modal.js";

let points = [];
let colors = [];
let cordIndices = '';
let count = 0;

class Well extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {  
			points: [],
			currentColors: [],
			cord: '',
			allColors: [[],[]],
			
			isModalOpen: false,
			pos: 0,
			isVisible: true,

			dropDownValue: ""
		};
		
		this.wellRef = React.createRef();
		this.toggleRef = React.createRef();
        
		this.setupSubwell = this.setupSubwell.bind(this);
		this.createWell = this.createWell.bind(this);
		this.changeColor = this.changeColor.bind(this);
		this.changeVisibility = this.changeVisibility.bind(this);
		
		this.handleClick = this.handleClick.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	
	/* This method is part of react documentation, it runs automatically after the initial render
	  * Here it is used to add eventListner (or more specifcally onClick methods) for X3DOM elements, by using react "refs".
	  * It is also used to run the createWell method.
	 */
	componentDidMount(){
		this.createWell();
		
		this.wellRef.current.onclick = (e) => this.handleClick(e);
		this.toggleRef.current.onclick = () => this.changeVisibility();
	}

	//Calculate posistion before intial render
	componentWillMount(){
		let temp = convertUTMcoordinate(this.props.well.longitude, this.props.well.latitude, this.props.well.depth);
		this.setState({pos: temp});
	}

	//Runs when user click on the well in the scene
	handleClick(event) {
		if(event.button == 1){
			this.openModal();
		}else if(event.button == 2){
			this.changeVisibility();
		}
	}

	//Open a modal dialog window with information on the well
	openModal() {
        this.setState({ 
			isModalOpen: true,
        });
    
    }
	
	//Close a modal dialog window with information on the well
    closeModal() {
        this.setState({ isModalOpen: false })
	}
	
	//Each time this method runs the isVisible state will change between true or false
	changeVisibility() {
		this.setState(prevState => ({
			isVisible: !prevState.isVisible
		}));
    }

	//Change the color on the well based on the visualType defined as a parameter t
	//Example of a visualization type could be something like preasure or temperatures.
	changeColor(event) {
		let well = this.props.well;

		//creates a temporary clone of the state as an array
		let temp = this.state.currentColors.slice(); //creates the clone of the state
		
		let vertex = 0;
		let colorIndex = -1;

		let type = event.target.value;

		//Find correct type from parameter
		for(let i = 0; i < well.subwell[0].property.length; i++){
			if(type == well.type[i]){
				colorIndex = i;
			}
		}

		//Change color of all eight vertices for each subwell
		for(let i = 0; i < 8*well.subwell.length; i++){	
			if(i%8 == 0 && i!= 0){
				vertex++;					
			}
			temp[i] = this.state.allColors[vertex][colorIndex] 
			//temp[i] = well.subwell[vertex].property[colorIndex];
		}

        this.setState(prevState => ({
			type: !prevState.type,
			currentColors: temp,
			dropDownValue: type
		}));
	}

	//This method is used to create a well, it will be a IndexedFaceSet in X3DOM, which contains a set of vertices with position and color
	createWell(){

		points = [];
		colors = [];
		cordIndices = '';
		count = 0;

		let result = this.calculateColor(this.props.well);

		for(let i = 0; i < result.well.subwell.length; i++){
			let subwell = result.well.subwell[i];
			this.setupSubwell(subwell.x, subwell.y, subwell.z, subwell.x2, subwell.y2, subwell.z2, subwell.property[0]);
		}

		this.setState({
			cord: cordIndices,
			currentColors: colors,
			points: points
		})

	}

	//Calculates the color value for each subwell in a well, for every property
	calculateColor(well){
		let canvas = document.createElement('canvas');     // create canvas element
        let ctx = canvas.getContext('2d');                 // get context
        let grd = ctx.createLinearGradient(0, 0, 30, 0);   // create a gradient

		grd.addColorStop(0.0, '#0000FF');
		//grd.addColorStop(0.25, '#00FFFF');
		//grd.addColorStop(0.50, '#00FF00');
		//grd.addColorStop(0.75, '#FFFF00');
		grd.addColorStop(1.0, '#FF0000');

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, 100, 100);
		
		let max = {};
		let min = {};

		for(let i = 0; i < well.subwell[0].property.length; i++){
			
			if(well.subwell[0].property[i]<0){
				min[i] = 1000000;
				max[i] = 0;
			}else{
				min[i] = well.subwell[0].property[i];
				max[i] = well.subwell[0].property[i];
			}
			
			for(let j = 1; j < well.subwell.length; j++){
				if(max[i]<well.subwell[j].property[i]){
					max[i]=well.subwell[j].property[i];
				}
				if(min[i]>well.subwell[j].property[i] && !(well.subwell[j].property[i]<0)){
					min[i]=well.subwell[j].property[i];
				}
			}
		}

		let allColors = [];
		
		for(let i = 0; i < well.subwell.length; i++){
			allColors[i] = [];
			for(let j = 0; j < well.subwell[i].property.length; j++){
				let propertyValueRange = max[j]-min[j];
				
				let value = well.subwell[i].property[j];
				let gradientPos;

				if(propertyValueRange == 0){
					gradientPos = value;
				}else{
					gradientPos = (value/propertyValueRange)*20;
				}

				//Max value for gradientPos exceded, will get color red (which is the highest)
				//Can give higher value in createLinearGradient, but the general color diffrence will be more narrow because the range is longer
				if(gradientPos>99){
					gradientPos=99;
				}
				
				//Unknown values are listed as -999
				
				if(!(value==-999)){
					//console.log(value);
					let tmp = ctx.getImageData(gradientPos, 0, 1, 1).data;
					allColors[i][j] = [parseFloat(tmp[0])/255.0, parseFloat(tmp[1])/255.0, parseFloat(tmp[2])/255.0];
					well.subwell[i].property[j] = [parseFloat(tmp[0])/255.0, parseFloat(tmp[1])/255.0, parseFloat(tmp[2])/255.0];
				}else{
					allColors[i][j] = [0, 0, 0]
					well.subwell[i].property[j] = [0, 0, 0];
				}
				
			}
		}

		this.setState({ allColors: allColors });

		return {
			well
		}
	}


	/* Creates a subwell, which is the area between two coordinate in a well, each subwell contains of 8 vertices.
	 * Each subwell forms a "cube" so the well is visible from every angle. 
	 * To do this a point is placed from a specified width along the x- and z-axis.
	 * Note: all vertices within a subwell should have the same color (to avoid interpolation)
	 * Note2: Because of note 1, two "cubes" have distinct vertices even if they are at the same location
	 */
	setupSubwell(x, y, z, x2, y2, z2, property){
		let cordIndex;
		let width = 0.08; //thickness of the well in the x and y axis
		
		//The coordinates are the 6 faces of a cube, each face consist of 4 vetecise and are seperated by '-1'
		//With cordIndex='0 1 2 3 -1, 4 5 6 7 -1, 0 4 5 1 -1, 1 5 6 2 -1, 2 6 7 3 -1, 4 0 3 7 -1'; like this will result in this cube looks like this:
		/*  
		       1-----2
			  /|	/|
			 5-----6 |
			 | 0---|-3
			 |/    |/ 
			 4-----7
		*/
		
		cordIndex=	(count+0) + " " + (count+1) + " " + (count+2) + " " + (count+3) + " -1, " +
					(count+4) + " " + (count+5) + " " + (count+6) + " " + (count+7) + " -1, " +
					(count+0) + " " + (count+4) + " " + (count+5) + " " + (count+1) + " -1, " +
					(count+1) + " " + (count+5) + " " + (count+6) + " " + (count+2) + " -1, " +
					(count+2) + " " + (count+6) + " " + (count+7) + " " + (count+3) + " -1, " +
					(count+4) + " " + (count+0) + " " + (count+3) + " " + (count+7) + " -1, ";

		points[count+0] = (x - width) + " " + (y + width) + " " + (z/50);
		points[count+1] = (x2 - width) + " " + (y2 + width) + " " + (z2/50); 
		points[count+2] = (x2 + width) + " " + (y2 + width) + " " + (z2/50); 
		points[count+3] = (x + width) + " " + (y + width) + " " + (z/50); 
		points[count+4] = (x - width) + " " + (y - width) + " " + (z/50); 
		points[count+5] = (x2 - width) + " " + (y2 - width) + " " + (z2/50); 
		points[count+6] = (x2 + width) + " " + (y2 - width) + " " + (z2/50);  
		points[count+7] = (x + width) + " " + (y - width) + " " + (z/50);

		for(let i = count; i < count+8; i++){
			colors[i] = property;
		}
		
		if(cordIndices != ''){
			cordIndices = cordIndices + " " + cordIndex;
		}else{
			cordIndices = cordIndex;
		}

		//Increase count with 8 because each cube take 8 vertices for the arrays
		count += 8;
	}

	render() {

		//These are dropdown option that is used in the modal to change visualization types for a well
		let types = this.props.well.type;
		
		let visualTypes = types.map((type, index) =>
        <React.Fragment key={index} >
			<option value={type}>{type.substring(0, 20)}</option>
		</React.Fragment>
    
    	);

        return (
		<React.Fragment>
			<transform ref={this.wellRef} translation={this.state.pos.x + " " + this.state.pos.y + " " + (this.state.pos.z - 20)}>
				
				{/* 
					Rotation and scale are put in a seperate transform, because we don't want them to affect the viewpoint 
					depth value are given as positive value so we rotate the well 180 degrees to make them appear bellow the surface			
				*/}

				<transform scale='100 100 100'>
				<shape render={(this.props.displayWells & this.state.isVisible) ? 'true' : 'false'} >
					<appearance>
						<material></material>
					</appearance>
					
					<indexedfaceset solid='false' coordindex={this.state.cord}>
						<coordinate point={this.state.points}>
		                </coordinate>
						
                        <color color={this.state.currentColors}>
						</color>
					</indexedfaceset>
					
				</shape>
				</transform>
				
				<viewpoint id={"w" + this.props.index} position="20 -600 -220" orientation="1 0 0 1.57079633" description={this.props.well.name}></viewpoint>
				
			</transform>

			<Toggle ref={this.toggleRef} render={this.props.displayWells} toggle={(this.state.pos.x) + " " + (this.state.pos.y) + " " + (this.state.pos.z - 7)} ></Toggle>
					
			<Modal isOpen={this.state.isModalOpen} onClose={this.closeModal}>
           		<h1>{this.props.well.name}</h1>
           		<p>{this.props.well.des}</p>
				<h3>Visualization Types</h3>
				<select value={this.state.dropDownValue} onChange={(e) => this.changeColor(e)}>
  					{visualTypes}
				</select>	
				<h3>Related Articles</h3>	
				
				<p><a href={this.props.well.article} target="_blank">{this.props.well.article}</a></p>
           		<p><button onClick={this.closeModal}>Close</button></p>
        	</Modal>
		</React.Fragment>
       	);
    }
}

export default Well;