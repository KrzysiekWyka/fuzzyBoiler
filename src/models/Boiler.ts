import { Subject } from 'rxjs';
import { waterLevelTerm } from "../utils/buildTerm";

export class Boiler {
    public static maxWaterLevel = 80;
    private _waterLevel = Boiler.maxWaterLevel;

    constructor(private waterLevelTerm: waterLevelTerm) {}


    private waterLevelSubject = new Subject();
    public changeWaterLevel$ = this.waterLevelSubject.asObservable();

    get waterLevel() {
        return this._waterLevel;
    }

    set waterLevel(value: number) {
        this._waterLevel = value;

        this.waterLevelSubject.next(this._waterLevel);
    }

    get waterTermValue() {
        return this.waterLevelTerm.get(this.waterLevel)
    }
}

