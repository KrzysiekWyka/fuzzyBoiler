import { HeatingStatus } from "../enums/HeatingStatus";
import { Subject } from 'rxjs';

export class Heating {
    public static destinationTemperature = 70;

    private _temperature = Heating.destinationTemperature;
    private changeTemperatureSubject = new Subject();

    public changeTemperature$ = this.changeTemperatureSubject.asObservable();

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

    set temperature(value: number) {
        this._temperature = value;

        this.changeTemperatureSubject.next(value);
    }

    get temperature() {
        return this._temperature;
    }


    calculateTemperature(inputOfOneLitreWaterTemperature: number, currentLitersOfWater: number) {
        this.temperature = ((currentLitersOfWater * this.temperature) + (1 * inputOfOneLitreWaterTemperature)) / (currentLitersOfWater + 1);
    }
}
