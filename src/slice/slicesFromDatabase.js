import React from 'react';
import axios from 'axios';
import SliceModel from "./sliceModel.js"
import Slice from "./slice.js"

class SliceDB extends React.Component {

    constructor(props) {
        super(props);
        this.state = {slices: []};

        this.getSlicesFromDB = this.getSlicesFromDB.bind(this);
    }

    //Gets all slices from the database, when component is initilaized
    componentDidMount() {
        axios.get('http://localhost:4000/rex3d/slices/')
            .then(response => {
                this.setState({slices: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //Gets all slices from the database, when component is updated
    componentDidUpdate() {
        axios.get('http://localhost:4000/rex3d/slices/')
            .then(response => {
                this.setState({slices: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    
    //Creates an Slice component for each slice from the database
    getSlicesFromDB() {
        let isVisible = this.props.displaySlices;

        return this.state.slices.map(function(current, i) {

            let slice = new SliceModel(current.name, current.description, current.imageUrl,
                            current.start_latitude, current.start_longitude, current.end_latitude, current.end_longitude,
                            current.start_depth, current.end_depth, current.article);
            return <Slice displaySlices={isVisible} key={i} index={i} slice={slice}></Slice>
        });
    }

    render() {
        return(
            <React.Fragment>
                { this.getSlicesFromDB() }   
            </React.Fragment>
        )
    }
}

export default SliceDB;