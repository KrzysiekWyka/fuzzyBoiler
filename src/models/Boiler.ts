import { Subject } from 'rxjs';

export class Boiler {
    public maxWaterLevel = 80;
    private _waterLevel = this.maxWaterLevel;

    private waterLevelSubject = new Subject();
    public changeWaterLevel$ = this.waterLevelSubject.asObservable();

    get waterLevel() {
        return this._waterLevel;
    }

    set waterLevel(value: number) {
        this._waterLevel = value;

        this.waterLevelSubject.next(this._waterLevel);
    }
}

