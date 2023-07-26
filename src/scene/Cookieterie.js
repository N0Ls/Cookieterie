import * as THREE from 'three';
import Experience from '../Experience.js'

export default class Cookieterie
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.resource = this.resources.items.cookieterie
        this.sizes = this.experience.sizes

    }

    init(){
        this.setModel()
        this.setMaterials()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.scene.add(this.model)
    }

    setMaterials()
    {
        console.log(this.model)
        this.bakedTexture = this.resources.items.bakedCookieTexture
        this.bakedTexture.flipY = false;
        this.bakedTexture.colorSpace = THREE.SRGBColorSpace
        this.bakedMaterial = new THREE.MeshBasicMaterial({
            map: this.resources.items.bakedCookieTexture,
        });
        this.model.traverse((child) => {
            child.material = this.bakedMaterial;
        });

        const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

        const computerScreenMaterial = new THREE.MeshBasicMaterial({ color: 0x707070 });

        const glassMaterial = new THREE.MeshPhysicalMaterial({
            roughness: 0,
            transmission: 1,
            thickness: 0.01,
        });

        const glowDoorMesh = this.model.children.find(
            (child) => child.name === "GlowDoor"
        );
        const glowWindowMesh = this.model.children.find(
            (child) => child.name === "GlowWindow"
        );
        const cookieWindowMesh = this.model.children.find(
            (child) => child.name === "CookieWindow"
        );
        const cookieWindowMesh2 = this.model.children.find(
            (child) => child.name === "CookieWindow2"
        );
        const computerScreenMesh = this.model.children.find(
            (child) => child.name === "ComputerScreen"
        );
        this.experience.raycastTargetMesh = this.model.children.find(
            (child) => child.name === "RaycastTarget"
        );
        this.experience.cameraInPosition = this.model.children.find(
            (child) => child.name === "CameraInPos"
        );
        this.experience.cameraOutPosition = this.model.children.find(
            (child) => child.name === "CameraOutPos"
        );
        this.experience.cameraInTarget = this.model.children.find(
            (child) => child.name === "CameraTargetInPos"
        );
        this.experience.cameraOutTarget = this.model.children.find(
            (child) => child.name === "CameraTargetOutPos"
        );
    
        glowDoorMesh.material = poleLightMaterial;
        glowWindowMesh.material = poleLightMaterial;
        computerScreenMesh.material = computerScreenMaterial;
        cookieWindowMesh.material = glassMaterial;
        cookieWindowMesh2.material = glassMaterial;

        this.experience.raycastTargetMesh.material = new THREE.MeshBasicMaterial();
        this.experience.raycastTargetMesh.material.transparent = true;
        this.experience.raycastTargetMesh.material.visible = false;

        this.experience.camera.controls.target.set(
            this.experience.cameraOutTarget.position.x,
            this.experience.cameraOutTarget.position.y,
            this.experience.cameraOutTarget.position.z
        )
        this.experience.camera.instance.position.set(
            this.experience.cameraOutPosition.position.x,
            this.experience.cameraOutPosition.position.y,
            this.experience.cameraOutPosition.position.z
        )
    }
}