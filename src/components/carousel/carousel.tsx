import { inject } from "mobx-react";
import * as React from "react";
import { RouteComponentProps, NavLink, Link } from "react-router-dom";
import { observerWithRouter } from "../../functions/observerWithRouter";
import { UIStore } from "../../stores/uiStore";
import { observable, action, runInAction } from "mobx";
import * as classNames from "classnames";

interface IMatchParams {}

interface IProps {}

interface IInjectedProps {
    uiStore: UIStore;
}

@inject("uiStore")
@observerWithRouter
export class Carousel extends React.Component<IProps> {
    @observable transition = false;
    @observable index = 0;
    @observable beforeAfter = 0;
    @observable images = [0, 1, 2];

    get injected() {
        return (this.props as unknown) as IInjectedProps;
    }

    constructor(props: any) {
        super(props);
    }

    @action
    next = () => {
        if (!this.transition) {
            this.index = this.index + 1 <= 2 ? this.index + 1 : 0;
            this.transition = true;
            this.beforeAfter = 1;

            setTimeout(() => {
                var nImages = this.images.slice(1, 3);
                nImages.push(this.images[0]);

                runInAction(() => {
                    this.transition = false;
                    this.images = nImages;
                    this.beforeAfter = 0;
                });
            }, 1100);
        }
    };

    @action
    showProject = () => {
        if (this.index === 0) {
            this.injected.uiStore.portfolioVisible = true;
            this.injected.uiStore.artstelVisible = true;
        } else if (this.index === 1) {
            this.injected.uiStore.portfolioVisible = true;
            this.injected.uiStore.bloomVisible = true;
        } else if (this.index === 2) {
            this.injected.uiStore.portfolioVisible = true;
            this.injected.uiStore.bravaVisible = true;
        }
    };

    componentDidMount() {}

    componentWillUnmount() {}

    public render() {
        return (
            <div className="page__block__carousel">
                <div className="page__block__grid">
                    <div className="w_400 tablet_portrait_hide">
                        <div className="page__block__title page__block__title--no_name appear_on_scroll">
                            03 /
                        </div>
                    </div>
                    <div className="w_410">
                        <div className="page__block__name appear_on_scroll">Work</div>
                        <div className="page__block__title appear_on_scroll">
                            Digital products that are human at heart
                        </div>
                    </div>
                </div>
                <div className="page__block__gallery">
                    <div className="icn_next">
                        <img
                            src={"/images/icn_gal_next.svg"}
                        />
                    </div>
                    <div
                        className={classNames({
                            gallery__wrapper: true,
                        })}
                    >
                        {this.images.map((imgIndex, index) => (
                            <div
                                key={imgIndex + "_" + index}
                                className={classNames({
                                    gallery__image: true,
                                    active: this.index === imgIndex,
                                    before: index < this.beforeAfter,
                                    current: index === this.beforeAfter && !this.transition
                                })}
                                style={{zIndex: this.images.length - index}}
                                onClick={this.index === imgIndex ? this.showProject : this.next}
                            >
                                <div className="gallery__image__wrapper">
                                    <picture>
                                        <source srcSet={`/images/img_project_${imgIndex}.jpg`} media="(min-width: 720px)" />
                                        <img src={`/images/img_project_${imgIndex}_small.jpg`} />
                                    </picture>
                                    {/* <img
                    srcSet={`/images/img_project_${imgIndex}_small.jpg 900w, /images/img_project_${imgIndex}.jpg 1900w`}
                    //src={`/images/img_project_${imgIndex}_small.jpg`}
                    sizes="min-width: 720px 1900px, 900px"
                  /> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // public render() {
    //   return (
    //     <div className="page__block__carousel">
    //       <div className="page__block__grid">
    //         <div className="w_400 tablet_portrait_hide">
    //           <div className="page__block__title page__block__title--no_name appear_on_scroll">
    //             03 /
    //           </div>
    //         </div>
    //         <div className="w_410">
    //           <div className="page__block__name appear_on_scroll">Work</div>
    //           <div className="page__block__title appear_on_scroll">
    //             Making products very simple to use
    //           </div>
    //         </div>
    //       </div>
    //       <div className="page__block__gallery">
    //         <div className="icn_next">
    //           <img
    //             src={"/images/icn_gal_next.svg"}
    //           />
    //         </div>
    //         <div
    //           className={classNames({
    //             gallery__wrapper: true,
    //             forward: this.transition
    //           })}
    //         >
    //           {this.images.map((imgIndex, index) => (
    //             <div
    //               key={imgIndex + "_" + index}
    //               className={classNames({
    //                 gallery__image: true,
    //                 active: this.index === imgIndex,
    //                 before: index < this.beforeAfter,
    //                 after: index > this.beforeAfter,
    //                 current: index === this.beforeAfter && !this.transition
    //               })}
    //               onClick={this.index === imgIndex ? this.showProject : this.next}
    //             >
    //               <div className="gallery__image__wrapper">
    //                 <img
    //                   className={classNames({
    //                     active: this.index === imgIndex,
    //                     before: index < this.beforeAfter,
    //                     after: index > this.beforeAfter
    //                   })}
    //                   src={`/images/img_project_${imgIndex}.jpg`}
    //                   //style={{backgroundImage: `url('/images/img_project_${imgIndex}.jpg')`}}
    //                 />
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }
}
