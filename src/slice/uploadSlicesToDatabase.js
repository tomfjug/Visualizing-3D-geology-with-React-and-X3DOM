import React from 'react';
import SliceModel from "./sliceModel.js"
import ImageModel from "./imageModel.js"
import axios from 'axios';
import * as Papa from 'papaparse';

let slices = [];

class UploadSlicesDB extends React.Component {
    constructor(props) {
        super(props);

        this.state = {  
            visible: true,
            slices: []
        };

        this.handleFiles = this.handleFiles.bind(this);
        this.readCVSFile = this.readCVSFile.bind(this);
        this.readImageFiles = this.readImageFiles.bind(this);
        this.updateData = this.updateData.bind(this);
    }

    //Will run when a user uploads files, method call comes from index.js to avoid having the button inside the scene
    handleFiles(e){
        let csvFilePath = "";
        let image_files = [];
        let found = false;

        //This for loop will identify the file type for all the files
        for (let i = 0; i < e.target.files.length; i++){
            //Check if the file is an excel file (should only be one)
            if('application/vnd.ms-excel' == e.target.files[i].type){
                found = true;
                csvFilePath = e.target.files[i];
            //It should be a images file
            }else if('image/png' == e.target.files[i].type || 'image/jpeg' == e.target.files[i].type){
                image_files.push(e.target.files[i]);
            }
        }

        //Error message when missing required files
        if((!found) || image_files.length < 1){
            if((!found) && image_files.length < 1){
                alert("Failed to load excel and image file");
            }else if(!found){
                alert("Failed to load excel file");
            }else if(image_files.length < 1){
                alert("Failed to load image file");
            }
        //Normal flow
        }else{
            let images = this.readImageFiles(image_files, () => {this.readCVSFile(csvFilePath)});
            this.setState({img: images});
        }
    }

    //Gather necassary data from a set of image files
    readImageFiles(files, func){
        let images = [];
        for(let i = 0; i < files.length; i++){
            let imageFormObj = new FormData();
            imageFormObj.append("imageName", "multer-image-" + Date.now());
            imageFormObj.append("imageData", files[i]);

            images.push(new ImageModel(files[i].name, "http://localhost:4000/images/image/" + files[i].name));
    
            axios.post('http://localhost:4000/rex3d/images/add', imageFormObj)
                .then((data) => {
                    if(data.data.success) {
                        
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
            
            if(i == files.length-1){
                func();
            }
        }

        return images;
    }
    
    //Uses papaparse to read CVS file, will run the method update data with the result from the reading as a parameter
    readCVSFile(csvFilePath){
        Papa.parse(csvFilePath, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.updateData
        });
    }

    //Will add slice data to an array of slices based on data gatherd from files
    updateData(result) {
        const data = result.data;
        this.setState({data: data});
        for(let i = 0; i < data.length; i++){
            let filename = data[i].additional_files;
            filename = filename.split(',')[1];

            //Find and check if image has been uploaded
            let found = false;
            let j = 0;
            while(!found && j < this.state.img.length){
                if(filename == this.state.img[j].fileName){
                    found = true;
                    let slice = new SliceModel(
                        data[i].dataset_name, data[i].info, this.state.img[j].imageUrl, 
                        data[i].start_n, data[i].start_e, data[i].end_n, data[i].end_e, 
                        data[i].start_depth, data[i].end_depth, data[i].related_links);
                    
                    axios.post('http://localhost:4000/rex3d/slices/add', slice)
                        .then(res => {
                            console.log(res.data);
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                }
                j++;
            }
        }
        
        this.setState({
            slices: slices,
        })
        
    }

    render(){
        return (
	        <div>
                <input type="file" id="slice-file" multiple="multiple" name="files" onChange={(e) => {this.handleFiles(e)}}/>
            </div>
        );
    }
}

export default UploadSlicesDB;