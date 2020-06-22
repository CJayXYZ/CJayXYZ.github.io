class Time {
    constructor(interval = 1) {
        this.startTime = new Date();
        this.interval = interval;
        this.frequency = int(1000 / interval)
    }

    elapsedTime() {
        let endTime = new Date();
        let ret = endTime - this.startTime;
        this.startTime = new Date();
        return ret;
    }

    allow() {
        let endTime = new Date();
        let elapsedTime = endTime - this.startTime;
        if (elapsedTime > this.interval) {
            this.startTime = new Date();
            return true;
        }
        return false;
    }

    setTimer(interval){
        this.interval = interval;
    }
}
