import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { ErrorsBag, FormContext, FormModel, FormProvider } from "./formModels";

interface IProps {
    className?: string;
    model: FormModel;
    submit: () => void;
    validate?: () => ErrorsBag;
    autoComplete?: string;
}

@observer
export class Form extends React.Component<IProps> {

    private viewModel: ViewModel;

    constructor(props: IProps) {
        super(props);

        this.viewModel = new ViewModel(this.props.model);
    }

    public componentDidUpdate() {
        // console.log(this.viewModel.formContext)
        this.viewModel.formContext.inputs.forEach(input => {
            if (input.revalidateOnFormUpdate) {
                input.validate(this.viewModel.formContext);
            }
        })

        // if (this.props.externalErrors) {
        //   this.viewModel.formContext.externalErrorsBag.mergeWith(this.props.externalErrors)
        // }
    }

    private onSubmit = (e: React.FormEvent) => {
        this.viewModel.formContext.inputs.forEach(input => {
            input.touched = true;
            input.validate(this.viewModel.formContext);
        })

        if (this.props.validate) {
            this.viewModel.formContext.model.validationErrors.mergeWith(this.props.validate());
        }

        if (this.viewModel.isValid) {
            this.props.submit();
        }

        e.preventDefault();
        return false;
    }

    public render() {
        return (
            <form
                autoComplete={this.props.autoComplete}
                className={this.props.className}
                onSubmit={(e) => this.onSubmit(e)}>
                <FormProvider value={this.viewModel.formContext}>
                    {this.props.children}
                </FormProvider>
            </form>

        )
    }
}

class ViewModel {

    private model: FormModel;
    public formContext: FormContext;

    constructor(model: FormModel) {
        this.model = model;
        this.formContext = new FormContext(model);
    }

    @computed get isValid() {
        let valid = true;
        Object.keys(this.formContext.model.validationErrors.errors).forEach(key => {
            if (this.formContext.model.validationErrors.errors[key].length !== 0) {
                valid = false
            }
        })

        return valid;
    }
}
