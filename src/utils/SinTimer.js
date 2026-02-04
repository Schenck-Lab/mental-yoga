export default class SinTimer {

    constructor(durationSec=1) {
        this.period = durationSec;
        this.acc = 0;
        this.odd = 0;
        this.t = 0;
    }

    getOutput(delta) {
        const safeDelta = (delta >= this.period) ? 0 : delta;
        this.acc += safeDelta;
        this.odd += safeDelta;

        if (this.acc >= this.period) {
            this.acc -= this.period;
        }

        if (this.odd >= this.period) {
            this.odd -= this.period;
        }
        this.t = (Math.PI * 2) * (this.acc / this.period);

        return Math.sin(this.t);
    }
}