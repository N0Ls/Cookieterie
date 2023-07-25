import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap";

import World from "./World.js";
import Camera from "./Camera.js";
import Time from "./utils/Time.js";
import Sizes from "./utils/Sizes.js";
import Renderer from "./Renderer.js";
import Resources from "./utils/Resources.js";

import sources from "./sources.js";

import cookieDB from "./cookies.json";

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    window.experience = this;

    // Variables
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    this.resources = new Resources(sources);

    this.world = new World();

    this.init();

    this.numberOfCookies = 36;

    this.isInCookieSelection = false;

    this.cameraInPosition = new THREE.Vector3();
    this.cameraOutPosition = new THREE.Vector3();
    this.cameraInTarget = new THREE.Vector3();
    this.cameraOutTarget = new THREE.Vector3();

    this.raycastTargetMesh = new THREE.Mesh();

    this.disableRaycast = false;

    this.mouseStart = new THREE.Vector2();
    this.mouseEnd = new THREE.Vector2();

    this.cookieMaterialRef = null;

    this.isWheelSpinning = false;

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });

    // add mouse down event
    window.addEventListener("mousedown", (event) => {
      this.mouseStart.x = event.clientX;
      this.mouseStart.y = event.clientY;
    });

    // add mouse up event
    window.addEventListener("mouseup", (event) => {
      this.mouseEnd.x = event.clientX;
      this.mouseEnd.y = event.clientY;

      if (this.mouseStart.distanceTo(this.mouseEnd) < 1) {
        if (this.disableRaycast) {
          this.disableRaycast = false;
        }
      } else {
        this.disableRaycast = true;
      }
    });

    //Create raycaster and cast on click
    const raycaster = new THREE.Raycaster();

    //cast on click
    window.addEventListener("click", (event) => {
      if (this.disableRaycast) return;
      //mouse position
      const mouse = new THREE.Vector2(
        (event.clientX / this.sizes.width) * 2 - 1,
        -(event.clientY / this.sizes.height) * 2 + 1
      );

      raycaster.setFromCamera(mouse, this.camera.instance);

      const intersects = raycaster.intersectObjects(this.scene.children, true);
      //console.log(intersects);

      if (intersects.length > 0) {
        if (this.isInCookieSelection) {
          gsap.to(this.camera.instance.position, {
            x: this.cameraOutPosition.position.x,
            y: this.cameraOutPosition.position.y,
            z: this.cameraOutPosition.position.z,
            duration: 1,
            ease: "power2.inOut",
          });
          gsap.to(this.camera.controls.target, {
            x: this.cameraOutTarget.position.x,
            y: this.cameraOutTarget.position.y,
            z: this.cameraOutTarget.position.z,
            duration: 0.5,
            ease: "power2.inOut",
          });
          gsap.to(this.camera.instance, {
            fov: 75,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
              this.camera.instance.updateProjectionMatrix();
            }
          });
          console.log(this.camera.instance)
          this.camera.controls.enableRotate = true;
          this.isInCookieSelection = false;
          this.selectionDiv.style.opacity = 0;
          //controls.enabled = false;
        } else if (intersects[0].object.name === "RaycastTarget") {
          gsap.to(this.camera.instance.position, {
            x: this.cameraInPosition.position.x,
            y: this.cameraInPosition.position.y + 1,
            z: this.cameraInPosition.position.z,
            duration: 1,
            ease: "power2.inOut",
          });
          gsap.to(this.camera.controls.target, {
            x: this.cameraInTarget.position.x,
            y: this.cameraInTarget.position.y,
            z: this.cameraInTarget.position.z,
            duration: 0.5,
            ease: "power2.inOut",
          });
          gsap.to(this.camera.instance, {
            fov: 35,
            duration: 1,
            ease: "power2.inOut",
            onUpdate: () => {
              this.camera.instance.updateProjectionMatrix();
            }
          });
          this.camera.controls.enableRotate = false;
          this.isInCookieSelection = true;
          this.selectionDiv.style.opacity = 1;
          //controls.enabled = true;
        }

        //randomPick();
      }
    });

    this.randomButton = document.querySelector('.randomCookieButton');
    this.randomButton.addEventListener('click', (event) => {
        event.stopPropagation()
        this.randomPick();
    });

    this.selectedCookieText = document.querySelector('.selectedCookie');
    this.selectionDiv = document.querySelector('.selectionDiv');
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }

  init() {
    const isDebug = true;
    if (isDebug) {
      this.initGUI();
    }
  }

  initGUI() {
    this.gui = new dat.GUI();

    const functionButton = {
      doSomething: () => {
        this.randomPick();
      },
    };
    this.gui.add(functionButton, "doSomething").name("Function Button");

    //this.gui.close();
  }

  randomPick = () => {
    this.selectedCookieText.innerHTML = "Picking...";
    if(this.isWheelSpinning) return;
    this.isWheelSpinning = true;
    const cookieIndex = Math.floor(Math.random() * this.numberOfCookies);
    console.log("Pick = " + cookieIndex);

    const indexObject = { index: this.cookieMaterialRef.uniforms.uIndex.value };

    gsap.to(indexObject, {
      keyframes: [
        {
          index: this.numberOfCookies,
          duration: 3,
        },
        {
          index: cookieIndex + this.numberOfCookies,
          duration: 2,
        },
      ],
      ease: "power2.inOut",
      onUpdate: () => {
        this.cookieMaterialRef.uniforms.uIndex.value =
          indexObject.index % this.numberOfCookies;
      },
      onComplete: () => {
        console.log(cookieDB.cookies[cookieIndex].name);
        this.selectedCookieText.innerHTML = cookieDB.cookies[cookieIndex].name;
        this.isWheelSpinning = false;
      },
    });
  };

  onDoSomething() {
    console.log("Do something");
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.renderer.destroy();

    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
    
        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    instance = null;

    const isDebug = true;
    if (isDebug) {
      if (this.gui.active) this.gui.ui.destroy();
    }
  }
}
