// Character.js

import * as THREE from 'three';

export class Character {
  constructor() {
    // A group to hold our placeholder mesh
    this.group = new THREE.Group();

    // Create a simple cube to represent our character
    const geometry = new THREE.BoxGeometry(0.8, 1.8, 0.6); 
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    // Set the initial position of the character
    this.mesh.position.y = 0.9; // Half of the height (1.8 / 2 = 0.9)
    this.group.position.set(0, 1, 0); // Example: Set to origin (0, 0, 0)
    this.group.add(this.mesh);

    // Store rotation in Y, for left-right turning
    this.rotationY = 0;

    // Movement/rotation speeds
    this.moveSpeed = 3.0;
    this.turnSpeed = 3.0;
  }

  /**
   * Move forward/backward by `deltaDistance`.w
   * Positive means forward; negative means backward.
   */
  moveForward(deltaDistance) {
    const forward = new THREE.Vector3(
      Math.sin(this.rotationY),
      0,
      Math.cos(this.rotationY)
    );
    forward.multiplyScalar(deltaDistance);
    this.group.position.add(forward);
  }

  /**
   * Rotate around Y axis by `deltaAngle`.
   * Positive means turn left; negative means turn right.
   */
  turn(deltaAngle) {
    this.rotationY += deltaAngle;
    this.group.rotation.y = this.rotationY;
  }
}
