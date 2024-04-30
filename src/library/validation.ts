import { CustomError } from "./custom-error";

const Validator = require("validatorjs");
Validator.register(
  "validSAID",
  function (value: string | null, requirement: string, attribute: string) {
    if (value === null) {
      return false;
    }

    const regex =
      /^([0-9][0-9])([0][1-9]|[1][0-2])([0-2][0-9]|[3][0-1])([0-9])([0-9]{3})([0-9])([0-9])([0-9])$/;
    const regexValid = regex.test(value);
    if (!regexValid) {
      return false;
    }
    console.log(value);

    const validator = parseInt(value.charAt(12), 10);
    let oddTotal = 0;
    let evenNumber = "";
    for (let n = 0; n <= 11; n++) {
      if ((n + 1) % 2 === 0) {
        evenNumber += value.charAt(n);
      } else {
        oddTotal += parseInt(value.charAt(n), 10);
      }
    }
    let evenTotal = parseInt(evenNumber, 10) * 2;
    let evenTotalString = evenTotal.toString();
    let totalB = 0;
    for (let n = 0; n <= evenTotalString.length - 1; n++) {
      totalB += parseInt(evenTotalString.charAt(n), 10);
    }
    let totalC = oddTotal + totalB;
    let lastDigit = parseInt(totalC.toString().slice(-1), 10);
    if (lastDigit !== 0) {
      lastDigit = 10 - lastDigit;
    }

    return validator === lastDigit;
  },
  "The :attribute field is not a valid South African ID number."
);
export class Validation {
  constructor() {}
  isValidData(body: any, rules: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.validate(body, rules, {}, (err: any, passed: boolean) => {
        if (err) {
          reject(new CustomError("Invalid data", 412, err.errors));
        } else {
          resolve(passed);
        }
      });
    });
  }
  private validate(body: any, rules: any, customMessages: any, callback: any) {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
  }
  isSAID(id: string) {
    const regex =
      /^([0-9][0-9])([0][1-9]|[1][0-2])([0-2][0-9]|[3][0-1])([0-9])([0-9]{3})([0-9])([0-9])([0-9])$/;
    const regexValid = regex.test(id);

    if (!regexValid) {
      return false;
    }

    const validator = parseInt(id.charAt(12), 10);

    let oddTotal = 0;
    let evenNumber = "";

    for (let n = 0; n <= 11; n++) {
      if ((n + 1) % 2 === 0) {
        evenNumber += id.charAt(n);
      } else {
        oddTotal += parseInt(id.charAt(n), 10);
      }
    }

    let evenTotal = parseInt(evenNumber, 10) * 2;
    let evenTotalString = evenTotal.toString();
    let totalB = 0;

    for (let n = 0; n <= evenTotalString.length - 1; n++) {
      totalB += parseInt(evenTotalString.charAt(n), 10);
    }

    let totalC = oddTotal + totalB;
    let lastDigit = parseInt(totalC.toString().slice(-1), 10);

    if (lastDigit !== 0) {
      lastDigit = 10 - lastDigit;
    }

    if (validator === lastDigit) {
      return true;
    } else {
      return false;
    }
  }
}
