// ThirdPersonControls.js
import * as THREE from 'three';

export class ThirdPersonControls {
  constructor(camera, character, domElement) {
    this.camera = camera;
    this.character = character;
    this.domElement = domElement;

    // This "target" property is updated each frame to reflect
    // the character's position (so that external code that references this.controls.target works).
    this.target = new THREE.Vector3().copy(this.character.group.position);

    // Keyboard state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };

    // Mouse/orbit state
    this.mouse = {
      isDragging: false,
      lastX: 0,
      lastY: 0,
    };

    // Yaw/pitch for orbiting the camera around the character
    // We start with something like a mild pitch and no yaw
    this.yaw = 0;
    this.pitch = 10 * THREE.MathUtils.DEG2RAD; // about 10 degrees
    this.pitchMin = -80 * THREE.MathUtils.DEG2RAD; // clamp pitch to avoid flipping camera
    this.pitchMax = 80 * THREE.MathUtils.DEG2RAD;

    // Distance from character
    this.cameraDistance = 5; // how far the camera should stay from the character

    // Speeds for movement/turning
    this.rotateSpeed = 2.0;
    this.moveSpeed = 2.0;

    // Attach event listeners
    this._addKeyboardListeners();
    this._addMouseListeners();
  }

  dispose() {
    // No-op, so that calls to `this.controls.dispose()` won't break anything
  }

  _addKeyboardListeners() {
    window.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    window.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.code) {
      case 'KeyW':
        this.keys.forward = true;
        break;
      case 'KeyS':
        this.keys.backward = true;
        break;
      case 'KeyA':
        this.keys.left = true;
        break;
      case 'KeyD':
        this.keys.right = true;
        break;
      default:
        break;
    }
  }

  _onKeyUp(event) {
    switch (event.code) {
      case 'KeyW':
        this.keys.forward = false;
        break;
      case 'KeyS':
        this.keys.backward = false;
        break;
      case 'KeyA':
        this.keys.left = false;
        break;
      case 'KeyD':
        this.keys.right = false;
        break;
      default:
        break;
    }
  }

  _addMouseListeners() {
    // Here we track left-mouse dragging for orbit. Adjust for your preference.
    this.domElement.addEventListener('pointerdown', (e) => this._onPointerDown(e), false);
    this.domElement.addEventListener('pointermove', (e) => this._onPointerMove(e), false);
    this.domElement.addEventListener('pointerup', (e) => this._onPointerUp(e), false);

    // Prevent context menu so right-click drag can be used if desired
    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault(), false);
  }

  _onPointerDown(event) {
    if (event.button === 0) { // left button
      this.mouse.isDragging = true;
      this.mouse.lastX = event.clientX;
      this.mouse.lastY = event.clientY;
    }
  }

  _onPointerMove(event) {
    if (!this.mouse.isDragging) return;

    const deltaX = event.clientX - this.mouse.lastX;
    const deltaY = event.clientY - this.mouse.lastY;
    this.mouse.lastX = event.clientX;
    this.mouse.lastY = event.clientY;

    // Adjust yaw/pitch based on mouse movement
    const rotSpeed = 0.005; // mouse sensitivity
    this.yaw -= deltaX * rotSpeed;
    this.pitch -= deltaY * rotSpeed;

    // Clamp pitch so camera doesn't flip
    this.pitch = Math.max(this.pitchMin, Math.min(this.pitchMax, this.pitch));
  }

  _onPointerUp(event) {
    if (event.button === 0) { // left button
      this.mouse.isDragging = false;
    }
  }

  update(deltaTime) {
    // 1) Handle WASD movement of the character
    if (this.keys.forward) {
      this.character.moveForward(this.character.moveSpeed * deltaTime);
    }
    if (this.keys.backward) {
      this.character.moveForward(-this.character.moveSpeed * deltaTime);
    }
    if (this.keys.left) {
      this.character.turn(this.character.turnSpeed * deltaTime);
    }
    if (this.keys.right) {
      this.character.turn(-this.character.turnSpeed * deltaTime);
    }

    // 2) Update camera to orbit around character based on yaw/pitch
    this._updateCamera();

    // 3) Update .target so external code referencing controls.target sees the new center
    this.target.copy(this.character.group.position);
  }

  _updateCamera() {
    // We'll convert yaw/pitch into a direction vector for the camera
    // Start with a vector pointing "forward" (down -Z)
    const offset = new THREE.Vector3(0, 0, -1);

    // Apply the pitch around X, then yaw around Y:
    // (Could also do an Euler or a Quaternion here.)
    const pitchQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.pitch);
    const yawQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);

    // Combine them, then apply to offset
    offset.applyQuaternion(yawQ).applyQuaternion(pitchQ);

    // Scale offset by our desired distance
    offset.multiplyScalar(this.cameraDistance);

    // The camera’s final position is character position + offset
    const desiredPos = new THREE.Vector3().copy(this.character.group.position).add(offset);
    this.camera.position.copy(desiredPos);

    // Aim at the character’s position (slightly above to see the top)
    const lookAtPos = new THREE.Vector3().copy(this.character.group.position);
    lookAtPos.y += 1.0;

    this.camera.lookAt(lookAtPos);
  }
}
