import { DefaultTerm } from "../../interfaces/DefaultTerm.interface";
import { BaseTerm } from "./BaseTerm.model";

export interface HeatingLevelTerm extends DefaultTerm {
  moderate: 0 | 1;
}

export class HeatingLevel extends BaseTerm<HeatingLevelTerm> {
  public readonly HEATING_LEVEL_TERM_SIZE = 11;

  constructor() {
    super();

    this.term = this.createMapWithDefaultModel(this.HEATING_LEVEL_TERM_SIZE, {
      low: 0,
      medium: 0,
      high: 0,
      moderate: 0
    });

    this.fillLowTerm();
    this.fillMediumTerm();
    this.fillHighTerm();
    this.fillModerateTerm();
  }

  private fillLowTerm() {
    this.fillTerm(0, 2, "low", -0.4, 1);
  }

  private fillMediumTerm() {
    const termValue: keyof HeatingLevelTerm = "medium";

    this.fillTerm(1, 2, termValue, 0.4, 0.2);
    this.fillTerm(3, 5, termValue, 1);
    this.fillTerm(6, 7, termValue, -0.4, 0.6);
  }

  private fillHighTerm() {
    const termValue: keyof HeatingLevelTerm = "high";

    this.fillTerm(6, 7, termValue, 0.4, 0.4);
    this.fillTerm(8, 9, termValue, 1);
  }

  private fillModerateTerm() {
    this.setTermValue(10, "moderate", 1);
  }
}
