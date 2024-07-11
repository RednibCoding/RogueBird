import * as RE from 'rogue-engine';
import UIComponent from './UIComponent.re';

export default class UIGameOver extends UIComponent {
  show(score: number, best: number, restart: () => void ) {
    super.show();

    const scoreDiv = document.getElementById("gameover-score") as HTMLDivElement;
    const bestDiv = document.getElementById("gameover-best") as HTMLDivElement;
    const restartBtn = document.getElementById("gameover-restart-btn") as HTMLDivElement;

    scoreDiv.innerHTML = score.toString();
    bestDiv.innerHTML = best.toString();

    restartBtn.onpointerup = restart;
  }
}

RE.registerComponent(UIGameOver);
        