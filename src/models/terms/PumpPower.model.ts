import { BaseTerm } from "./BaseTerm.model";
import { WaterTemperatureTerm } from "./WaterTemperature.model";
import { DefaultTerm } from "../../interfaces/DefaultTerm.interface";

const PUMP_POWER_TERM_SIZE = 21; // 20 + 0

export interface PumpPowerTerm extends DefaultTerm {
  off: 0 | 1;
}

export class PumpPower extends BaseTerm<PumpPowerTerm> {
  constructor() {
    super();

    this.term = this.createMapWithDefaultModel(PUMP_POWER_TERM_SIZE, {
      low: 0,
      medium: 0,
      high: 0,
      off: 0
    });

    this.fillLowTerm();
    this.fillMediumTerm();
    this.fillHighTerm();
    this.fillOffTerm();
  }

  private fillLowTerm() {
    const termValue: keyof WaterTemperatureTerm = "low";

    this.fillTerm(0, 1, termValue, 1);
    this.fillTerm(2, 6, termValue, -0.2, 0.8);
  }

  private fillMediumTerm() {
    const termValue: keyof WaterTemperatureTerm = "medium";

    this.fillTerm(5, 9, termValue, 0.2, 0.2);
    this.fillTerm(10, 14, termValue, -0.2, 0.8);
  }

  private fillHighTerm() {
    const termValue: keyof WaterTemperatureTerm = "high";

    this.fillTerm(13, 16, termValue, 0.2, 0.2);
    this.fillTerm(17, 19, termValue, 1);
  }

  private fillOffTerm() {
    const lastIndex = PUMP_POWER_TERM_SIZE - 1;

    this.setTermValue(lastIndex, "off", 1);
  }
}
