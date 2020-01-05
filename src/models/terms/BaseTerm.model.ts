import { Term } from "../../interfaces/Term.interface";
import { DefaultTerm } from "../../interfaces/DefaultTerm.interface";
import * as Chart from "chart.js";

type TermMap<T> = Map<number, T>;

export class BaseTerm<T> implements Term<T> {
  private readonly DIAGRAM_COLORS = [
    "rgb(255, 99, 132)",
    "red",
    "green",
    "blue",
    "yellow"
  ];
  private readonly DIAGRAMS_DIV_ID = "diagrams";

  term: TermMap<T>;

  private static createAndConcatTwoTerms<T extends DefaultTerm>(
    term1: BaseTerm<T>,
    term2?: BaseTerm<T>
  ) {
    const newMap = new Map<number, number>();

    term1.term.forEach((value, key) => {
      const term1Value = BaseTerm.getValueDifferentThanZeroFromValue<T>(value);

      let term2Value = 0;

      if (term2) {
        term2Value = BaseTerm.getValueDifferentThanZeroFromValue<T>(
          term2.term.get(key)
        );
      }

      const maxValue = Math.max(term1Value, term2Value);

      newMap.set(key, maxValue);
    });

    return BaseTerm.createFromMap(newMap);
  }

  static createFromMap<T>(map: TermMap<T>) {
    const newObject = new BaseTerm<T>();

    newObject.term = map;

    return newObject;
  }

  static inferencingAndConcatTerms<
    T extends DefaultTerm,
    U extends BaseTerm<T>
  >(
    input: "waterLevel" | "waterTemperature",
    termValue: { [key: string]: number },
    resultTerm: U
  ) {
    const terms: BaseTerm<T>[] = [];

    Object.entries(termValue).forEach(([key, value]) => {
      const newTerm = resultTerm.getTermLimitedByMaxValue(
        BaseTerm.checkRule(input, key) as any,
        <number>value
      );

      terms.push(newTerm);
    });

    return BaseTerm.createAndConcatTwoTerms<T>(terms[0], terms[1]);
  }

  static checkRule<T>(input: "waterLevel" | "waterTemperature", value: string) {
    if (input === "waterLevel") {
      switch (value) {
        case "low":
          return "high";
        case "medium":
          return "medium";
        case "high":
          return "low";
        default:
          return "off";
      }
    } else {
      switch (value) {
        case "low":
          return "high";
        case "medium":
          return "medium";
        case "high":
          return "low";
        default:
          return "moderate";
      }
    }
  }

  createMapWithDefaultModel(size: number, defaultModel: T) {
    const iterableArray = new Array(size)
      .fill(0)
      .map((item, iterator) => [iterator, Object.assign({}, defaultModel)]);

    // @ts-ignore
    return new Map(iterableArray);
  }

  fillTerm(
    startIndex: number,
    endIndex: number,
    key: keyof T,
    incrementValue: number,
    startValue?: number
  ) {
    let termValue = startValue || 1;

    for (let i = startIndex; i <= endIndex; i++) {
      const item = this.term.get(i);

      this.term.set(i, { ...item, [key]: +termValue.toFixed(1) });

      termValue += incrementValue === 1 ? 0 : incrementValue;
    }
  }

  setTermValue(index: number, term: keyof T, value: number) {
    const actualTerm = this.term.get(index);

    this.term.set(index, { ...actualTerm, [term]: value });
  }

  getTermValue(index: number) {
    const value = this.term.get(index);

    return Object.entries(value).reduce(
      (prev, [key, value]) => (value ? { ...prev, [key]: value } : prev),
      {}
    );
  }

  getTermLimitedByMaxValue(termName: keyof T, maxValue: number) {
    const termMap = new Map(this.term);

    termMap.forEach((value, key) => {
      const actualValue = termMap.get(key);

      termMap.set(
        key,
        this.clearOtherKeysAndSetMaxValue(actualValue, termName, maxValue)
      );
    });

    return BaseTerm.createFromMap<T>(termMap);
  }

  fuzzification() {
    let upper = 0;
    let down = 0;
    this.term.forEach((value, key) => {
      upper += <number>(<unknown>value) * +key;

      down += <number>(<unknown>value);
    });

    return upper / down;
  }

  displayDiagram(diagramLabel: string, labels: string[]) {
    const dataSets = labels.map((value, index) =>
      BaseTerm.createEmptyDataSet(value, this.DIAGRAM_COLORS[index])
    );

    const counter: string[] = [];

    this.term.forEach((value, key) => {
      counter.push(`${key}`);

      if (typeof value === "number") {
        dataSets[0].data.push(value);
      } else {
        Object.entries(value).forEach(([termName, termValue]) => {
          const setIndex = dataSets.findIndex(set => set.label === termName);

          if (setIndex || setIndex === 0) {
            dataSets[setIndex].data.push(termValue);
          }
        });
      }
    });

    this.createDiagram(counter, dataSets, diagramLabel);
  }

  private getDiagramsDiv() {
    const existingDiagramsDiv = document.getElementById(this.DIAGRAMS_DIV_ID);

    if (existingDiagramsDiv) {
      return existingDiagramsDiv;
    }

    const div = document.createElement("div");

    div.setAttribute("id", this.DIAGRAMS_DIV_ID);

    div.style.width = "50%";

    document.body.appendChild(div);

    return div;
  }

  private createDiagram(
    counter: string[],
    dataSets: any[],
    diagramLabel: string
  ) {
    let canvas: HTMLCanvasElement;

    let existingCanvas = document.querySelector<HTMLCanvasElement>(
      `canvas[data-display="${diagramLabel}"]`
    );

    if (existingCanvas) {
      canvas = existingCanvas;
    } else {
      canvas = document.createElement("canvas");

      canvas.setAttribute("data-display", diagramLabel);
    }

    const div = this.getDiagramsDiv();

    // div.innerHTML = "";

    div.appendChild(canvas);

    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: counter,
        datasets: dataSets
      },
      options: {
        title: {
          display: true,
          text: diagramLabel
        },
        animation: {
          duration: 0
        },
        elements: {
          line: {
            tension: 0 // disables bezier curves
          }
        }
      }
    });
  }

  private static createEmptyDataSet(label: string, color: string) {
    return {
      label: label,
      backgroundColor: color,
      borderColor: "rgb(255, 99, 132)",
      // @ts-ignore
      data: []
    };
  }

  private clearOtherKeysAndSetMaxValue(
    actualValue: T,
    termName: keyof T,
    maxValue: number
  ) {
    return Object.entries(actualValue)
      .map(([key, value]) => {
        let newValue = value;

        if (key !== termName) {
          newValue = 0;
        } else if (value > maxValue) {
          newValue = maxValue;
        }

        return [key, newValue];
      })
      .reduce((prev, [key, value]) => ({ ...prev, [key]: value }), {}) as T;
  }

  private static getValueDifferentThanZeroFromValue<T>(object: T): number {
    return Object.values(object).find(value => value) || 0;
  }
}
