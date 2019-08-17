import { Observer, observer } from "mobx-react";
import * as React from "react";
import { FormConsumer, FormContext } from "./formModels";
import posed, { PoseGroup } from "react-pose";

interface IProps {
    onlyRemote?: boolean;
}

export class FormErrorsSummary extends React.Component<IProps> {
    public static defaultProps: Partial<IProps> = {
        onlyRemote: false,
    };

    public externalErrorsWithServerKey = (formContext: FormContext): string[] => {
        return formContext.model.remoteValidationErrors.errors["server"] || [];
    };

    Item = posed.div({
        enter: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 }
    });

    public render() {
        return (
            <FormConsumer>
                {formContext => (
                    <Observer>
                        {() => (
                            <div className="form_errors">
                                {Object.keys(formContext.model.validationErrors.errors).map(key => (
                                    <React.Fragment key={key}>
                                        {formContext.model.validationErrors.errors[key].length !== 0 && !this.props.onlyRemote && (
                                            <div className="form_errors__error">
                                                {formContext.model.validationErrors.errors[key].map(error => (
                                                    <div key={error}>{error}</div>
                                                ))}
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                                <PoseGroup animateOnMount={true}>
                                    {this.externalErrorsWithServerKey(formContext).map(error => (
                                        <this.Item className="form_errors__error" key={error}>
                                            {error}
                                        </this.Item>
                                    ))}
                                </PoseGroup>
                            </div>
                        )}
                    </Observer>
                )}
            </FormConsumer>
        );
    }
}
