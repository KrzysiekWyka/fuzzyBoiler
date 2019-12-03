import { BuildTermValue } from "./enums/BuildTermValue";
import { WaterLevelTermValue } from "./enums/WaterLevelTermValue";
import { buildTerm } from "./utils/buildTerm";

const waterLevelTerm = new Map(new Array(81).fill(0).map((_, index) => [index, {low: 0, medium: 0, high: 0}]));

// Low term
buildTerm(waterLevelTerm, 0, 20, WaterLevelTermValue.Low, BuildTermValue.One);

buildTerm(waterLevelTerm, 21, 29, WaterLevelTermValue.Low, BuildTermValue.Dec);

// Medium term
buildTerm(waterLevelTerm, 25, 33, WaterLevelTermValue.Medium, BuildTermValue.Inc);

buildTerm(waterLevelTerm, 34, 50, WaterLevelTermValue.Medium, BuildTermValue.One);

buildTerm(waterLevelTerm, 51, 59, WaterLevelTermValue.Medium, BuildTermValue.Dec);

// High term
buildTerm(waterLevelTerm, 55, 63, WaterLevelTermValue.High, BuildTermValue.Inc);

buildTerm(waterLevelTerm, 65, 80, WaterLevelTermValue.High, BuildTermValue.One);

export default waterLevelTerm;
