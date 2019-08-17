import { observable, computed, action } from "mobx";
import { Observer, observer } from "mobx-react";
import * as React from "react";
import { FormConsumer, FormContext, IValidateable } from "./formModels";
import { IValidator } from "./validators/validation";

interface IProps {
    className?: string;
    type: string;
    name: string;
    value: string;
    placeholder?: string;
    validators?: Array<IValidator<any>>;
    onChanged?: (value: string) => void;
    revalidateOnFormUpdate?: boolean;
    readOnly?: boolean;
    onFocus?: () => void;
}

interface InnerProps extends IProps {
    formContext: FormContext;
}

@observer
class _FormInput extends React.Component<InnerProps> implements IValidateable {
    @observable public touched: boolean = false;
    public revalidateOnFormUpdate: boolean;

    private inputRef: React.RefObject<HTMLInputElement>;

    static defaultProps = {
        className: ""
    }

    constructor(props: InnerProps) {
        super(props);

        this.inputRef = React.createRef();
    }

    @computed get isValid() {
        return !this.props.formContext.model.validationErrors.hasError(this.props.name) && !this.props.formContext.model.remoteValidationErrors.hasError(this.props.name);
    }

    public componentDidMount() {
        this.props.formContext.inputs.push(this);
        this.revalidateOnFormUpdate = this.props.revalidateOnFormUpdate ? true : false
    }

    public componentWillUnmount() {
        const index = this.props.formContext.inputs.indexOf(this);
        if (index !== -1) {
            this.props.formContext.inputs.splice(index, 1);
        }

        if (this.props.formContext.model) {
            this.props.formContext.model.validationErrors.clearErrors(this.props.name);
        }
    }

    public validate = (formContext: FormContext) => {
        if (this.touched) {
            this._validate(this.inputRef.current!.value, formContext);
        }
    };

    @action
    onChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.validate(this.props.formContext);
        if (this.props.onChanged) {
            this.props.onChanged(e.target.value);
        }
    }

    @action
    private onBlur = () => {
        this.touched = true;
        this.validate(this.props.formContext);
    }

    private _validate = (value: string, formContext: FormContext) => {
        formContext.model.success = false;
        formContext.model.validationErrors.clearErrors(this.props.name);
        formContext.model.remoteValidationErrors.clearErrors(this.props.name);
        if (this.props.validators) {
            this.props.validators.forEach(p => {
                const error = p.isValid(value);
                if (error !== "") {
                    formContext.model.validationErrors.addError(this.props.name, error);
                }
            });
        }
    };

    public render() {
        return (
            <input
                ref={this.inputRef}
                className={this.props.className +
                (!this.touched
                    ? ""
                    : this.isValid
                        ? ""
                        : " input-validation-error")
                }
                type={this.props.type}
                name={this.props.name}
                id={this.props.name}
                placeholder={this.props.placeholder}
                defaultValue={this.props.value}
                onBlur={this.onBlur}
                readOnly={this.props.readOnly}
                onChange={this.onChanged}
                onFocus={this.props.onFocus}
            />
        );
    }
}

export const FormInput = React.forwardRef<_FormInput, IProps>((props, ref) => (
    <FormConsumer>
        {formContext => (
            <Observer>
                {() => <_FormInput {...props} formContext={formContext} ref={ref} />}
            </Observer>
        )}
    </FormConsumer>
));
