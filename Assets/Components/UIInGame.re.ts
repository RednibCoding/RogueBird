import * as RE from 'rogue-engine';
import UIComponent from './UIComponent.re';

export default class UIInGame extends UIComponent {
  scoreDiv: HTMLDivElement;

  show() {
    super.show();
    this.scoreDiv = document.getElementById("ingame-score") as HTMLDivElement;
  }

  setScore(score: number) {
    this.scoreDiv.innerHTML = score.toString();
  }
}

RE.registerComponent(UIInGame);
        