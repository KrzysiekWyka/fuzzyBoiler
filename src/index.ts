import * as _ from "lodash";
import { fromEvent, interval, merge } from "rxjs";
import {
  HeatingLevel,
  HeatingLevelTerm
} from "./models/terms/HeatingLevel.model";
import { PumpPower, PumpPowerTerm } from "./models/terms/PumpPower.model";
import { WaterTemperature } from "./models/terms/WaterTemperature.model";
import { WaterLevel } from "./models/terms/WaterLevel.model";
import { BaseTerm } from "./models/terms/BaseTerm.model";

import "./style.css";

const waterLevelTerm = new WaterLevel();
const waterTemperatureTerm = new WaterTemperature();
const pumpPowerTerm = new PumpPower();
const heatingLevelTerm = new HeatingLevel();

const progressComponent = document.querySelector("progress");

// Water level HTML components
const waterLevelComponent = document.querySelector(".waterLevel");

const waterLevelMaxValue = `${WaterLevel.WATER_LEVEL_TERM_SIZE - 1}`;
progressComponent.setAttribute(
  "max",
  `${WaterLevel.WATER_LEVEL_TERM_SIZE - 1}`
);

waterLevelComponent.querySelector("input").max = waterLevelMaxValue;

waterLevelComponent.querySelector("input").addEventListener("input", e => {
  const newValue = (<HTMLInputElement>e.target).value;

  waterLevelComponent.querySelector("span").innerHTML = `${newValue}l`;
});

waterLevelComponent.querySelector("input").addEventListener("change", e => {
  timerTick(+(<HTMLInputElement>e.target).value);
});

// Input water HTML components
const inputTemperatureComponent = document.querySelector(".inputTemperature");
const inputTemperatureInputComponent = inputTemperatureComponent.querySelector(
  "input"
);

const inputTemperatureMaxValue = `${WaterTemperature.WATER_TEMPERATURE_TERM_SIZE -
  1}`;

inputTemperatureInputComponent.setAttribute("max", inputTemperatureMaxValue);
inputTemperatureInputComponent.setAttribute("value", inputTemperatureMaxValue);

inputTemperatureInputComponent.addEventListener("input", e => {
  const newValue = (<HTMLInputElement>e.target).value;

  inputTemperatureComponent.querySelector("span").innerHTML = `${newValue}°C`;
});

inputTemperatureComponent.querySelector(
  "span"
).innerHTML = `${inputTemperatureMaxValue}°C`;

const waterTemperatureComponent = document.querySelector(".waterTemperature");

waterTemperatureComponent.querySelector(
  "strong"
).innerHTML = `${inputTemperatureMaxValue}°C`;

waterTemperatureComponent
  .querySelector("strong")
  .setAttribute("data-value", inputTemperatureMaxValue);

const heatingStatusComponent = document.querySelector(".heatingStatus");

// Init logic
timerTick(+waterLevelMaxValue);

function timerTick(value: number) {
  // WaterLevel
  const waterLevelTermValue = waterLevelTerm.getTermValue(+value);

  waterLevelComponent.querySelector("span").innerHTML = `${value}l`;

  waterLevelComponent.querySelector("input").value = `${value}`;

  const waterLevelFinalTerm = BaseTerm.inferencingAndConcatTerms<
    PumpPowerTerm,
    PumpPower
  >("waterLevel", waterLevelTermValue, pumpPowerTerm);

  const pumpStatusComponent = document.querySelector(".pumpStatus");

  const pumpStatusValue = waterLevelFinalTerm.fuzzification().toFixed(0);

  const howMuchWater =
    pumpStatusValue === "20" ? 0 : ((+pumpStatusValue + 1) * 0.5).toFixed(0);

  pumpStatusComponent.querySelector(
    "strong"
  ).innerHTML = `${pumpStatusValue} (${howMuchWater}l / ${(
    ((window as any).delay || 500) / 1000
  ).toFixed(1)} s)`;

  // WaterTemperature
  const inputWaterTemperature = +inputTemperatureInputComponent.value;
  let currentWaterTemperature = +waterTemperatureComponent
    .querySelector("strong")
    .getAttribute("data-value");

  const waterTemperatureTermValue = waterTemperatureTerm.getTermValue(
    +currentWaterTemperature.toFixed(0)
  );

  const waterTemperatureFinalTerm = BaseTerm.inferencingAndConcatTerms<
    HeatingLevelTerm,
    HeatingLevel
  >("waterTemperature", waterTemperatureTermValue, heatingLevelTerm);

  const heatingStatusValue = waterTemperatureFinalTerm
    .fuzzification()
    .toFixed(0);

  console.log(`HeartingLevel = ${heatingStatusValue}`);

  heatingStatusComponent.querySelector("strong").innerHTML = heatingStatusValue;

  const heatingPower =
    heatingStatusValue === "10" ? 0 : +(+heatingStatusValue * 0.5).toFixed(0);

  currentWaterTemperature += heatingPower;

  const newWaterTemperature =
    (+howMuchWater * inputWaterTemperature + value * currentWaterTemperature) /
    (value + +howMuchWater);

  console.log(
    `(howMuchWater<${howMuchWater}> * inputWaterTemperature<${inputWaterTemperature}> + value<${value}> * currentWaterTemperature<${currentWaterTemperature}>)/(value<${value}>+howMuchWater<${howMuchWater}>)`,
    newWaterTemperature
  );

  waterTemperatureComponent.querySelector(
    "strong"
  ).innerHTML = `${newWaterTemperature.toFixed(0)}°C`;

  waterTemperatureComponent
    .querySelector("strong")
    .setAttribute("data-value", newWaterTemperature.toFixed(0));

  heatingStatusComponent.querySelector(
    "strong"
  ).innerHTML = `${heatingStatusValue} (${
    heatingStatusValue === "10" ? 0 : +(+heatingStatusValue * 0.5).toFixed(0)
  }°C / ${(((window as any).delay || 500) / 1000).toFixed(1)} s)`;

  if ((window as any).debug) {
    waterTemperatureFinalTerm.displayDiagram("Heating Status", ["value"]);
    waterLevelFinalTerm.displayDiagram("Pump Status", ["value"]);
  }

  // Both
  const waterLevelInput = waterLevelComponent.querySelector("input");

  if (pumpStatusValue !== "20" || heatingStatusValue !== "10") {
    waterLevelInput.setAttribute("disabled", "disabled");
    inputTemperatureInputComponent.setAttribute("disabled", "disabled");

    setTimeout(() => {
      const nextValue = +(value + +howMuchWater).toFixed(0);
      timerTick(nextValue === 79 ? 80 : nextValue);
    }, (window as any).delay || 500);
  } else {
    waterLevelInput.removeAttribute("disabled");
    inputTemperatureInputComponent.removeAttribute("disabled");
  }

  progressComponent.value = value;
}
