import React from 'react';
import SubWellModel from "./subWellModel.js";
import WellModel from "./wellModel.js";
import Well from "./well.js"
import {getPositionInLocalCoordinateSystem} from '../UTM/UTMUtils.js';
import {convertUTMcoordinate} from '../UTM/UTMUtils.js';
import * as Papa from 'papaparse';

let wells = [];

class UploadWells extends React.Component {
    constructor(props) {
        super(props);

        this.handleFile = this.handleFile.bind(this);
        this.readRMSFile = this.readRMSFile.bind(this);
        this.updateData = this.updateData.bind(this);

        this.state = {
            wells: [],
            count: -1,
        }
    }

    //Handels all the files uploaded by a user
    handleFile(e){
        let found = false;
        let cvs_file = "";
        let rms_files = [];
        let names = [];
        let data = [];

        for (let i = 0; i < e.target.files.length; i++){
            //Check if the file is an excel file (should only be one)
            if('application/vnd.ms-excel' == e.target.files[i].type){
                found = true;
                cvs_file = e.target.files[i];
            //It should be a rms file if its not excel, difficult to check
            }else{
                rms_files.push(e.target.files[i]);
            }
        }
        
        //Check if required files exsists
        if(rms_files.length > 0 && found){
            const files = rms_files;

            //Goes throug all the rms_files that was uploaded
            for(let i = 0; i < files.length; i++){
                const file = files[i];
                const reader = new FileReader();

                //Need reference to "this", within reader.onload
                let that = this;

                reader.onload = () => {
                    let result = reader.result;
                    data[i] = this.readRMSFile(result);
                    names[i] = rms_files[i].name;
                    
                    let count = that.state.count;
                    count++;
                    that.setState({count: count});

                    //The updataData method will run from papa.parse(...) bellow, based on the setting from these configuration
                    if(count == rms_files.length-1){
                        let config = {
                            //The delimiter and newline are set to semicolon, to avoid auto detection of comma. 
                            //This could be a problem if description in the well cvs file contains a semicolon
                            delimiter: ";",
                            newline: ";",
                            header: true,
                            complete: function(result){
                                that.updateData(result, names, data);
                            }
                        }
                        //Read cvs file, data will be used in updateData method
                        Papa.parse(cvs_file, config);
                    }
                }
                reader.readAsText(file);
            }
        }else{
            if(!found){
                alert("Failed to load excel file");
            }else{
                alert("Failed to load rms file");
            }   
        }
    }
    
    //This method should have all the necasary data, to upload a well from its parameters
    updateData(result, fileNames, fileData) {
      let data = result.data;
      
      for(let i = 0; i < fileData.length; i++){
        let rmsData = fileData[i];

        //Variables
        let posCounter = 0;
        let propCounter = 0;
        let subwells = []
        let k = 0;
        let found = false;

        //Find reference with "k" to the current rms file in the cvs file
        while(!found && k < data.length){
            if(data[k].additional_files==fileNames[i]){
                found = true;
            }else{
                k++;
            }
        }

        if(!found){
            alert("Did not find " + fileNames[i] + " in excel sheet");
        }else{
            let globalPos = convertUTMcoordinate(data[k].start_e, data[k].start_n, 0)
            
            //Make all the subwells in a well
            for(let i = 0; i < (rmsData.posistion.length/3) -1; i++){
                //console.log(rmsData.posistion[posCounter]);
                
                let subs = new SubWellModel(
                    rmsData.posistion[posCounter] - globalPos.x, rmsData.posistion[posCounter + 1] - globalPos.y, rmsData.posistion[posCounter + 2],
                    rmsData.posistion[posCounter + 3] - globalPos.x, rmsData.posistion[posCounter + 4] - globalPos.y, rmsData.posistion[posCounter + 5],
                    rmsData.propertyValues.slice(propCounter, propCounter + rmsData.property_values_row_length + 1)
                );
            
                posCounter = posCounter + 3;
                propCounter = propCounter + rmsData.property_values_row_length;
                if(i==0){
                    console.log(subs);
                }
                
                subwells.push(subs); 
            }  

            let well = new WellModel(data[k].dataset_name, data[k].info, subwells, rmsData.propertyNames, data[k].related_links, data[k].start_e, data[k].start_n, 0);
            
            wells.push(well);
        }
        
      }
      
      this.setState({
        wells: wells,
      })
        
    }

    //Read an rms file, that contains data for a well log
    readRMSFile(rmsFile){
        let lines = rmsFile.split('\n'); // all lines in file
        let numProperties = parseInt(lines[3]); // number of properties
        let propertyNames = []; // list of the property names

        //Read property names
        for(let i = 4; i <numProperties+4; i++){
            propertyNames.push(lines[i]);
        }

        // create increment value so maximum samples is 300
        let increment = Math.floor((lines.length-numProperties-4)/100);

        if(increment < 1){
            increment = 1;
        }
        
        console.log(increment);
        console.log();
        

        let propertyValues = []; // 1d array of all the properties
        let posistion = [] // the 1d array of positions (first 3 values in each line)
    
        // Read up to 100 of the lines of properties
        for(let i = 4+numProperties; i<lines.length; i+=increment){
        //for(let i = 4+numProperties; i<lines.length; i++){
            
            let propValues = lines[i].split(' '); // line split by space to get values
            
            // push posistion (x, y, z), the positions are the three first values on a line
            if(propValues[0] && propValues[1] && propValues[2]) {
                //let pos = convertUTMcoordinate(propValues[0], this.props.well.latitude, this.props.well.depth);
                let pos = getPositionInLocalCoordinateSystem(parseFloat(propValues[0]),parseFloat(propValues[1]),parseFloat(propValues[2]))
                //let pos = convertUTMcoordinate(propValues[0],propValues[1],propValues[2]);
                
                posistion.push(pos.x);
                posistion.push(pos.y);
                posistion.push(pos.z);
                //posistion.push(depth);
                
                /*
                posistion.push(propValues[0]);
                posistion.push(propValues[1]);
                posistion.push(propValues[2]);
                */
                //depth = depth + 0.01;
            }

            if(propValues.length != (numProperties+3)) break; 
            // a line of values must be long as the numProperties +3 (because 3 first values is position)

            for(let j = 3; j < propValues.length; j++) {
                propertyValues.push(parseFloat(propValues[j])); // push each propvalue of this line to propertyValues
            }
        }
        
        // Return the data read from the RMS data
        return {
            posistion: posistion,
            posistion_row_length: 3,
            propertyNames: propertyNames,
            propertyValues: propertyValues,
            property_values_row_length: numProperties
        }
    }

    render(){
        return (
	        <React.Fragment>
                {wells.map((well,index) => (
                    <Well key={index} displayWells={this.props.displayWells} index={index} well={well} ></Well>
                ))}
            </React.Fragment>
        );
    }
}

export default UploadWells;