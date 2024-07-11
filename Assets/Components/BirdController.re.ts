import * as RE from 'rogue-engine';
import * as THREE from 'three';
import RapierBody from '@RE/RogueEngine/rogue-rapier/Components/RapierBody.re';

const vZero = new THREE.Vector3();

export default class BirdController extends RE.Component {
  @RE.props.num() jumpForce = 140;

  private jumpForceVector = new THREE.Vector3();
  private _rapierBody: RapierBody;

  get rapierBody() {
    if (!this._rapierBody) {
      this._rapierBody = RE.getComponent(RapierBody, this.object3d) as RapierBody;
    }
    return this._rapierBody;
  } 

  update() {
    this.jumpForceVector.y = this.jumpForce;

    const jumpAction = RE.Input.keyboard.getKeyDown("Space")
    || RE.Input.mouse.isLeftButtonDown
    || RE.Input.touch.startTouches[0];

    if (jumpAction) {
      this.rapierBody.body.setLinvel(vZero, true);
      this.rapierBody.body.applyImpulse(this.jumpForceVector, true);
    }
  }
}

RE.registerComponent(BirdController);
        