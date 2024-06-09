import {
    _decorator, Component, Node, input, Input, Prefab, director, instantiate, RigidBody2D,
    Label, UITransform, v3, Vec3, Tween, AudioSource, AudioClip
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node) player: Node;
    @property(Prefab) platform: Prefab;
    @property(Node) failureWindow: Node;
    @property(Prefab) bridge: Prefab;
    @property(Prefab) point: Prefab;
    @property(Label) scoreLabel: Label;
    @property(Label) bestScoreLabel: Label;
    @property(AudioClip) backgroundMusic: AudioClip;
    @property(AudioClip) bridgeFallSound: AudioClip;
    @property(AudioClip) winSound: AudioClip;

    private isGameStarted = false;
    private isGrowingBridge = false;
    private score = 0;
    private scoreArray: number[] = [];
    private currentBridge: Node | null = null;
    private currentBridgeHeight = 0;
    private bridgeGrowthSpeed = 10;
    private currentPlatform: Node | null = null;
    private nextPlatform: Node | null = null;

    start() {
        this.initializeGame();

    }

    initializeGame() {
        this.playSoundEffect(this.backgroundMusic);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.generateInitialPlatforms();
        this.failureWindow.active = false;
    }

    onTouchStart() {
        if (!this.isGameStarted) {
            this.isGameStarted = true;
        }
        this.generateBridge();
    }

    onTouchEnd() {
        this.isGrowingBridge = false;
        if (this.currentBridge) {
            this.scheduleOnce(() => {
                this.currentBridge.setRotationFromEuler(0, 0, -90);
                this.scheduleOnce(() => {
                    this.goNextPlatform();
                }, 0.5);
            }, 0.5);
        }
    }

    private goNextPlatform() {
        const currentPlatformTransform = this.currentPlatform.getComponent(UITransform);
        const nextPlatformTransform = this.nextPlatform.getComponent(UITransform);

        const currentPlatformPos = this.currentPlatform.getPosition();
        const nextPlatformPos = this.nextPlatform.getPosition();

        const currentPlatformWidth = currentPlatformTransform.contentSize.width;
        const nextPlatformWidth = nextPlatformTransform.contentSize.width;

        const distanceBetweenPlatforms = Math.abs(nextPlatformPos.x - (currentPlatformPos.x + currentPlatformWidth));
        const bridgeActualLength = this.currentBridge.getComponent(UITransform).contentSize.height * this.currentBridge.scale.y;

        if (bridgeActualLength > distanceBetweenPlatforms + 10 && bridgeActualLength < Math.abs(distanceBetweenPlatforms + nextPlatformWidth)) {
            const playerNewX = nextPlatformPos.x;
            const playerCurrentY = this.player.getPosition().y;

            new Tween(this.player)
                .to(1, {position: new Vec3(playerNewX, playerCurrentY, 0)}, {easing: 'smooth'})
                .call(() => {
                    this.resetBridge();
                    this.score += 1;
                    if (bridgeActualLength > Math.abs(distanceBetweenPlatforms + nextPlatformWidth / 2 - 10) && bridgeActualLength < Math.abs(distanceBetweenPlatforms + nextPlatformWidth / 2 + 15)) {
                        this.score += 1;
                    }
                    this.playSoundEffect(this.winSound);
                    this.scoreLabel.string = `Score: ${this.score}`;
                })
                .start();

            this.currentPlatform = this.nextPlatform;
            this.moveCamera(playerNewX + currentPlatformWidth);
            this.generateNextPlatform();
        } else {
            this.scoreArray.push(this.score);
            this.fallDawn();
        }
    }


    private fallDawn() {
        const bridgeActualLength = this.currentBridge.getComponent(UITransform).contentSize.height * this.currentBridge.scale.y;
        const playerCurrentY = this.player.getPosition().y;
        const playerCurrentX = this.player.getPosition().x;
        const playerX = playerCurrentX + bridgeActualLength + this.player.getComponent(UITransform).width;
        new Tween(this.player)
            .to(1, {position: new Vec3(playerX, playerCurrentY, 0)}, {easing: 'smooth'})
            .call(() => {
                this.playSoundEffect(this.bridgeFallSound);
                new Tween(this.player)
                    .to(0.1, {position: new Vec3(playerCurrentX, -1000, 0)}, {easing: 'smooth'})
                    .start();

                this.currentBridge.setRotationFromEuler(0, 0, -180);

                this.scoreArray.push(this.score);
                var sortedArray: number[] = this.scoreArray.sort((n1, n2) => n2 - n1);

                this.bestScoreLabel.string = `Best score: ${sortedArray[0]}`;
                this.failureWindow.active = true;
            })
            .start();

    }

    private moveCamera(targetX: number) {
        const canvasNode = director.getScene().getChildByName("Canvas");
        const cameraNode = canvasNode.getChildByName("Camera");
        const uiHolderNode = canvasNode.getChildByName("UIHolder");
        const failureWindowNode = canvasNode.getChildByName("FailureWindow");

        if (canvasNode && cameraNode && uiHolderNode) {
            const currentPosition = cameraNode.getPosition();
            const smoothMove = new Tween(cameraNode)
                .to(1, {position: new Vec3(targetX, currentPosition.y, currentPosition.z)}, {easing: 'smooth'})
                .start();

            const smoothMoveUI = new Tween(uiHolderNode)
                .to(1, {position: new Vec3(targetX, uiHolderNode.getPosition().y, uiHolderNode.getPosition().z)}, {easing: 'smooth'})
                .start();

            const failureWindowNodeUI = new Tween(failureWindowNode)
                .to(1, {position: new Vec3(targetX, failureWindowNode.getPosition().y, failureWindowNode.getPosition().z)}, {easing: 'smooth'})
                .start();
        } else {
            console.warn("Не найдены нужные узлы на сцене!");
        }
    }

    private resetBridge() {
        const canvas = director.getScene().getChildByName("Canvas");

        if (canvas) {
            let children = canvas.children.slice();
            for (let child of children) {
                if (child.name === "Bridge") {
                    canvas.removeChild(child);
                    child.destroy();
                    this.currentBridge.setScale(v3(1, 1, 1));
                    this.currentBridgeHeight = 0;
                }
            }
        } else {
            console.error("Canvas not found in the scene!");
        }
    }

    private generateNextPlatform() {
        const canvas = director.getScene().getChildByName("Canvas");
        const newPlatform = instantiate(this.platform);
        newPlatform.setParent(canvas);

        const platformHeight = this.currentPlatform.getComponent(UITransform).contentSize.height;
        const xRandom = Math.random() * (400 - 300) + 300;

        newPlatform.setPosition(this.currentPlatform.getPosition().x + xRandom, -590);

        const point = instantiate(this.point);
        point.setParent(newPlatform);
        point.setPosition(0, platformHeight / 2 + point.getComponent(UITransform).contentSize.height / 2 - 10, 0);

        this.nextPlatform = newPlatform;
    }

    private generateBridge() {
        this.isGrowingBridge = true;
        this.currentBridge = instantiate(this.bridge);
        const canvas = director.getScene().getChildByName("Canvas");
        this.currentBridge.setParent(canvas);

        const playerPos = this.player.getPosition();
        const playerHeight = this.player.getComponent(UITransform).height;
        this.currentBridge.setPosition(playerPos.x + playerHeight * 4 / 5, playerPos.y - playerHeight / 2, 0);
        this.currentBridge.getComponent(UITransform).anchorY = 0;
        this.currentBridge.setScale(v3(1, 1, 1));

        const rigidBody = this.currentBridge.getComponent(RigidBody2D) || this.currentBridge.addComponent(RigidBody2D);
        rigidBody.type = 0;
    }


    private generateInitialPlatforms() {
        const canvas = director.getScene().getChildByName("Canvas");
        const platformInstance: Node = instantiate(this.platform);
        this.node.addChild(platformInstance);

        this.currentPlatform = instantiate(this.platform);
        this.currentPlatform.setParent(canvas);
        this.currentPlatform.setPosition(-350, -590);

        this.generateNextPlatform();


    }

    update(deltaTime: number) {
        if (this.isGrowingBridge && this.currentBridge) {
            this.currentBridgeHeight += this.bridgeGrowthSpeed * 2 * deltaTime;
            this.currentBridge.setScale(v3(1, this.currentBridgeHeight, 1));
        }
    }

    public restartGame() {
        this.resetBridge();
        this.score = 0;
        this.scoreLabel.string = `Score: ${this.score}`;

        this.clearPlatforms();

        this.generateInitialPlatforms();

        const initialPlayerPosition = new Vec3(-350, -340, 0);
        this.player.setPosition(initialPlayerPosition);

        this.moveCamera(0);

        this.failureWindow.active = false;
    }

    private clearPlatforms() {
        const canvas = director.getScene().getChildByName("Canvas");
        if (canvas) {
            let children = canvas.children.slice();
            for (let child of children) {
                if (child.name === "Platform") {
                    canvas.removeChild(child);
                    child.destroy();
                }
            }
        } else {
            console.error("Canvas not found in the scene!");
        }
    }

    private playSoundEffect(sound: AudioClip) {
        const audioSource = this.node.addComponent(AudioSource);
        audioSource.clip = sound;
        audioSource.play();
    }

}
