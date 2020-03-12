class Time {
    constructor() {
        this.startTime = new Date();
    }
    elapsedTime(){
        let endTime = new Date();
        let ret = endTime - this.startTime;
        this.startTime = new Date();
        return ret/10;
    }
}
