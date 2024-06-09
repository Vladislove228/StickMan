import {_decorator, Component, Node, director, RigidBody2D} from 'cc';
import {GameManager} from "db://assets/scripts/GameManager";

const {ccclass, property} = _decorator;

@ccclass('FailureWindow')
export class FailureWindow extends Component {
    start() {

    }

    private restartGame() {
        let gameManager = director.getScene().getChildByName("GameManager").getComponent(GameManager);
        if (gameManager) {
            gameManager.restartGame();
        } else {
            console.error("GameManager not found in the scene!");
        }
    }

    private mainMenu() {
        director.loadScene("MainMenu");
    }

    update(deltaTime: number) {

    }
}

