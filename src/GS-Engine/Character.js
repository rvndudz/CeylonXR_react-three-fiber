// Character.js

import * as THREE from 'three';

export class Character {
  constructor() {
    // A group to hold our placeholder mesh
    this.group = new THREE.Group();

    // Create a simple cube to represent our character
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);

    this.group.add(this.mesh);

    // Store rotation in Y, for left-right turning
    this.rotationY = 0;

    // Movement/rotation speeds
    this.moveSpeed = 2.0;
    this.turnSpeed = 2.0;
  }

  /**
   * Move forward/backward by `deltaDistance`.
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
