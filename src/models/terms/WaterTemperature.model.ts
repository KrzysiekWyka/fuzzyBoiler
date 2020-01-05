import { BaseTerm } from "./BaseTerm.model";
import { DefaultTerm } from "../../interfaces/DefaultTerm.interface";

export interface WaterTemperatureTerm extends DefaultTerm {
  fine: 0 | 1;
}

export class WaterTemperature extends BaseTerm<WaterTemperatureTerm> {
  public static readonly WATER_TEMPERATURE_TERM_SIZE = 71;

  constructor() {
    super();

    this.term = this.createMapWithDefaultModel(
      WaterTemperature.WATER_TEMPERATURE_TERM_SIZE,
      {
        low: 0,
        medium: 0,
        high: 0,
        fine: 0
      }
    );

    this.fillLowTerm();
    this.fillMediumTerm();
    this.fillHighTerm();
    this.fillFineTerm();
  }

  private fillLowTerm() {
    const termValue: keyof WaterTemperatureTerm = "low";

    this.fillTerm(0, 14, termValue, 1);
    this.fillTerm(15, 23, termValue, -0.1, 0.9);
  }

  private fillMediumTerm() {
    const termValue: keyof WaterTemperatureTerm = "medium";

    this.fillTerm(18, 26, termValue, 0.1, 0.1);
    this.fillTerm(27, 56, termValue, 1);
    this.fillTerm(57, 65, termValue, -0.1, 0.9);
  }

  private fillHighTerm() {
    const termValue: keyof WaterTemperatureTerm = "high";

    this.fillTerm(55, 63, termValue, 0.1, 0.1);
    this.fillTerm(64, 69, termValue, 1);
  }

  private fillFineTerm() {
    const lastIndex = WaterTemperature.WATER_TEMPERATURE_TERM_SIZE - 1;
    const actualValue = this.term.get(lastIndex);

    this.term.set(lastIndex, { ...actualValue, fine: 1 });
  }
}
