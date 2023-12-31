import * as THREE from 'three'
import Experience from './Experience.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
      this.experience = new Experience()
      this.sizes = this.experience.sizes
      this.scene = this.experience.scene
      this.canvas = this.experience.canvas

      this.maxFOV = 85

      this.setInstance()
      this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.maxFOV, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(1, 1, 1)

        /* ORTHOGRAPHIC CAMERA */
        // this.instance = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 5 );
        // this.instance.position.set(0, 0, 1)
        this.scene.add(this.instance)
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
        this.controls.enablePan = false;
        this.controls.enableZoom = true;
        this.controls.minDistance = 2.5;
        this.controls.maxDistance = 3.8;
        this.controls.minAzimuthAngle = -Math.PI / 4 + 0.2;
        this.controls.maxAzimuthAngle = (Math.PI * 3) / 4 - 0.2;
        this.controls.minPolarAngle = Math.PI / 4;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}