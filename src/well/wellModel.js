// This class is used to store all the information a Well can contain
// Notice that a well are buildt from a list of subwells that contains necesarry building blocks to create a well

export default class WellModel {
    constructor(name, des, subwell, type, articleUrl, start_e, start_n, depth) {
        this.name = name;
        this.des = des;
        this.subwell = subwell;
        this.type = type;
        this.article = articleUrl;
        this.longitude = start_e;
        this.latitude = start_n;
        this.depth = depth;
    } 
}