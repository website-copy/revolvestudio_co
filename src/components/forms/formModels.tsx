import * as React from "react";
import { Dictionary } from "lodash";
import { observable, computed } from "mobx";
import { isArray } from "util";

export class FormModel {
    @observable public validationErrors: ErrorsBag;
    @observable public remoteValidationErrors: ErrorsBag;
    @observable public success: boolean;
    @computed get isValid() {
        const hasLocalErrors = Object.keys(this.validationErrors.errors).length !== 0;
        const hasRemoteErrors = Object.keys(this.validationErrors.errors).length !== 0;

        return !(hasLocalErrors && hasRemoteErrors)
    }

    constructor() {
        this.validationErrors = new ErrorsBag();
        this.remoteValidationErrors = new ErrorsBag();
    }
}

export class FormContext {
    public model: FormModel
    // public errorsBag: ErrorsBag;
    // public externalErrorsBag: ErrorsBag;
    public inputs: IValidateable[];

    constructor(model: FormModel) {
        this.model = model;
        // this.errorsBag = new ErrorsBag();
        // this.externalErrorsBag = new ErrorsBag();
        this.inputs = [];
    }
}

export interface IValidateable {
    touched: boolean;
    validate: (formContext: FormContext) => void;
    revalidateOnFormUpdate: boolean;
}

export class ErrorsBag {
    @observable public errors: Dictionary<string[]>;

    constructor(errors?: Dictionary<string[]>) {
        if (errors) {
            this.errors = errors;
        } else {
            this.errors = {};
        }
    }

    public addError = (key: string, ...errors: string[]) => {
        if (this.errors[key] && isArray(this.errors[key])) {
            errors.forEach((e) =>  {
                if (this.errors[key].indexOf(e) == -1) {
                    this.errors[key].push(e);
                }
            })
            //this.errors[key].push(...errors)
        } else {
            this.errors[key] = errors
        }
    }

    public clearErrors = (key: string) => {
        this.errors[key] = new Array<string>();
    }

    public clearAllErrors = () => {
        this.errors = {}
    }

    public hasError = (key: string) => {
        if (this.errors[key] && isArray(this.errors[key])) {
            return this.errors[key].length !== 0
        }

        return false;
    }

    public mergeWith = (errorBag: ErrorsBag) => {
        Object.keys(errorBag.errors).forEach(key => {
            this.addError(key, ...errorBag.errors[key])
        })
    }
}

export const {
    Provider: FormProvider,
    Consumer: FormConsumer,
} = React.createContext<FormContext>({
    model: {
        validationErrors: new ErrorsBag(),
        remoteValidationErrors: new ErrorsBag(),
        isValid: true,
        success: false
    },
    inputs: []
});

export class FormPopoverViewModel {
    @observable private _active = false;
    public get active() {
        return this._active
    }

    public hidePopover = () => {
        if (this._active) {
            this._active = false
        }
    }

    public showPopover = () => {
        this._active = true
    }

    public togglePopover = () => {
        this._active = !this._active;
    }
}
