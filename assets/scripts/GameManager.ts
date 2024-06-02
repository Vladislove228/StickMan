import {
    _decorator, Component, Node, input, Input, Prefab, director, instantiate, RigidBody2D, Vec2,
    Label, UITransform, v3, Vec3, Sprite, Tween
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    player: Node;

    @property(Prefab)
    platform: Prefab;

    @property(Node)
    failureWindow: Node;

    @property(Prefab)
    bridge: Prefab;  // Prefab для моста

    @property(Label)
    scoreLabel: Label;

    isGameStarted = false;
    isGrowingBridge = false;
    score = 0;
    currentBridge: Node;
    currentBridgeHeight = 0;
    bridgeGrowthSpeed = 10;

    currentPlatform: Node;
    nextPlatform: Node;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        this.generateInitialPlatforms();
        // Включаем физическую систему, если она будет использоваться
        // PhysicsSystem2D.instance.enable = true;
        // PhysicsSystem2D.instance.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
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
                // Если нужно управление физикой
                // const rigidBody = this.currentBridge.getComponent(RigidBody2D) || this.currentBridge.addComponent(RigidBody2D);
                // rigidBody.type = RigidBody2D.Type.Static;

                this.scheduleOnce(() => {
                    this.goNextPlatform();
                }, 0.5);
            }, 0.5);
        }
    }

    private goNextPlatform() {
        if (!this.currentPlatform || !this.nextPlatform || !this.currentBridge) {
            console.log("Некоторые элементы отсутствуют.");
            return;
        }

        const currentPlatformTransform = this.currentPlatform.getComponent(UITransform);
        const nextPlatformTransform = this.nextPlatform.getComponent(UITransform);

        if (!currentPlatformTransform || !nextPlatformTransform) {
            console.log("Не удалось получить компоненты UITransform.");
            return;
        }

        const currentPlatformPos = this.currentPlatform.getPosition();
        const nextPlatformPos = this.nextPlatform.getPosition();

        const currentPlatwormWidth = currentPlatformTransform.contentSize.width;
        const nextPlatwormWidth = nextPlatformTransform.contentSize.width;

        const distanceBetweenPlatforms = Math.abs(nextPlatformPos.x - (currentPlatformPos.x + currentPlatwormWidth));

        const bridgeActualLength = this.currentBridge.getComponent(UITransform).contentSize.height * this.currentBridge.scale.y;

        // console.log(`Current platform position: ${currentPlatformPos.x}`);
        // console.log(`Next platform position: ${nextPlatformPos.x}`);
        // console.log(`Platform width: ${currentPlatwormWidth}`);
        // console.log(`Bridge length: ${bridgeActualLength}`);
        // console.log(`Distance between platforms: ${distanceBetweenPlatforms}`);

        if (bridgeActualLength > distanceBetweenPlatforms && bridgeActualLength < Math.abs(distanceBetweenPlatforms + nextPlatwormWidth)) {
            this.player.setPosition(nextPlatformPos.x, this.player.getPosition().y);
            this.score += 10;
            this.scoreLabel.string = `Score: ${this.score}`;
            console.log("Successful transition to the next platform.");

            this.currentPlatform = this.nextPlatform;

            this.moveCamera(nextPlatformPos.x + currentPlatwormWidth);

            this.generateNextPlatform();

            // Обнуление моста после успешного перехода
            this.resetBridge();
        } else {
            // this.failureWindow.active = true;
        }
    }

    private moveCamera(targetX: number) {
        const canvasNode = director.getScene().getChildByName("Canvas");
        const cameraNode = canvasNode.getChildByName("Camera");
        const uiHolderNode = canvasNode.getChildByName("UIHolder"); // Убедитесь, что узел с таким именем существует

        if (canvasNode && cameraNode && uiHolderNode) {
            const currentPosition = cameraNode.getPosition();
            const smoothMove = new Tween(cameraNode)
                .to(1, { position: new Vec3(targetX, currentPosition.y, currentPosition.z) }, { easing: 'smooth' })
                .start();

            const smoothMoveUI = new Tween(uiHolderNode)
                .to(1, { position: new Vec3(targetX, uiHolderNode.getPosition().y, uiHolderNode.getPosition().z) }, { easing: 'smooth' })
                .start();
        } else {
            console.warn("Не найдены нужные узлы на сцене!");
        }
    }




    private resetBridge() {
        if (this.currentBridge) {
            // Сброс параметров моста
            this.currentBridge.setScale(v3(1, 1, 1)); // Сброс масштаба
            this.currentBridgeHeight = 0; // Сброс высоты моста

            // Опционально можно переместить мост вне видимой зоны или деактивировать его
            this.currentBridge.setPosition(this.player.getPosition().x, -1000); // Пример перемещения вне экрана
        }
    }


    private generateNextPlatform() {
        const canvas = director.getScene().getChildByName("Canvas");
        const newPlatform = instantiate(this.platform);
        newPlatform.setParent(canvas);

        // Вычисляем случайное расстояние для новой платформы
        const platformWidth = this.currentPlatform.getComponent(UITransform).contentSize.width;
        const xRandom = Math.random() * 200 + platformWidth;  // Рандомное расстояние до следующей платформы

        // Устанавливаем позицию для новой платформы
        newPlatform.setPosition(this.currentPlatform.getPosition().x + xRandom, -590);

        // Обновляем ссылку на следующую платформу
        this.nextPlatform = newPlatform;
    }




    private generateBridge() {
        this.isGrowingBridge = true;
        this.currentBridge = instantiate(this.bridge);
        const canvas = director.getScene().getChildByName("Canvas");
        this.currentBridge.setParent(canvas);

        const playerPos = this.player.getPosition();
        const playerHeight = this.player.getComponent(UITransform).height;
        this.currentBridge.setPosition(playerPos.x + playerHeight * 7 / 9, playerPos.y - playerHeight / 2, 0);
        this.currentBridge.getComponent(UITransform).anchorY = 0;
        this.currentBridge.setScale(v3(1, 1, 1)); // Установите начальный масштаб в 1

        const rigidBody = this.currentBridge.getComponent(RigidBody2D) || this.currentBridge.addComponent(RigidBody2D);
        rigidBody.type = 0;
    }

    generateInitialPlatforms() {
        const canvas = director.getScene().getChildByName("Canvas");
        const platformInstance: Node = instantiate(this.platform);
        this.node.addChild(platformInstance);
        const sprite: Sprite | null = platformInstance.getComponent(Sprite);
        const platformWidth = sprite.spriteFrame.rect.width;

        let xRandom = Math.random() * 200 + platformWidth;  // Даем небольшой случайный разброс для платформ

        this.currentPlatform = instantiate(this.platform);
        this.currentPlatform.setParent(canvas);
        this.currentPlatform.setPosition(-350, -590);

        this.nextPlatform = instantiate(this.platform);
        this.nextPlatform.setParent(canvas);
        this.nextPlatform.setPosition(this.currentPlatform.getPosition().x + xRandom, -590);
    }

    update(deltaTime: number) {
        if (this.isGrowingBridge && this.currentBridge) {
            this.currentBridgeHeight += this.bridgeGrowthSpeed * deltaTime;
            this.currentBridge.setScale(v3(1, this.currentBridgeHeight, 1));
        }
    }

}
