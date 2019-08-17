import * as React from "react";
import { SceneManager } from "../../scenes/sceneManager";

interface IProps {
    scene: SceneManager
    className?: string;
}

export class Three extends React.Component<IProps> {
    ref: React.RefObject<HTMLDivElement>;
    canvas: React.RefObject<HTMLCanvasElement>;

    sceneManager: SceneManager;
    rAF: number;

    constructor(props: IProps) {
        super(props);

        this.sceneManager = this.props.scene;

        this.ref = React.createRef();
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.sceneManager.init(this.canvas.current);
        this.resizeCanvas();
        this.renderScene();

        window.addEventListener("resize", this.resizeCanvas);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rAF);
        window.removeEventListener("resize", this.resizeCanvas);
    }

    resizeCanvas = () => {
        this.canvas.current.style.width = '100%';
        this.canvas.current.style.height= '100%';
        this.canvas.current.width = this.canvas.current.offsetWidth;
        this.canvas.current.height = this.canvas.current.offsetHeight;
        this.sceneManager.onWindowResize();
    }

    renderScene = (time?) => {
        //stats.begin();
        this.sceneManager.update();
        //stats.end();
        this.rAF = requestAnimationFrame(this.renderScene);
    }

    render () {
        return (
            <div className={this.props.className} ref={this.ref}>
                <canvas ref={this.canvas}/>
            </div>
        );
    }
}
