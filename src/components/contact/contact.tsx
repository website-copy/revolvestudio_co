import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { action, observable, runInAction } from "mobx";
import { FormModel } from "../forms/formModels";
import { Form } from "../forms/form";
import { FormSubmitButton } from "../forms/formSubmitButton";
import { FormInput } from "../forms/formInput";
import { RequireValidator } from "../forms/validators/validation";
import { FormErrorsSummary } from "../forms/formErrorsSummary";
import { FormDropdown } from "../forms/formDropdown";
import { FormTextarea } from "../forms/formTextarea";
import * as classNames from "classnames"
import axios from "axios";
import CustomSmoothScroll from "../smoothScroll/CustomSmoothScroll";
import { getWrappedRef } from "../../functions/getWrappedRef";

interface IMatchParams {}

interface IProps extends RouteComponentProps<IMatchParams> {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Contact extends React.Component<IProps> {
    ref: React.RefObject<CustomSmoothScroll>;

    viewModel: ViewModel;

    @observable success = false;
    @observable hidden = false;

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);

        this.ref = React.createRef();
        this.viewModel = new ViewModel();
    }

    @action
    onClose = () => {
        this.injected.uiStore.contactVisible = false;
    };

    @action
    onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.viewModel.file = event.target.files[0];
        //this.injected.roomStore.uploadTranscriptFile(this.props.record.Id, event.target.files[0]);
    };

    @action
    removeFile = () => {
        this.viewModel.file = null;
    }

    @action
    onSubmit = () => {
        this.success = true;
        getWrappedRef(this.ref).scrollToTop();

        setTimeout(() => {
            runInAction(() => {
                this.hidden = true
            })
        }, 200)

        const formData = new FormData();
        formData.append('Name', this.viewModel.name);
        formData.append('Email', this.viewModel.email);
        formData.append('Budget', this.viewModel.budget);
        formData.append('Interest', this.viewModel.interest);
        formData.append('Message', this.viewModel.message);
        formData.append('FormFile', this.viewModel.file);
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };

        axios.post('/home/SendEmail', formData, config)
    };

    public render() {
        return (
            <div className="full_screen">
                <div className="full_screen__wrapper">
                    <div className="close" onClick={this.onClose} />
                    <CustomSmoothScroll
                        ref={this.ref}
                        className="scrollbars"
                    >
                        <Form
                            model={this.viewModel.formModel}
                            submit={this.onSubmit}
                            className={classNames({
                                form: true,
                                "form--contact": true,
                                visible: !this.success,
                                hidden: this.hidden
                            })}
                        >
                            <div>
                                <h2>Have a project in mind?</h2>
                                <h6>
                                    Use the form below or{" "}
                                    <a href="mailto:info@revolvestudio.co">send us an email</a>
                                </h6>
                                <div className="form__field">
                                    <label htmlFor="name" className="no-float-label">
                                        <FormInput
                                            type="text"
                                            name="name"
                                            value={this.viewModel.name}
                                            onChanged={e => (this.viewModel.name = e)}
                                            validators={[
                                                new RequireValidator("Please enter your name")
                                            ]}
                                            placeholder="Name"
                                        />
                                    </label>
                                </div>
                                <div className="form__field">
                                    <label htmlFor="email" className="no-float-label">
                                        <FormInput
                                            className="form_ddl"
                                            type="text"
                                            name="email"
                                            value={this.viewModel.email}
                                            onChanged={e => (this.viewModel.email = e)}
                                            validators={[
                                                new RequireValidator("Please enter your email")
                                            ]}
                                            placeholder="Email"
                                        />
                                    </label>
                                </div>
                                <div className="form__field">
                                    <FormDropdown
                                        className="form_ddl"
                                        name="budget"
                                        options={[
                                            ["0", "$2000 - $5000"],
                                            ["1", "$5000 - $10000"],
                                            ["2", "$10000 - $15000"],
                                            ["3", "$15000 - $25000"],
                                            ["4", "Over $25000"]
                                        ]}
                                        onOptionSelected={e => this.viewModel.budget = e[1]}
                                        validators={[
                                            new RequireValidator("Please enter your email")
                                        ]}
                                        placeholder="Budget"
                                    />
                                </div>
                                <div className="form__field">
                                    <FormDropdown
                                        className="form_ddl"
                                        name="interest"
                                        options={[
                                            ["0", "Web Design / Development"],
                                            ["1", "Native App Design / Development "],
                                            ["2", "E - Commerce Design / Development"],
                                            ["3", "Other"]
                                        ]}
                                        onOptionSelected={e => this.viewModel.interest = e[1]}
                                        validators={[
                                            new RequireValidator("Please enter your email")
                                        ]}
                                        placeholder="I'm interested in"
                                    />
                                </div>
                                <div className="form__field no-float-label">
                                    <FormTextarea
                                        name="message"
                                        rows={3}
                                        value={this.viewModel.message}
                                        onChanged={e => (this.viewModel.message = e)}
                                        validators={[new RequireValidator("Please enter message")]}
                                        placeholder="Message"
                                    />
                                </div>
                                <FormErrorsSummary onlyRemote={true} />
                                <div className="popup__buttons">
                                    <FormSubmitButton
                                        isLoading={this.viewModel.isLoading}
                                        className="btn btn--white"
                                    >
                                        <span>Send</span>
                                    </FormSubmitButton>
                                    <div className="upload-btn-wrapper">
                                        <button type="button" className="btn_link" onClick={this.viewModel.file ? this.removeFile : null}>
                                            {this.viewModel.file
                                                ? this.viewModel.file.name
                                                : "Add File"}
                                            <img
                                                src={
                                                    this.viewModel.file
                                                        ? "/images/icn_minus.svg"
                                                        : "/images/icn_plus.svg"
                                                }
                                            />
                                        </button>
                                        {!this.viewModel.file && (
                                            <input
                                                type="file"
                                                name="myfile"
                                                accept="image/*|.doc|.zip|.pdf|.rar|.docx|.txt"
                                                onChange={this.onChangeHandler}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Form>
                        <div className={classNames({
                            form: true,
                            "form--success": true,
                            visible: this.success
                        })}>
                            <div>
                                <h2>We received your message</h2>
                                <h6>
                                    We'll be in touch
                                </h6>
                                <div className="underline">
                                    <div className="inner"></div>
                                </div>
                            </div>
                        </div>
                    </CustomSmoothScroll>
                </div>
            </div>
        );
    }
}

class ViewModel {
    @observable email: string = "";
    @observable name: string = "";
    @observable message: string = "";
    @observable budget: string = "";
    @observable interest: string = "";
    @observable isLoading = false;
    @observable file: File = null;

    public formModel: FormModel;

    constructor() {
        this.formModel = new FormModel();
    }
}
