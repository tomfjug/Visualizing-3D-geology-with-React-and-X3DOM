import React from "react";
import ReactDOM from "react-dom";
import UploadSlices from "./slice/uploadSlices.js";
import UploadSlicesDB from "./slice/uploadSlicesToDatabase.js";
import UploadWells from "./well/uploadWells.js"
import UploadWellsDB from "./well/uploadWellsToDatabase.js";
import Terrain from "./terrain.js";
import Navigation from "./navigation.js";
import SliceWithSlider from "./slice/sliceWithSlider.js";
import SliceModel from "./slice/sliceModel.js";
import "babel-polyfill";
import axios from 'axios';
import SliceDB from "./slice/slicesFromDatabase.js";
import WellDB from "./well/wellsFromDatabase.js";

//let slice = new SliceModel('Some example', text, "", "21,0", "80,0", "21,0", "80,0", -230, 0, url);
let listOfViews = "";

//Scene Ratio
let width = '1200px'
let height = '650px'

class App extends React.Component {
    constructor() {
		super();
		
		this.state = {
			//multerImage: DefaultImg,
			isButtonDisabled: false,
			slices: [],
			terrainVisible: true,
			showSlices: true,
			showWells:true,
			views: "",
			img: "",
			todos: [],
		};

		this.toggleElements = this.toggleElements.bind(this);
		this.getViewpoints = this.getViewpoints.bind(this);

		this.onClickFromSlices = this.onClickFromSlices.bind(this);
		this.onClickFromNavigation = this.onClickFromNavigation.bind(this);
		this.onClickFromSlider = this.onClickFromSlider.bind(this);

		this.childSlices = React.createRef();
		this.childNavigation = React.createRef();
		this.childSlider = React.createRef();
		this.childWells = React.createRef();
	}

	componentDidMount() {
		setTimeout(() => this.getViewpoints(), 1000);
	}

	componentDidUpdate() {
		//Make sure to get all viewpoints
		setTimeout(() => this.getViewpoints(), 1000);
	}

	//Finds all the viewpoint in the X3D element tag. Is used for drop down menu with a list of all elements
	getViewpoints(){
		let e = document.getElementById('x3d_context');
		let views = e.runtime.canvas.doc._bindableBag._stacks[0]._bindBag;

		let elements = [];
		
		for(let i = 0; i < views.length; i++){
			
			if(views[i]._vf.description != ""){
				elements.push(views[i])
			}
		}

		listOfViews = elements.map((view, index) =>
			<React.Fragment key={index} >
				<option value={view._DEF}>{view._vf.description}</option>
			</React.Fragment>
		);

		this.setState({views: listOfViews});	
	}
	

	//This allows the app component to run a method from a file
	//This is done, so that the button that performs a function call can be placed outside the scene.
	onClickFromSlices(e){
		//this.childSlices.current.handleFiles(e).then(() => this.getViewpoints());
		this.childSlices.current.handleFiles(e);
		//this.getViewpoints();
		setTimeout(() => this.getViewpoints(), 1200);
	}

	//Same as slice above, but for wells instead
	onClickFromWells(e){
		this.childWells.current.handleFile(e);
		setTimeout(() => this.getViewpoints(), 1200);
	}

	//Same as above, but for several navigation options
	onClickFromNavigation(e){
		if(e=="return"){
			this.childNavigation.current.goBackToCurrentView();
		}else if(e=="next" || e=="prev") {
			this.childNavigation.current.changeViewpoint(e);
		}else if(e=="rotate") {
			this.childNavigation.current.rotateCamera();
		}else if(e=="map"){
			this.childNavigation.current.returnToMap();
		}else{
			this.childNavigation.current.goToRotation(e);
		}
		this.setState({ isButtonDisabled: true, });
		setTimeout(() => this.setState({ isButtonDisabled: false }), 1200);	
	}

	onClickFromSlider(e){
		this.childSlider.current.selectSlice(e);
	}
	
	//Toggle method are used for altering the visibility state between true and false
	toggleElements(element) {
		if(element=="Terrain"){
			this.setState(prevState => ({
				terrainVisible: !prevState.terrainVisible
			}));
		}else if(element=="Slices") {
			this.setState(prevState => ({
				showSlices: !prevState.showSlices
			}));
		}else if(element=="Wells"){
			this.setState(prevState => ({
				showWells: !prevState.showWells
			}));
		}
	}

	//Render the scene containing all the x3dom nodes, and additional buttons outside the scene
	render() {
		return (
		 <div>
			<x3d width={width} height={height} id="x3d_context" showlog="false" disabledoubleclick="true" keysenabled="true">
      	<scene>
					<navigationinfo explorationmode="pan" speed='0.5' transitionTime='1.0' transitionType="LINEAR" 
													type="EXAMINE" typeparams='[-0.4,60,0.05,2.8]' walkdamping='2.0'>
					</navigationinfo>
					<background skycolor="0.4 0.6 0.8"></background>

					{/*React components with X3DOM code*/}
					<Navigation ref={this.childNavigation}></Navigation>
					<Terrain name="Svalbard" render={this.state.terrainVisible}></Terrain>
					
					<SliceDB displaySlices={this.state.showSlices}></SliceDB>
					
					<WellDB displaySlices={this.state.showWells}></WellDB>
					
					<UploadSlices ref={this.childSlices} displaySlices={this.state.showSlices}></UploadSlices>
					<UploadWells ref={this.childWells} displayWells={this.state.showWells}></UploadWells>

				</scene>
    	</x3d>

			<div name="outside_scene">
				<p>Terrain Configurations</p>
				<button onClick={() => this.toggleElements("Terrain")}>Toggle Terrain</button>
				<button onClick={() => this.toggleElements("Slices")}>Toggle Slices</button>
				<button onClick={() => this.toggleElements("Wells")}>Toggle Wells</button>
				<br></br>

				<p>Select an element</p>
				<select onClick={(e) => document.getElementById(e.target.value).setAttribute('set_bind','true')}>
  					{this.state.views}
				</select>	

				<p>Change viewpoint: </p>
				<button onClick={() => this.onClickFromNavigation("next")} disabled={this.state.isButtonDisabled}>Next view</button>
				<button onClick={() => this.onClickFromNavigation("prev")} disabled={this.state.isButtonDisabled}>Previous view</button>
				<button onClick={() => this.onClickFromNavigation("return")} disabled={this.state.isButtonDisabled}>Return to element</button>
				<button onClick={() => this.onClickFromNavigation("rotate")} disabled={this.state.isButtonDisabled}>Rotate</button>
				<br></br>

				<p>Look towards</p>
				<button onClick={() => this.onClickFromNavigation("map")} disabled={this.state.isButtonDisabled}>Map</button>
				<button onClick={() => this.onClickFromNavigation(1)} disabled={this.state.isButtonDisabled}>North</button>
				<button onClick={() => this.onClickFromNavigation(3)} disabled={this.state.isButtonDisabled}>South</button>
				<button onClick={() => this.onClickFromNavigation(2)} disabled={this.state.isButtonDisabled}>East</button>
				<button onClick={() => this.onClickFromNavigation(4)} disabled={this.state.isButtonDisabled}>West</button>

				<p>Upload Slices locally:</p>
				<input type="file" id="slice-file" multiple="multiple" name="files" onChange={(e) => {this.onClickFromSlices(e)}}/>
				<p>Upload Slices to database:</p>
				<UploadSlicesDB slices={this.state.slices} displaySlices={this.state.showSlices}></UploadSlicesDB>

				<p>Upload Wells locally:</p>
				<input type="file" id="well-file" multiple="multiple" name="files" onChange={(e) => {this.onClickFromWells(e)}}/>
				<p>Upload Wells to database:</p>
				<UploadWellsDB displayWells={this.state.showWells}></UploadWellsDB>

				<p>Slide trough a slice</p>
				<input type="range" min="0" max={10} step="1" onChange={(e) => this.onClickFromSlider(e)}></input>	
			</div>
		 </div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));