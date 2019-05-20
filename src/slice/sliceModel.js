// This class is used to store all the information a Slice can contain
export default class SliceModel {
    constructor(name, description, imageUrl, start_e, start_n, end_e, end_n, start_depth, end_depth, articleURL) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.start_longitude = start_e,
        this.start_latitude = start_n,
        this.end_longitude = end_e,
        this.end_latitude = end_n,
        this.start_depth = start_depth,
        this.end_depth = end_depth,
        this.article = articleURL;
    } 
}