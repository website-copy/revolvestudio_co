// import * as THREE from "three";
import { SceneManager, SceneSubject } from "./sceneManager";

import { EffectComposer } from "three/examples/js/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/js/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/js/postprocessing/ShaderPass";
import { FilmShader } from "three/examples/js/shaders/FilmShader";
import { CopyShader } from "three/examples/js/shaders/CopyShader";
import { FilmPass } from "three/examples/js/postprocessing/FilmPass";

import { GLTFLoader } from "three/examples/js/loaders/GLTFLoader";
import { UIStore } from "../stores/uiStore";
import { Vector3, Vector2, TextureLoader, Scene, PerspectiveCamera, WebGLRenderer, Clock, LoadingManager, Color, Fog, AmbientLight, PointLight, PCFSoftShadowMap, Raycaster, Euler, IcosahedronGeometry, sRGBEncoding, UniformsUtils, ShaderLib, ShaderMaterial, Mesh, BoxBufferGeometry, RepeatWrapping, MeshPhysicalMaterial } from "three";
import * as BezierEasing from "bezier-easing";
import { pageOffset } from "../functions/pageOffset";
import { runInAction } from "mobx";
// import * as THREE_ADDONS from 'three-addons';
// // import EffectComposer, {
// //   Pass,
// //   RenderPass,
// //   ShaderPass,
// //   TexturePass,
// //   ClearPass,
// //   MaskPass,
// //   ClearMaskPass,
// //   CopyShader,
// //   FilmPass
// // } from '@johh/three-effectcomposer';

export class IndexScene2 implements SceneManager {
    public canvas: HTMLCanvasElement;
    private scene: Scene;
    public camera: PerspectiveCamera;
    private renderer: WebGLRenderer;
    private clock: Clock;

    private sceneSubjects: Array<SceneSubject>;
    //mouseX: number = 0;
    windowHalfX: any;
    windowHalfY: any;
    //mouseY: number = 0;
    targetX: number;
    targetY: number;
    composer: EffectComposer;

    effect1 = new ShaderPass();
    shader = FilmShader;
    copyShader = CopyShader;
    colorPass: any;
    originalCameraRotation: THREE.Euler;
    modelLoader: GLTFLoader;
    uiStore: UIStore;

    cameraPosition: THREE.Vector3;
    cameraMoveToPosition: THREE.Vector3;
    cameraMoveTime: number;
    cameraMoveDuration: number;
    cameraMoveClock: THREE.Clock;
    previousCameraRotation: THREE.Euler;
    manager: THREE.LoadingManager;

    isSlideUp = false;
    isHideSphere = false;
    private easing = BezierEasing(0.5, 0.0, 0.08, 1.0);
    textureLoader: THREE.TextureLoader;
    raycaster: THREE.Raycaster;

    constructor(uiStore: UIStore, isSlideUp: boolean, hideSphere: boolean) {
        this.uiStore = uiStore;
        this.isSlideUp = isSlideUp;
        this.isHideSphere = hideSphere;
    }

    init(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.clock = new Clock();

        this.manager = new LoadingManager();
        this.textureLoader = new TextureLoader(this.manager);
        this.modelLoader = new GLTFLoader(this.manager);

        this.buildScene();
        this.buildCamera(window.innerWidth, window.innerHeight);
        this.buildRender(window.innerWidth, window.innerHeight);
        this.createSceneSubjects();

        this.manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        this.manager.onLoad = () => {
            console.log( 'Loading complete!');

            runInAction(() => {
                this.uiStore.sceneLoaded = true;
            })
        };


        this.manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        this.manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };
    }

    onWindowResize() {
        const { width, height } = this.canvas;

        this.windowHalfX = width / 2;
        this.windowHalfY = height / 2;
        //screenDimensions.width = width;
        //screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.composer.setSize(width, height);
    }



    buildScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0x232323);
        this.scene.fog = new Fog(0x232323, 45, 80);

        const ambientLight = new AmbientLight(0x848484);
        this.scene.add(ambientLight);

        const light = new PointLight(0xffffff, 2, 40);
        light.position.set(-10, 20, 0);
        light.castShadow = true;

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 1024; // default
        light.shadow.mapSize.height = 1024; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 100; // default

        this.scene.add(light);
    }

    buildRender(width: number, height: number) {
        this.windowHalfX = width / 2;
        this.windowHalfY = height / 2;

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        //const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        //this.renderer.setPixelRatio(DPR);
        this.renderer.setSize(width, height);

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFSoftShadowMap;

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;
        this.renderer.gammaFactor = 2.2;

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.setSize(width, height);

        this.colorPass = new ShaderPass(filmGrainShader);
        this.colorPass.renderToScreen = true;
        this.colorPass.uniforms["strength"].value = 10.0;
        this.composer.addPass(this.colorPass);

        this.raycaster = new Raycaster();
    }

    buildCamera(width: number, height: number) {
        this.camera = new PerspectiveCamera(23, width / height, 0.1, 2000);
        //this.camera.matrixAutoUpdate = true;

        this.cameraPosition = new Vector3(0, 30, 50);
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);

        this.camera.lookAt(0, 5, 3);
        this.originalCameraRotation = new Euler(
            this.camera.rotation.x,
            this.camera.rotation.y,
            this.camera.rotation.z
        );
        this.previousCameraRotation = this.originalCameraRotation.clone();

        if (this.isSlideUp) {
            this.cameraPosition = new Vector3(0, 25.5, 50);
        }

        this.cameraMoveToPosition = this.cameraPosition.clone();
        this.camera.position.set(this.cameraPosition.x, this.cameraPosition.y, this.cameraPosition.z);
        // this.camera.rotation.x = 0;
        // this.camera.rotation.y = 0;

        //this.controls = new OrbitControls( this.camera );
    }

    createSceneSubjects() {
        this.sceneSubjects = new Array<SceneSubject>();

        this.sceneSubjects.push(new SphereSubject(this.scene, this));
        this.sceneSubjects.push(new Floor(this.scene, this));
        this.sceneSubjects.push(new Mountains(this.scene, this));
        //this.sceneSubjects.push(new Astronaut(this.scene, this.loader));
    }

    moveCamera = (to: THREE.Vector3, duration: number) => {
        this.cameraPosition = this.camera.position.clone();
        this.cameraMoveToPosition = to;
        this.cameraMoveClock = new Clock();
        this.cameraMoveDuration = duration;
        //this.cameraMoveTime = this.clock.getElapsedTime();
        //this.cameraMoveDuration = this.cameraMoveTime + duration / 1000.0;
    }

    slideUp = () => {
        this.isSlideUp = true;

        this.moveCamera(new Vector3(0, 25.5, 50), 800);
    }

    slideDown = () => {
        this.isSlideUp = false;

        this.moveCamera(new Vector3(0, 30, 50), 800);
    }

    hideSphere = () => {
        this.isHideSphere = true;
    }

    showSphere = () => {
        this.isHideSphere = false;
    }

    update() {
        if (this.uiStore.scrollPosition < window.innerHeight) {
            const delta = this.clock.getDelta();
            const elapsedTime = this.clock.getElapsedTime();

            if (!this.isSlideUp) {
                this.targetX = -this.uiStore.mouse.shx * 0.0001;
                this.targetY = -this.uiStore.mouse.shy * 0.0001;
            } else {
                this.targetX = -this.uiStore.mouse.shx * 0.00001;
                this.targetY = -this.uiStore.mouse.shy * 0.00001;
            }

            if (!this.isSlideUp) {
                this.raycaster.setFromCamera( {x: this.uiStore.mouse.scx, y: -this.uiStore.mouse.scy}, this.camera );
            }

            this.scene.rotation.x += 0.02 * (-this.targetY*2.0 - this.scene.rotation.x);
            //this.scene.rotation.y += 0.01 * (this.targetX - this.scene.rotation.y);
            this.scene.rotation.z += 0.02 * (this.targetX*2.0 - this.scene.rotation.z);

            // this.camera.rotation.x += 0.01 * (this.targetY - this.camera.rotation.x);
            // this.camera.rotation.y += 0.01 * (this.targetX - this.camera.rotation.y);

            if (!this.camera.position.equals(this.cameraMoveToPosition)) {
                const time = this.cameraMoveClock.getElapsedTime() / (this.cameraMoveDuration / 1000);
                if (time > 1.0) {
                    this.camera.position.set(this.cameraMoveToPosition.x, this.cameraMoveToPosition.y, this.cameraMoveToPosition.z);
                } else {
                    //const cubicTime = this.qerp(time, 0.5, 0.0, 0.08, 1.0);
                    const cubicTime = this.easing(time);
                    const newPosition = this.cameraPosition.clone().lerp(this.cameraMoveToPosition, cubicTime);
                    this.camera.position.set(newPosition.x, newPosition.y, newPosition.z);
                }
            }

            this.camera.lookAt(0, 5, 3);
            // const lengthX = this.previousCameraRotation.x - (this.camera.rotation.x + this.targetY);
            // const lengthY = this.previousCameraRotation.y - (this.camera.rotation.y + this.targetX);

            // this.camera.rotation.x = this.previousCameraRotation.x - (0.01 * lengthX);
            // this.camera.rotation.y = this.previousCameraRotation.y - (0.01 * lengthY);

            // this.previousCameraRotation.copy(this.camera.rotation);

            for (let i = 0; i < this.sceneSubjects.length; i++)
                this.sceneSubjects[i].update(elapsedTime, {
                    targetX: this.targetX,
                    targetY: this.targetY,
                    menuHover: this.uiStore.menuHover,
                    isSlideUp: this.isSlideUp
                });

            //this.renderer.render(this.scene, this.camera);
            this.colorPass.uniforms["time"].value += delta;
            this.composer.render(delta);
        }
    }
}

class SphereSubject implements SceneSubject {
    appScene: IndexScene2;
    mesh: THREE.Mesh;
    texture: THREE.Texture;
    material: THREE.ShaderMaterial;
    textureEquirec: THREE.Texture;
    radGradient: THREE.Texture;
    initialPosition: THREE.Vector3;
    holdPosition: THREE.Vector3;

    zeroVector = new Vector3(0, 0, 0);

    constructor(scene: THREE.Scene, appScene: IndexScene2) {
        this.appScene = appScene;
        const geometry = new IcosahedronGeometry(4, 5);
        //const material = new THREE.MeshPhysicalMaterial( { color: 0x444444, roughness: 0.5, metalness: 0, reflectivity: 0.4, clearCoat: 0, } );

        // this.textureEquirec = this.appScene.textureLoader.load(
        //   "/images/textures/envmap.png",
        //   loaded => {
        //     this.material.uniforms.envMap = { value: this.textureEquirec };
        //     this.material.needsUpdate = true;
        //   }
        // );
        // this.textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        // this.textureEquirec.magFilter = THREE.LinearFilter;
        // this.textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
        // this.textureEquirec.encoding = THREE.sRGBEncoding;

        this.radGradient = this.appScene.textureLoader.load(
            "/images/textures/rad_gradient.jpg",
            loaded => {
                this.material.uniforms.emissiveMap = { value: this.radGradient };
                this.material.needsUpdate = true;
            }
        );
        this.radGradient.encoding = sRGBEncoding;

        var customUniforms = UniformsUtils.merge([
            ShaderLib.physical.uniforms,
            {
                diffuse: { value: new Color(0x111111) },
                roughness: { value: 0.8 },
                time: { value: 0.0 },
                // map: { value: this.texture },
                // envMap: { value: this.textureEquirec },
                opacity: { value: 0.2 },
                transparent: { value: true },
                clearCoat: { value: 0.2 },
                clearCoatRoughness: { value: 0.8 },
                displacementBias: { value: 0.0 },
                displacementScale: { value: 1.0 },
                emissiveMap: { value: this.radGradient },
                emissive: { value: new Color(0xffffff) },
                emissiveIntensity: { value: 10.0 },
                pulseFrequency: { value: 1.0 },
                pulsePhase: {value: 0.0},
                opacityOverride: {value: 0.0},
                mouse: { value: new Vector3(0,0,0) }
            }
        ]);

        this.material = new ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: noiseDisplacementShader.vertexShader,
            fragmentShader: noiseDisplacementShader.fragmentShader,
            lights: true,
            fog: true,
            defines: {
                PHYSICAL: "",
                USE_ENVMAP: "",
                ENVMAP_MODE_REFRACTION: "",
                ENVMAP_TYPE_EQUIREC: "",
                USE_EMISSIVEMAP: ""
            },
            transparent: true
        });
        this.material.depthWrite=false

        this.mesh = new Mesh(geometry, this.material);
        this.mesh.castShadow = true;
        //this.mesh.receiveShadow = true;
        this.mesh.rotateX(-10);

        this.initialPosition = new Vector3(0, 5, 3);

        this.mesh.position.set(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z);

        this.mesh.scale.x = 0.8;
        this.mesh.scale.y = 0.8;
        this.mesh.scale.z = 0.8;

        scene.add(this.mesh);

        this.holdPosition = this.initialPosition.clone();
    }

    update(
        elapsedTime: number,
        params: { targetX: number; targetY: number; menuHover: boolean; isSlideUp: boolean }
    ) {
        // this.camera.rotation.x += 0.01 * (this.targetY - this.camera.rotation.x + this.originalCameraRotation.x) ;
        // this.camera.rotation.y += 0.01 * (this.targetX - this.camera.rotation.y + this.originalCameraRotation.y) ;

        const initialPosition = new Vector3(0, 5, 3);
        if (params.isSlideUp) {
            var vector = new Vector3(0, 5, 3);

            const { width, height } = this.appScene.canvas;
            var widthHalf = (width/2);
            var heightHalf = (height/2);
            vector.project(this.appScene.camera);
            vector.x = ( vector.x * widthHalf ) + widthHalf;
            vector.y = - ( vector.y * heightHalf ) + heightHalf
            const offset = pageOffset(height);
            const desired = heightHalf - offset;

            vector.y = desired;

            vector.x = ( vector.x - widthHalf ) / widthHalf;
            vector.y = - ( vector.y - heightHalf ) / heightHalf;

            vector.unproject(this.appScene.camera);
            if (!isNaN(vector.x)) {
                initialPosition.copy(vector);
            }
        }

        if (!params.isSlideUp) {
            this.mesh.position.x +=
                0.02 * (initialPosition.x - this.mesh.position.x);
            this.mesh.position.y +=
                0.02 * (initialPosition.y - this.mesh.position.y);
            this.mesh.position.z +=
                0.02 * (initialPosition.z - this.mesh.position.z);
        } else {
            this.mesh.position.x +=
                0.03 * (initialPosition.x - this.mesh.position.x);
            this.mesh.position.y +=
                0.03 * (initialPosition.y - this.mesh.position.y);
            this.mesh.position.z +=
                0.03 * (initialPosition.z - this.mesh.position.z);
        }

        // if (!params.isSlideUp) {
        //   this.mesh.position.x +=
        //     0.02 * (-params.targetX * 5 - this.mesh.position.x + initialPosition.x);
        //   this.mesh.position.y +=
        //     0.02 * (params.targetY * 5 - this.mesh.position.y + initialPosition.y);
        //   this.mesh.position.z +=
        //     0.02 * (initialPosition.z - this.mesh.position.z);
        // } else {
        //   this.mesh.position.x +=
        //     0.02 * (-params.targetX * 5 - this.mesh.position.x + initialPosition.x);
        //   this.mesh.position.y +=
        //     0.02 * (params.targetY * 5 - this.mesh.position.y + initialPosition.y);
        //   this.mesh.position.z +=
        //     0.02 * (initialPosition.z - this.mesh.position.z);
        // }

        this.material.uniforms.time.value = elapsedTime;

        const length = Math.sqrt(
            params.targetX * params.targetX + params.targetY * params.targetY
        );
        const scaleFactor = 1.3 - length * 2.0;

        this.mesh.scale.x += 0.05 * (scaleFactor - this.mesh.scale.x);
        this.mesh.scale.y += 0.05 * (scaleFactor - this.mesh.scale.y);
        this.mesh.scale.z += 0.05 * (scaleFactor - this.mesh.scale.z);

        let intersects = [];
        if (!params.isSlideUp) {
            intersects = this.appScene.raycaster.intersectObject(this.mesh);
        }

        if (intersects.length > 0) {
            let currentPos = this.material.uniforms.mouse.value as THREE.Vector3;

            currentPos.x += 0.05 * (intersects[0].point.x - currentPos.x);
            currentPos.y += 0.05 * (intersects[0].point.y - currentPos.y);
            currentPos.z += 0.05 * (intersects[0].point.z - currentPos.z);

            this.material.uniforms.mouse.value = currentPos;
        } else {
            let currentPos = this.material.uniforms.mouse.value as THREE.Vector3;

            currentPos.x += 0.01 * (this.zeroVector.x - currentPos.x);
            currentPos.y += 0.01 * (this.zeroVector.y - currentPos.y);
            currentPos.z += 0.01 * (this.zeroVector.z - currentPos.z);

            this.material.uniforms.mouse.value = currentPos;
        }

        //this.material.uniforms.displacementScale.value = 1.0 - length*5;
        if (!params.isSlideUp) {
            this.material.uniforms.displacementScale.value +=
                0.05 * (1.0 - length * 2 - this.material.uniforms.displacementScale.value);
            this.material.uniforms.opacityOverride.value += 0.1 * (0.0 - this.material.uniforms.opacityOverride.value);
        } else {
            this.material.uniforms.displacementScale.value += 0.05 * (0.0 - this.material.uniforms.displacementScale.value);
            this.material.uniforms.opacityOverride.value += 0.1 * (0.8 - this.material.uniforms.opacityOverride.value);
        }

        const newPulseFreq = params.menuHover ? 6.0 : 1.0;
        if (this.material.uniforms.pulseFrequency.value !== newPulseFreq) {
            const curr = (elapsedTime * this.material.uniforms.pulseFrequency.value + this.material.uniforms.pulsePhase.value) % (2.0 * Math.PI);
            const next = (elapsedTime * newPulseFreq) % (2.0 * Math.PI);

            this.material.uniforms.pulsePhase.value = curr - next;
            this.material.uniforms.pulseFrequency.value = newPulseFreq;
        }

        if (this.appScene.isHideSphere) {
            this.material.uniforms.opacity.value += 0.1 * (0.0 - this.material.uniforms.opacity.value);
        } else {
            this.material.uniforms.opacity.value += 0.1 * (0.2 - this.material.uniforms.opacity.value);
        }
    }
}

class Floor implements SceneSubject {
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, appScene: IndexScene2) {
        const geometry = new BoxBufferGeometry(2000, 0.1, 2000);
        const texture = appScene.textureLoader.load("/images/textures/plus.png");
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(700, 700);

        const material = new MeshPhysicalMaterial({
            map: texture,
            color: 0x808080,
            roughness: 0.8,
            metalness: 0,
            reflectivity: 0,
            clearCoat: 0
        });
        this.mesh = new Mesh(geometry, material);

        this.mesh.position.y = -7;
        this.mesh.rotateY(45);
        this.mesh.receiveShadow = true;

        scene.add(this.mesh);
    }

    update(elapsedTime: number) {}
}

class Mountains implements SceneSubject {
    appScene: IndexScene2;
    mesh: THREE.Mesh;

    constructor(scene: THREE.Scene, appScene: IndexScene2) {
        this.appScene = appScene;
        const material = new MeshPhysicalMaterial({
            color: 0x010101,
            roughness: 0.5,
            metalness: 0
        });


        appScene.modelLoader.load(
            // resource URL
            "/objects/mount_2.glb",
            function(gltf) {
                const mesh = gltf.scene as THREE.Mesh;
                const land = mesh.children[0].children[0]  as THREE.Mesh;

                //land.castShadow = true;
                //mesh.receiveShadow = true;
                land.material = material;
                mesh.scale.set(5, 5, 5);
                mesh.rotation.y = -0.9;

                mesh.position.y = -7;
                mesh.position.z = 1.5;
                mesh.position.x = -1;
                scene.add(mesh);
            }
        );
    }

    update(elapsedTime: number) {}
}

const filmGrainShader = {
    uniforms: {
        tDiffuse: { value: null },
        time: { value: 10.0 },
        strength: { value: 1.0 }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    #include <common>

    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float strength;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      float x = (vUv.x + 4.0 ) * (vUv.y + 4.0 ) * (time * 10.0);
      vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
  
      gl_FragColor = color + grain;
    }
  `
};
const noiseDisplacementShader = {
    uniforms: {},
    vertexShader: `

    varying float noise;
    varying float displacement;
    uniform float displacementScale;
    uniform float displacementBias;
    uniform float time;
    uniform float pulseFrequency;
    uniform float pulsePhase;
    uniform vec3 mouse;

    #define PHYSICAL
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
      #ifdef USE_TANGENT
        varying vec3 vTangent;
        varying vec3 vBitangent;
      #endif
    #endif
    #include <common>
    #include <uv_pars_vertex>
    #include <uv2_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v)
    { 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
    i = mod289(i); 
    vec4 p = permute( permute( permute( 
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

    void main() {
      

      #include <uv_vertex>
      #include <uv2_vertex>
      #include <color_vertex>
      #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
      #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED
        vNormal = normalize( transformedNormal );
        #ifdef USE_TANGENT
          vTangent = normalize( transformedTangent );
          vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
        #endif
      #endif
      #include <begin_vertex>
      #include <morphtarget_vertex>
      #include <skinning_vertex>
      #include <displacementmap_vertex>

      // The world poisition of your vertex: NO CAMERA
      //vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      float scale = 3.0;
      displacement = 0.0;
      noise = 0.0;

      if (displacementScale != 0.0) {
        vec4 orgWorldPosition = modelMatrix * vec4( transformed, 1.0 );

        noise = snoise(vec3(vNormal.x + cos(time * 0.2), vNormal.y + sin(time * 0.2), vNormal.z) * scale)*.5+.5;
        displacement = noise;
        displacement += 1.0 - smoothstep(0.0, 1.0, distance(mouse, orgWorldPosition.xyz)*0.3);
      }

      transformed += normalize(objectNormal) * (displacement * displacementScale);

      #include <project_vertex>
      #include <logdepthbuf_vertex>
      #include <clipping_planes_vertex>
      vViewPosition = - mvPosition.xyz;
      #include <worldpos_vertex>
      #include <shadowmap_vertex>
      #include <fog_vertex>

     
    }
  `,
    fragmentShader: `
    varying float noise;
    varying float displacement;
    uniform float displacementScale;
    uniform float time;
    uniform float opacityOverride;

    #define PHYSICAL
    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float roughness;
    uniform float metalness;
    uniform float opacity;
    #ifndef STANDARD
      uniform float clearCoat;
      uniform float clearCoatRoughness;
    #endif
    varying vec3 vViewPosition;
    #ifndef FLAT_SHADED
      varying vec3 vNormal;
      #ifdef USE_TANGENT
        varying vec3 vTangent;
        varying vec3 vBitangent;
      #endif
    #endif
    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <uv2_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <bsdfs>
    #include <cube_uv_reflection_fragment>
    #include <envmap_pars_fragment>
    #include <envmap_physical_pars_fragment>
    #include <fog_pars_fragment>
    #include <lights_pars_begin>
    #include <lights_physical_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <roughnessmap_pars_fragment>
    #include <metalnessmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>
    void main() {
      #include <clipping_planes_fragment>

      vec4 diffuseColor = vec4( diffuse, opacity );
      diffuseColor = vec4(
        (diffuseColor + (displacement * displacementScale * 2.0)).rgb,
        diffuseColor.a * (displacement * displacementScale * 2.0) + opacityOverride
      );

      ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
      vec3 totalEmissiveRadiance = emissive;
      #include <logdepthbuf_fragment>
      #include <map_fragment>
      #include <color_fragment>
      #include <alphamap_fragment>
      #include <alphatest_fragment>
      #include <roughnessmap_fragment>
      #include <metalnessmap_fragment>
      #include <normal_fragment_begin>
      #include <normal_fragment_maps>

      normal = normalize(normal + (displacement * displacementScale));

      #include <emissivemap_fragment>
      // accumulation
      #include <lights_physical_fragment>
      #include <lights_fragment_begin>
      #include <lights_fragment_maps>
      #include <lights_fragment_end>
      // modulation
      #include <aomap_fragment>

      totalEmissiveRadiance = totalEmissiveRadiance + (displacement * displacementScale / 4.0);

      vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
      gl_FragColor = vec4( outgoingLight, diffuseColor.a );
      #include <tonemapping_fragment>
      #include <encodings_fragment>
      #include <fog_fragment>
      #include <premultiplied_alpha_fragment>
      #include <dithering_fragment>

      //gl_FragColor = texture2D(map, vUv.xy);
    }
  `
};
