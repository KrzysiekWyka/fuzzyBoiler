import { BaseTerm } from "./BaseTerm.model";
import { DefaultTerm } from "../../interfaces/DefaultTerm.interface";

export interface WaterLevelTerm extends DefaultTerm {
  enough: 1 | 0;
}

export class WaterLevel extends BaseTerm<WaterLevelTerm> {
  public static readonly WATER_LEVEL_TERM_SIZE = 81;

  constructor() {
    super();

    this.term = this.createMapWithDefaultModel(
      WaterLevel.WATER_LEVEL_TERM_SIZE,
      {
        low: 0,
        medium: 0,
        high: 0,
        enough: 0
      }
    );

    this.fillLowTerm();
    this.fillMediumTerm();
    this.fillHighTerm();
    this.fillEnoughTerm();
  }

  private fillLowTerm() {
    const termValue: keyof WaterLevelTerm = "low";

    this.fillTerm(0, 20, termValue, 1);
    this.fillTerm(21, 29, termValue, -0.1, 0.9);
  }

  private fillMediumTerm() {
    const termValue: keyof WaterLevelTerm = "medium";

    this.fillTerm(25, 33, termValue, 0.1, 0.1);
    this.fillTerm(34, 50, termValue, 1);
    this.fillTerm(51, 59, termValue, -0.1, 0.9);
  }

  private fillHighTerm() {
    const termValue: keyof WaterLevelTerm = "high";

    this.fillTerm(56, 64, termValue, 0.1, 0.1);
    this.fillTerm(65, 79, termValue, 1);
  }

  private fillEnoughTerm() {
    const lastIndex = WaterLevel.WATER_LEVEL_TERM_SIZE - 1;
    const actualValue = this.term.get(lastIndex);

    this.term.set(lastIndex, { ...actualValue, enough: 1 });
  }
}
