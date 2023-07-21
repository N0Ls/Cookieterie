import Experience from './Experience.js';
import CookiePlane from './scene/CookiePlane.js';
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on('ready', () => {
      this.cookiePlane = new CookiePlane();
      //this.lighting = new Lighting();

      this.init()
    });
  }

  init() {
    this.cookiePlane.init();
  }

}