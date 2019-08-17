//import { parseNumber } from "libphonenumber-js";

export interface IValidator<T> {
    isValid(value: T): string;
}

export class RequireValidator implements IValidator<string> {
    public message: string;
    constructor(message: string) {
        this.message = message;
    }

    public isValid(value: string) {
        const isValid = value !== undefined && value !== null && value !== "";
        return isValid ? "" : this.message;
    }
}

export class NumberValidator implements IValidator<string> {
    public message: string;
    constructor(message: string) {
        this.message = message;
    }

    public isValid(value: string) {
        const isValid = !isNaN(parseFloat(value));
        return isValid ? "" : this.message;
    }
}

export class EmailValidator implements IValidator<string> {
    public message: string;
    constructor(message: string) {
        this.message = message;
    }

    public isValid(value: string) {
        if (value === "" || value === undefined || value === null) {
            return "";
        }

        const isValid = value.indexOf("@") !== -1;
        return isValid ? "" : this.message;
    }
}

export class MinLengthValidator implements IValidator<string> {
    public message: string;
    public length: number;

    constructor(message: string, length: number) {
        this.message = message;
        this.length = length;
    }

    public isValid(value: string) {
        if (value === undefined || value === null) { return "" };

        const isValid = value.length >= this.length;
        return isValid ? "" : this.message;
    }
}

export class CompareValidator implements IValidator<string> {
    public message: string;
    public compareWith: string;

    constructor(message: string, compareWith: string) {
        this.message = message;
        this.compareWith = compareWith;
    }

    public isValid(value: string) {
        const isValid = this.compareWith === value;
        return isValid ? "" : this.message;
    }
}

export class PhoneValidator implements IValidator<string> {
    public message: string;
    public country: string;

    constructor(message: string, country: string) {
        this.message = message;
        this.country = country;
    }

    public isValid(value: string) {
        if (value === "") { return "" };

        // const phoneValidationResult = parseNumber(value, "DE");
        // const isValid = Object.keys(phoneValidationResult).length !== 0;
        // return isValid ? "" : this.message;
        return "";
    }
}

export class PasswordValidator implements IValidator<string> {
    public lowerCharMessage: string;
    public upperCharMessage: string;
    public numCharMessage: string;

    constructor(
        lowerCharMessage: string,
        upperCharMessage: string,
        numCharMessage: string
    ) {
        this.lowerCharMessage = lowerCharMessage;
        this.upperCharMessage = upperCharMessage;
        this.numCharMessage = numCharMessage;
    }

    public isValid(value: string) {
        if (value === "") { return "" };

        const lowerRegex = new RegExp("(?=.*[a-z])");
        const upperRegex = new RegExp("(?=.*[A-Z])");
        const numericRegex = new RegExp("(?=.*[0-9])");

        if (!lowerRegex.test(value)) {
            return this.lowerCharMessage;
        }

        if (!upperRegex.test(value)) {
            return this.upperCharMessage;
        }

        if (!numericRegex.test(value)) {
            return this.numCharMessage;
        }

        return "";
    }
}
