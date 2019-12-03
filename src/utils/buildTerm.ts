import {WaterLevelTermValue} from "../enums/WaterLevelTermValue";
import {BuildTermValue} from "../enums/BuildTermValue";


export type waterLevelTermItem = { low: number, medium: number, high: number };
export type waterLevelTerm = Map<number, waterLevelTermItem>;

export function buildTerm(term: waterLevelTerm, startIndex: number, endIndex: number, key: WaterLevelTermValue, value: BuildTermValue) {
    let termValue = 1;

    if (value === BuildTermValue.Dec) {
        termValue = 0.9
    } else if (value === BuildTermValue.Inc) {
        termValue = 0.1
    }

    for (let i = startIndex; i <= endIndex; i++) {
        const item = term.get(i);

        term.set(i, {...item, [key]: +termValue.toFixed(1)});

        if (value === BuildTermValue.Inc) {
            termValue += 0.1
        } else if (value === BuildTermValue.Dec) {
            termValue -= 0.1;
        }
    }
}
