import * as RE from 'rogue-engine';
import * as THREE from 'three';
import UIComponent from './UIComponent.re';
import UIGameOver from './UIGameOver.re';
import UIInGame from './UIInGame.re';
import BirdController from './BirdController.re';

export default class GameLogic extends RE.Component {
  @RE.props.prefab() bird: RE.Prefab;
  @RE.props.prefab() pipePair: RE.Prefab;
  @RE.props.list.num() pipeHeights: number[] = [];
  @RE.props.num() pipeDistance = 15;
  @RE.props.num() pipesCount = 10;
  @RE.props.num() pipeSpeed = 10;

  gameStarted = false;
  gameOver = false;
  gameScore = 0;
  bestScore = 0;
  birdController : BirdController;
  curPipes: THREE.Object3D[] = [];

  styles: UIComponent;
  startMenu: UIComponent;
  inGameUI: UIInGame;
  gameOverUI: UIGameOver;

  private pipeMovement = new THREE.Vector3();
  private curWidth = 0;
  private curHeight = 0;

  start() {
    this.styles = RE.getComponentByName("UIStyles", this.object3d) as UIComponent;
    this.startMenu = RE.getComponentByName("UIStartMenu", this.object3d) as UIComponent;
    this.inGameUI = RE.getComponent(UIInGame, this.object3d);
    this.gameOverUI = RE.getComponent(UIGameOver, this.object3d);

    this.styles.show();
    this.startMenu.show();
  }

  update() {
    this.adjustCamera();
    
    if (this.gameStarted) {
      if (!this.gameOver) {
        this.movePipes();
        this.createEndlessPipes();
      }
    } else {
      const startAction = RE.Input.keyboard.getKeyDown("Space")
      || RE.Input.mouse.isLeftButtonDown
      || RE.Input.touch.startTouches[0];

      if (startAction) {
        this.startGame();
      }
    }
  }

  startGame() {
    this.startMenu.hide();
    this.inGameUI.show();
    this.inGameUI.setScore(0);

    this.gameStarted = true;
    this.gameScore = 0;
    const birdInst = this.bird.instantiate();
    birdInst.position.y = 15;

    this.birdController = RE.getComponent(BirdController, birdInst) as BirdController;

    this.birdController.rapierBody.onCollisionStart = (info) => {
      if (info.otherBody.object3d.name === "Point") {
        this.gameScore += 1;
        this.inGameUI.setScore(this.gameScore)
      } else {
        this.gameOver = true;
        this.birdController.enabled = false;
        this.inGameUI.hide();

        if (this.gameScore > this.bestScore) {
          this.bestScore = this.gameScore;
        }

        this.gameOverUI.show(this.gameScore, this.bestScore, this.onRestart)
      }
    }

    this.addPipes();
  }

  onRestart = () => {
    this.birdController.object3d.removeFromParent();
    for (let pipe of this.curPipes) {
      pipe.removeFromParent();
    }
    this.curPipes = [];

    this.gameOverUI.hide();
    this.startMenu.show();

    this.gameOver = false;
    this.gameStarted = false;
  }

  addPipes() {
    for (let i = 1; i <= this.pipesCount; i++) {
      const pipe = this.pipePair.instantiate();
      this.addPipe(pipe, i * this.pipeDistance + 20, this.getRandomHeight());
    }
  }

  addPipe(pipe: THREE.Object3D, x: number, y: number) {
    pipe.position.set(x, y, -1.5);
    this.curPipes.push(pipe);
  }

  getRandomHeight() {
    const i = Math.floor(Math.random() * this.pipeHeights.length);
    return this.pipeHeights[i] || 0;
  }

  movePipes() {
    this.pipeMovement.x = -this.pipeSpeed * RE.Runtime.deltaTime;
    for (let pipe of this.curPipes) {
      pipe.position.add(this.pipeMovement);
    }
  }

  createEndlessPipes() {
    const firstPipe = this.curPipes[0];

    if (firstPipe.position.x <= -this.pipeDistance * (this.pipesCount * 0.5)) {
      const lastPipe = this.curPipes[this.pipesCount -1];
      const newX = lastPipe.position.x + this.pipeDistance;
      const removedPipe = this.curPipes.shift() as THREE.Object3D;
      this.addPipe(removedPipe, newX, this.getRandomHeight());
    }
  }

  adjustCamera() {
    if (
      RE.Runtime.width === this.curWidth &&
      RE.Runtime.height === this.curHeight
    ) {
      return;
    }
    this.curWidth = RE.Runtime.width;
    this.curHeight = RE.Runtime.height;

    const aspect = this.curWidth / (this.curHeight || 1);

    const camera = RE.Runtime.camera as THREE.PerspectiveCamera;

    if (aspect < 1) {
      camera.zoom = aspect * 1.1;
    }
    if (aspect >= 1) {
      camera.zoom = aspect * 0.4;
    }

    camera.updateProjectionMatrix();
  }

}

RE.registerComponent(GameLogic);
        