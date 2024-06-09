import {_decorator, Component, director, Node, Tween, Vec3} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    @property(Node)
    player: Node;

    @property(Node)
    platform: Node;

    private animationsCompleted = 0;

    start() {
    }

    private initializeAnimation() {
        const playerCurrentY = this.player.getPosition().y;
        const platformCurrentY = this.platform.getPosition().y;

        new Tween(this.player)
            .to(1.0, {position: new Vec3(-350, playerCurrentY, 0)}, {easing: 'quadInOut'})
            .call(() => {
                this.checkAllAnimationsCompleted();
            })
            .start();

        new Tween(this.platform)
            .to(1.0, {position: new Vec3(-350, platformCurrentY, 0)}, {easing: 'quadInOut'})
            .call(() => {
                this.checkAllAnimationsCompleted();
            })
            .start();
    }

    private checkAllAnimationsCompleted() {
        this.animationsCompleted++;
        if (this.animationsCompleted >= 2) {
            director.loadScene("MainScene");
        }
    }

    private startGame() {
        this.animationsCompleted = 0;
        this.initializeAnimation();
    }

    update(deltaTime: number) {
    }
}
