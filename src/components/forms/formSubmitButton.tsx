import { observer, Observer } from "mobx-react";
import * as React from "react";
import { FormConsumer, FormContext } from "./formModels";

interface IProps {
    isLoading: boolean;
    className?: string;
    disabled?: boolean;
}

@observer
export class FormSubmitButton extends React.Component<IProps> {
    ref: React.RefObject<HTMLButtonElement>;
    constructor(props: IProps) {
        super(props);

        this.ref = React.createRef();
    }

    preserveWidth = () => {
        this.ref.current!.style.minWidth = this.ref.current!.clientWidth + "px"
    }

    componentDidUpdate() {
        if (this.props.isLoading) {
            this.ref.current!.style.minWidth = ""
        } else {
            this.ref.current!.style.minWidth = ""
        }
    }

    public render() {
        return (
            <FormConsumer>
                {formContext => (
                    <Observer>
                        {() => (
                            <React.Fragment>
                                <button
                                    ref={this.ref}
                                    type="submit"
                                    onClick={this.preserveWidth}
                                    disabled={this.props.disabled}
                                    className={
                                        this.props.className +
                                        (this.props.isLoading ? " disabled" : "")
                                    }
                                >
                                    {this.props.isLoading ? (
                                        <img
                                            className="progress"
                                            src="/images/icn_spinner.svg"
                                        />
                                    ) : (
                                        this.props.children
                                    )}
                                </button>
                            </React.Fragment>
                        )}
                    </Observer>
                )}
            </FormConsumer>
        );
    }
}
