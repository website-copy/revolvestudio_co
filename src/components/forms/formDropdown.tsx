import { observable, computed, action } from "mobx";
import { Observer, observer } from "mobx-react";
import * as React from "react";
import {
    FormConsumer,
    FormContext,
    IValidateable,
    FormPopoverViewModel
} from "./formModels";
import { IValidator } from "./validators/validation";
import posed, { PoseGroup } from "react-pose";

const document = require("global/document");

interface IProps {
    className?: string;
    name: string;
    options: Array<[string, string]>;
    selected?: string;
    placeholder?: string;
    onOptionSelected: (option: [string, string]) => void;
    validators?: Array<IValidator<any>>;
    revalidateOnFormUpdate?: boolean;
    renderAsSelect?: boolean;
}

interface InnerProps extends IProps {
    formContext: FormContext;
}

@observer
class _FormDropdown extends React.Component<InnerProps>
    implements IValidateable {
    private viewModel: DropdownViewModel;
    ref: React.RefObject<HTMLDivElement>;

    @observable public touched: boolean = false;
    public revalidateOnFormUpdate: boolean;

    private inputRef: React.RefObject<HTMLInputElement & HTMLSelectElement>;

    constructor(props: InnerProps) {
        super(props);

        this.inputRef = React.createRef();
        this.ref = React.createRef();

        this.viewModel = new DropdownViewModel();
        this.viewModel.options = props.options;

        this.viewModel.selected = props.selected;
    }

    @computed get isValid() {
        return (
            !this.props.formContext.model.validationErrors.hasError(
                this.props.name
            ) &&
            !this.props.formContext.model.remoteValidationErrors.hasError(
                this.props.name
            )
        );
    }

    handleClick = e => {
        if (this.ref.current && this.ref.current.contains(e.target)) {
            return;
        }

        this.viewModel.hidePopover();
    };

    public componentDidMount() {
        document.addEventListener("mousedown", this.handleClick, false);

        this.props.formContext.inputs.push(this);
        this.revalidateOnFormUpdate = this.props.revalidateOnFormUpdate
            ? true
            : false;
    }

    public componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClick, false);

        const index = this.props.formContext.inputs.indexOf(this);
        if (index !== -1) {
            this.props.formContext.inputs.splice(index, 1);
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

    private onPress = () => {
        this.viewModel.togglePopover();
    };

    @action
    private onOptionSelected = (option: [string, string]) => {
        this.viewModel.selected = option[0];
        this.props.onOptionSelected(option);
        this.viewModel.hidePopover();
    };

    @action
    private onSelectOptionSelected = (value: string) => {
        this.viewModel.selected = value;
        const option = this.viewModel.options.find(p => p[0] === value)!;
        this.props.onOptionSelected(option);
    };

    Item = posed.ul({
        enter: { opacity: 1, height: "auto" },
        exit: { opacity: 1, height: 0 }
    });

    public render() {
        return this.props.renderAsSelect ? (
            <select
                name={this.props.name}
                value={this.viewModel.selected}
                className={this.props.className}
                ref={this.inputRef}
                onChange={(e) => this.onSelectOptionSelected(e.target.value)}
            >
                {this.viewModel.options.map(item => (
                    <option
                        value={item[0]}
                        key={item[0]}
                    >
                        {item[1]}
                    </option>
                ))}
            </select>
        ) : (
            <React.Fragment>
                <input
                    type="hidden"
                    ref={this.inputRef}
                    name={this.props.name}
                    defaultValue={this.viewModel.selected}
                />
                <div
                    ref={this.ref}
                    className={
                        (this.viewModel.active ? "custom_ddl active" : "custom_ddl") +
                        " " +
                        this.props.className +
                        (!this.touched ? "" : this.isValid ? "" : " input-validation-error")
                    }
                >
          <span onClick={this.onPress}>
            {this.viewModel.selectedValue || this.props.placeholder}
          </span>
                    <this.Item pose={this.viewModel.active ? "enter" : "exit"}>
                        {this.viewModel.options.map(item => (
                            <li
                                key={item[0]}
                                onClick={() => this.onOptionSelected(item)}
                                className={this.viewModel.selected === item[0] ? "active" : ""}
                            >
                                {item[1]}
                            </li>
                        ))}
                    </this.Item>
                </div>
            </React.Fragment>
        );
    }
}

export const FormDropdown = React.forwardRef<_FormDropdown, IProps>(
    (props, ref) => (
        <FormConsumer>
            {formContext => (
                <Observer>
                    {() => (
                        <_FormDropdown {...props} formContext={formContext} ref={ref} />
                    )}
                </Observer>
            )}
        </FormConsumer>
    )
);

class DropdownViewModel extends FormPopoverViewModel {
    @observable public options: Array<[string, string]>;
    @observable public selected?: string;

    @computed get selectedValue(): string {
        if (this.selected !== undefined) {
            const selectedTuple = this.options.find(
                item => item[0] === this.selected
            );
            if (selectedTuple) {
                const sel = this.options.find(item => item[0] === this.selected);
                if (sel) {
                    return sel[1];
                }
            }
        }

        return "";
    }
}
