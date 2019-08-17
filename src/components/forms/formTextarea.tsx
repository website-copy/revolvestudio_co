import { observable, computed, action } from "mobx";
import { Observer, observer } from "mobx-react";
import * as React from "react";
import { FormConsumer, FormContext, IValidateable } from "./formModels";
import { IValidator } from "./validators/validation";

interface IProps {
    className?: string;
    cols?: number;
    rows?: number;
    name: string;
    value: string;
    placeholder?: string;
    validators?: Array<IValidator<any>>;
    onChanged?: (value: string) => void;
    revalidateOnFormUpdate?: boolean;
}

interface InnerProps extends IProps {
    formContext: FormContext;
}

@observer
class _FormTextarea extends React.Component<InnerProps> implements IValidateable {
    public static defaultProps: Partial<IProps> = {
        cols: 30,
        rows: 10
    };

    @observable public touched: boolean = false;
    public revalidateOnFormUpdate: boolean;

    private inputRef: React.RefObject<HTMLTextAreaElement>;

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
    }

    @action
    onChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.validate(this.props.formContext);
        if (this.props.onChanged) {
            this.props.onChanged(e.target.value);
        }
    }

    @action
    public validate = (formContext: FormContext) => {
        this.touched = true;
        this._validate(this.inputRef.current!.value, formContext);
    };

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
            <textarea
                ref={this.inputRef}
                className={this.props.className + (
                    !this.touched
                        ? ""
                        : this.isValid
                        ? ""
                        : " input-validation-error")
                }
                cols={this.props.cols}
                rows={this.props.rows}
                name={this.props.name}
                id={this.props.name}
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={this.onChanged}
            />
        );
    }
}

export const FormTextarea = React.forwardRef<_FormTextarea, IProps>((props, ref) => (
    <FormConsumer>
        {formContext => (
            <Observer>
                {() => <_FormTextarea {...props} formContext={formContext} ref={ref} />}
            </Observer>
        )}
    </FormConsumer>
));
