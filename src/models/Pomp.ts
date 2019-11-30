import { PompStatus } from "../enums/PompStatus";
import { Subject } from 'rxjs';

export class Pomp {
    // Speed in ms
    private addMoreWaterSubject = new Subject();
    private changePompStatusSubject = new Subject();

    public addMoreWater$ = this.addMoreWaterSubject.asObservable();
    public changePompStatus$ = this.changePompStatusSubject.asObservable();
    private _status = PompStatus.Off;

    set status(value: PompStatus) {
        this._status = value;

        this.changePompStatusSubject.next(this._status);
    }

    get status() {
        return this._status;
    }
}

