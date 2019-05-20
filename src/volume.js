import React from 'react';

class Volume extends React.Component {
    constructor(){
		super();
	}
	

	render(){
		return (
        <React.Fragment>
            <transform scale='0.05 0.05 0.05' translation='0 0 0.4'>   
        	<volumedata dimensions='2.0 2.0 2.0'>
				<imagetextureatlas url="resources/Volume/kansai_pawr_20120726175907.png" numberOfSlices="64" slicesOverX="8" slicesOverY="8">
         		</imagetextureatlas>
                <mprvolumestyle positionLine={this.props.pos}>
                    
                </mprvolumestyle>
        	</volumedata>
			</transform>     
        </React.Fragment>
		);
	}
}

export default Volume;