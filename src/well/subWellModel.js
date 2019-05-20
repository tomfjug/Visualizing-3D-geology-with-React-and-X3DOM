// This class is used to store all the information a Subwell can contain
// A subwell should be a part of a bigger object called well
// The subwell is used to decide the color between two coordinates of a well, based on property value
export default class SubWellModel {
    constructor(x, y, z, x2, y2, z2, property) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.x2 = x2;
        this.y2 = y2;
        this.z2 = z2;
        //Should be a list of values for each property
        this.property = property;
    } 
}
