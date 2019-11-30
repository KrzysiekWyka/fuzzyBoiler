import { HeatingStatus } from "../enums/HeatingStatus";
import { Subject } from 'rxjs';

export class Heating {
    private _status =  HeatingStatus.Moderate;
    private changeHeatingStatusSubject = new Subject();

    public changeHeatingStatus$ =  this.changeHeatingStatusSubject.asObservable();

    set status(value: HeatingStatus) {
        this._status = value;

        this.changeHeatingStatusSubject.next(this._status);
    }

    get status() {
        return this._status;
    }
}
