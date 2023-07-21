import * as THREE from 'three';
import Experience from '../Experience.js'

import cookieVertexShader from "../shaders/cookie/vertex.glsl";
import cookieFragmentShader from "../shaders/cookie/fragment.glsl";

export default class CookiePlane
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.sizes = this.experience.sizes
        this.gui = this.experience.gui

    }

    init(){
        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setGUI()
    }

    setGeometry()
    {
        this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    }

    setTextures()
    {
        this.texture = this.resources.items.cookieTexture
        this.texture.colorSpace = THREE.LinearSRGBColorSpace
        this.texture.SRGBColorSpace = true
        this.texture.magFilter = THREE.NearestFilter
    }

    setMaterial()
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uTexture: { value: this.texture },
                uIndex: { value: 0 },
                uRatio: { value: 7 },
            },
            vertexShader: cookieVertexShader,
            fragmentShader: cookieFragmentShader,
            side: THREE.DoubleSide,
        })
        this.material.wireframe = false
        this.material.needsUpdate = true
    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.y = Math.PI * 0.25;
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.rotation.z = Math.PI * 0.5;
        this.mesh.scale.set(0.35, 0.35, 0.35);
        this.scene.add(this.mesh)
        console.log(this.experience.raycastTargetMesh.position )
        this.mesh.position.set(
            this.experience.raycastTargetMesh.position.x + 0.01,
            this.experience.raycastTargetMesh.position.y + 0.01,
            this.experience.raycastTargetMesh.position.z
        );
    }

    setGUI()
    {

    }


}