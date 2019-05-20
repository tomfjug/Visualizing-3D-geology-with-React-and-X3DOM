//Usefull values related to conversion of coordinates
export default class UTMSettings {
    constructor(){
        this.origin_latitude = 80.99738888888889;
        this.origin_longitude = 8.228622222222223;
        this.leftUTM = 381970.000;
        this.upUTM = 8999810.000;
        this.rightUTM = 850020.000;
        this.downUTM = 8247060.000;
        this.originUTMX = (this.leftUTM+this.rightUTM)/2;
        this.originUTMY = (this.upUTM+this.downUTM)/2;
        this.aspect = (this.upUTM-this.downUTM)/(this.rightUTM-this.leftUTM);

        this.width = 1024;
        this.height = 1024*this.aspect;

        this.lengthOfUnitX = (this.rightUTM-this.leftUTM) / this.width;
        this.lengthOfUnitY = (this.upUTM-this.downUTM) / this.height;
    }
}