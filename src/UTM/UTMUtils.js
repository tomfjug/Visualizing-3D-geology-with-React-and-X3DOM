//Proj4 is a libary used for the convertion of UMT coordinates
import proj4 from 'proj4';
import UTMSettings from './UTMSettings.js';

let utm = new UTMSettings();

//Convert two coordinates given by a longitude, latitude, and depth
export const convertUTMcoordinates = function(start_longitude, start_latitude, end_longitude, end_latitude, start_depth, end_depth){
    //Values used in the proj4 converter
    let wsg84proj = 'EPSG:4326';
    let utmProj = '+proj=utm +zone=33X +ellps=GRS80 +units=m +no_defs';

    //Convert string value to float, also changes "," to "." so it fits the float syntax
    //If you already have float values us longlatStart = [start_e, start_n] instead
    let longlatStart = [parseFloat(start_longitude.split(',').join('.')), parseFloat(start_latitude.split(',').join('.'))];
    let longlatEnd = [parseFloat(end_longitude.split(',').join('.')), parseFloat(end_latitude.split(',').join('.'))];
    
    let utmStart33X = proj4(wsg84proj, utmProj).forward(longlatStart);
    let startPos = getPositionInLocalCoordinateSystem(utmStart33X[0], utmStart33X[1], parseFloat(start_depth));

    let utmEnd33X = proj4(wsg84proj, utmProj).forward(longlatEnd);
    let endPos = getPositionInLocalCoordinateSystem(utmEnd33X[0], utmEnd33X[1], parseFloat(end_depth));
   
    let pos = getAveragePosition(startPos, endPos);
    
    return {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        startX: startPos.x,
        endX: endPos.x
    }
}

//Convert one coordinates given by a longitude, latitude, and depth
export const convertUTMcoordinate = function(longitude, latitude, dep){
    //Values used in the proj4 converter
    let wsg84proj = 'EPSG:4326';
    let utmProj = '+proj=utm +zone=33X +ellps=GRS80 +units=m +no_defs';

    //Convert string value to float, also changes "," to "." so it fits the float syntax
    //If you already have float values us longlatStart = [start_e, start_n] instead
    let longlat = [parseFloat(longitude.split(',').join('.')), parseFloat(latitude.split(',').join('.'))];
    let depth = parseFloat(dep);
    
    let utmStart33X = proj4(wsg84proj, utmProj).forward(longlat);
    let pos = getPositionInLocalCoordinateSystem(utmStart33X[0], utmStart33X[1], depth);

    return {
        x: pos.x,
        y: pos.y,
        z: pos.z
    }
}

//Covert UTM coordinates to local coordinate system
export const getPositionInLocalCoordinateSystem = function(utmx, utmy, depth) {
    return {
        x: (utmx - utm.originUTMX)/utm.lengthOfUnitX,
        y: (utmy - utm.originUTMY)/utm.lengthOfUnitY,
        z: -depth
    };
}

//Find average between two points
const getAveragePosition = function(start, end){
    return {
        x: (start.x + end.x) / 2,
        y: (start.y + end.y) / 2,
        z: (end.z - start.z) / 2,
    };
}