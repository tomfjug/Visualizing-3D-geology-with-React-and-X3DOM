import React from 'react';
import axios from 'axios';
import WellModel from "./wellModel.js"
import Well from "./well.js"

class WellDB extends React.Component {

    constructor(props) {
        super(props);
        this.state = {wells: []};

        this.getWellsFromDB = this.getWellsFromDB.bind(this);
    }

    //Gets all wells from the database, when component is initilaized
    componentDidMount() {
        axios.get('http://localhost:4000/rex3d/wells/')
            .then(response => {
                this.setState({wells: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    //Gets all wells from the database, when component is updated
    componentDidUpdate() {
        axios.get('http://localhost:4000/rex3d/wells/')
            .then(response => {
                this.setState({wells: response.data});
            })
            .catch(function (error) {
                console.log(error);
            })
    }
    
    //Creates an Wells component for each well from the database
    getWellsFromDB() {
        let isVisible = this.props.displaySlices;

        return this.state.wells.map(function(current, i) {
            /*
            let well = new WellModel(current.name, current.description, "../resources/images/AG-1-depth.png",
                            current.start_latitude, current.start_longitude, current.end_latitude, current.end_longitude,
                            current.start_depth, current.end_depth, current.article);
                            */
            return <Well displayWells={isVisible} key={i} index={i} well={current}></Well>
        });
    }

    render() {
        return(
            <React.Fragment>
                { this.getWellsFromDB() }   
            </React.Fragment>
        )
    }
}

export default WellDB;