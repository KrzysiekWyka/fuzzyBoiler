import { Boiler } from "./models/Boiler";
import { Pomp } from "./models/Pomp";
import { fromEvent, merge } from 'rxjs';
import { PompStatus } from "./enums/PompStatus";
import { HeatingStatus } from "./enums/HeatingStatus";
import { Heating } from "./models/Heating";
import * as _ from "lodash";

const boiler = new Boiler();
const pomp = new Pomp();
const heating = new Heating();

const waterLevelComponent = document.querySelector('.waterLevel');
const boilerProgress = document.querySelector('progress');
const pompStatusComponent = document.querySelector('.pompStatus');
const heatingStatusComponent = document.querySelector('.heatingStatus');
const waterTemperatureComponent = document.querySelector('.waterTemperature');

const waterTemperatureInput = waterTemperatureComponent.querySelector('input');

const windowLoad$ = fromEvent(window, 'load');

merge(windowLoad$, boiler.changeWaterLevel$).subscribe((arg: Event | number) => updateWaterLevel(arg instanceof Event? boiler.waterLevel: arg));
merge(windowLoad$, pomp.changePompStatus$).subscribe((arg: Event | PompStatus) => updatePompStatus(arg instanceof Event? pomp.status: arg));

const waterTemperatureInput$ = fromEvent(waterTemperatureComponent, 'input');

merge(windowLoad$, waterTemperatureInput$).subscribe((event: Event) => updateTemperatureLabel(+_.get(event, 'target.value', 0)));

fromEvent(waterLevelComponent, 'input').subscribe((event: Event) => updateWaterLevelLabel(+(<HTMLInputElement>event.target).value));
// fromEvent(waterLevelComponent, 'change').subscribe((event: Event) => boiler.waterLevel = (+(<HTMLInputElement>event.target).value));

updateHeatingStatus();

pomp.addMoreWater$.subscribe(() => {
    console.log('Add more water event trigger.');
});

function updateWaterLevelLabel(waterLevel: number) {
    waterLevelComponent.querySelector('span').innerText = `${waterLevel <= 9? 0: ''}${waterLevel.toFixed(1)} l`;
}

function updateWaterLevel(waterLevel: number) {
    const maxWaterLevel = boiler.maxWaterLevel;

    // Update waterLevel range input
    updateWaterLevelLabel(waterLevel);

    const rangeInput: HTMLInputElement = waterLevelComponent.querySelector('input[type="range"]');

    rangeInput.value = `${waterLevel}`;

    rangeInput.max = `${maxWaterLevel}`;

    // Update progress bar
    boilerProgress.value = waterLevel;
    boilerProgress.max = maxWaterLevel;

    if (waterLevel !== maxWaterLevel) {
        rangeInput.setAttribute('disabled', 'disabled');
        waterTemperatureInput.setAttribute('disabled', 'disabled');
    }
}

function updatePompStatus(pompStatus: PompStatus) {
    (<HTMLElement>pompStatusComponent.querySelector(`strong:not(.${pompStatus})`)).style.display = 'none';

    (<HTMLElement>pompStatusComponent.querySelector(`strong.${pompStatus}`)).style.display = 'block';
}

function updateHeatingStatus(heatingStatus?: HeatingStatus) {
    const actualHeatingStatus = heatingStatus || heating.status;

    heatingStatusComponent.querySelectorAll(`strong:not(.${actualHeatingStatus})`).forEach((elem: HTMLElement) => {
        elem.style.display = 'none'
    });

    (<HTMLElement>heatingStatusComponent.querySelector(`strong.${actualHeatingStatus}`)).style.display = 'block';
}

function updateTemperatureLabel(temperature: number) {
    waterTemperatureComponent.querySelector('span').innerText = `${temperature <= 9? 0:''}${temperature}°C`;
}

const waterLevelTerm = new Map(new Array(81).fill(0).map((_, index) => [index, {low: 0, medium: 0, high: 0}]));

enum BuildTermValue {
    One,
    Inc,
    Dec
}

enum WaterLevelTermValue {
    Low = 'low',
    Medium = 'medium',
    High = 'high'
}

// Low term
buildTerm(0, 20, WaterLevelTermValue.Low, BuildTermValue.One);

buildTerm(21, 29, WaterLevelTermValue.Low, BuildTermValue.Dec);

// Medium term
buildTerm(25, 33, WaterLevelTermValue.Medium, BuildTermValue.Inc);

buildTerm(34, 50, WaterLevelTermValue.Medium, BuildTermValue.One);

buildTerm(51, 59, WaterLevelTermValue.Medium, BuildTermValue.Dec);

// High term
buildTerm(55, 63, WaterLevelTermValue.High, BuildTermValue.Inc);

buildTerm(64, 80, WaterLevelTermValue.High, BuildTermValue.One);

function buildTerm(startIndex: number, endIndex: number, key: WaterLevelTermValue, value: BuildTermValue) {
    let termValue = 1;

    if (value === BuildTermValue.Dec) {
        termValue = 0.9
    } else if (value === BuildTermValue.Inc) {
        termValue = 0.1
    }

    for (let i = startIndex; i <= endIndex; i++) {
        const item = waterLevelTerm.get(i);

        waterLevelTerm.set(i, {...item, [key]: +termValue.toFixed(1)});

        if (value === BuildTermValue.Inc) {
            termValue += 0.1
        } else if (value === BuildTermValue.Dec) {
            termValue -= 0.1;
        }
    }
}
console.log(waterLevelTerm);
