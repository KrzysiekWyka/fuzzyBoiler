import * as _ from "lodash";
import waterLevelTerm from "./waterLevelTerm";
import { Boiler } from "./models/Boiler";
import { Pomp } from "./models/Pomp";
import { fromEvent, interval, merge } from 'rxjs';
import { PompStatus } from "./enums/PompStatus";
import { HeatingStatus } from "./enums/HeatingStatus";
import { Heating } from "./models/Heating";

import './style.css';

const boiler = new Boiler(waterLevelTerm);
const pomp = new Pomp();
const heating = new Heating();

const waterLevelComponent = document.querySelector('.waterLevel');
const boilerProgress = document.querySelector('progress');
const pompStatusComponent = document.querySelector('.pompStatus');
const heatingStatusComponent = document.querySelector('.heatingStatus');
const waterTemperatureComponent = document.querySelector('.waterTemperature');
const inputTemperatureComponent = document.querySelector('.inputTemperature');

const inputTemperatureRange = inputTemperatureComponent.querySelector('input');

const windowLoad$ = fromEvent(window, 'load');

merge(windowLoad$, boiler.changeWaterLevel$).subscribe((arg: Event | number) => updateWaterLevel(arg instanceof Event? boiler.waterLevel: arg));
merge(windowLoad$, pomp.changePompStatus$).subscribe((arg: Event | PompStatus) => updatePompStatus(arg instanceof Event? pomp.status: arg));
merge(windowLoad$, heating.changeTemperature$).subscribe((arg: Event | number) => updateTemperatureLabel(arg instanceof Event? heating.temperature: arg));

const waterTemperatureInput$ = fromEvent(inputTemperatureRange, 'input');

merge(windowLoad$, waterTemperatureInput$).subscribe((event: Event) => updateInputTemperatureLabel(+_.get(event, 'target.value', 0)));

fromEvent(waterLevelComponent, 'input').subscribe((event: Event) => updateWaterLevelLabel(+(<HTMLInputElement>event.target).value));
fromEvent(waterLevelComponent, 'change').subscribe((event: Event) => boiler.waterLevel = (+(<HTMLInputElement>event.target).value));

interval(1000).subscribe(() => {
    if (pomp.status === PompStatus.On) {
        boiler.waterLevel++;
    }
});

updateHeatingStatus();

pomp.addMoreWater$.subscribe(() => {
    console.log('Add more water event trigger.');
});

function updateWaterLevelLabel(waterLevel: number) {
    waterLevelComponent.querySelector('span').innerText = `${waterLevel <= 9? 0: ''}${waterLevel} l`;
}

function updateWaterLevel(waterLevel: number) {
    const maxWaterLevel = Boiler.maxWaterLevel;

    // Update waterLevel range input
    updateWaterLevelLabel(waterLevel);

    const rangeInput: HTMLInputElement = waterLevelComponent.querySelector('input[type="range"]');

    rangeInput.value = `${waterLevel}`;

    rangeInput.max = `${maxWaterLevel}`;

    // Update progress bar
    boilerProgress.value = waterLevel;
    boilerProgress.max = maxWaterLevel;

    if (boiler.waterTermValue.high !== 1) {
        rangeInput.setAttribute('disabled', 'disabled');
        inputTemperatureRange.setAttribute('disabled', 'disabled');
    } else {
        rangeInput.removeAttribute('disabled');
        inputTemperatureRange.removeAttribute('disabled');
    }

    if (maxWaterLevel !== waterLevel) {
        pomp.checkWaterLevel(boiler.waterTermValue);
        heating.calculateTemperature(+inputTemperatureRange.value, waterLevel)
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

function updateInputTemperatureLabel(temperature: number) {
    inputTemperatureComponent.querySelector('span').innerText = `${temperature <= 9? 0:''}${temperature}°C`;
}

function updateTemperatureLabel(temperature: number) {
    waterTemperatureComponent.querySelector('span').innerText = `${temperature <= 9? 0:''}${temperature.toFixed(1)}°C`;
}
