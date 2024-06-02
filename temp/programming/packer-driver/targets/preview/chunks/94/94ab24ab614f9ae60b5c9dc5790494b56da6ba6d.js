System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, input, Input, Prefab, director, instantiate, RigidBody2D, Label, UITransform, v3, Vec3, Sprite, Tween, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      input = _cc.input;
      Input = _cc.Input;
      Prefab = _cc.Prefab;
      director = _cc.director;
      instantiate = _cc.instantiate;
      RigidBody2D = _cc.RigidBody2D;
      Label = _cc.Label;
      UITransform = _cc.UITransform;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
      Sprite = _cc.Sprite;
      Tween = _cc.Tween;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "65bb5zGwHZChYidg1rqyjLu", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'Prefab', 'director', 'instantiate', 'RigidBody2D', 'Vec2', 'Label', 'UITransform', 'v3', 'Vec3', 'Sprite', 'Tween']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(Node), _dec5 = property(Prefab), _dec6 = property(Label), _dec(_class = (_class2 = class GameManager extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "player", _descriptor, this);

          _initializerDefineProperty(this, "platform", _descriptor2, this);

          _initializerDefineProperty(this, "failureWindow", _descriptor3, this);

          _initializerDefineProperty(this, "bridge", _descriptor4, this);

          // Prefab для моста
          _initializerDefineProperty(this, "scoreLabel", _descriptor5, this);

          this.isGameStarted = false;
          this.isGrowingBridge = false;
          this.score = 0;
          this.currentBridge = void 0;
          this.currentBridgeHeight = 0;
          this.bridgeGrowthSpeed = 10;
          this.currentPlatform = void 0;
          this.nextPlatform = void 0;
        }

        start() {
          input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.generateInitialPlatforms(); // Включаем физическую систему, если она будет использоваться
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
              this.currentBridge.setRotationFromEuler(0, 0, -90); // Если нужно управление физикой
              // const rigidBody = this.currentBridge.getComponent(RigidBody2D) || this.currentBridge.addComponent(RigidBody2D);
              // rigidBody.type = RigidBody2D.Type.Static;

              this.scheduleOnce(() => {
                this.goNextPlatform();
              }, 0.5);
            }, 0.5);
          }
        }

        goNextPlatform() {
          if (!this.currentPlatform || !this.nextPlatform || !this.currentBridge) {
            console.log("Некоторые элементы отсутствуют.");
            return;
          }

          var currentPlatformTransform = this.currentPlatform.getComponent(UITransform);
          var nextPlatformTransform = this.nextPlatform.getComponent(UITransform);

          if (!currentPlatformTransform || !nextPlatformTransform) {
            console.log("Не удалось получить компоненты UITransform.");
            return;
          }

          var currentPlatformPos = this.currentPlatform.getPosition();
          var nextPlatformPos = this.nextPlatform.getPosition();
          var currentPlatwormWidth = currentPlatformTransform.contentSize.width;
          var nextPlatwormWidth = nextPlatformTransform.contentSize.width;
          var distanceBetweenPlatforms = Math.abs(nextPlatformPos.x - (currentPlatformPos.x + currentPlatwormWidth));
          var bridgeActualLength = this.currentBridge.getComponent(UITransform).contentSize.height * this.currentBridge.scale.y; // console.log(`Current platform position: ${currentPlatformPos.x}`);
          // console.log(`Next platform position: ${nextPlatformPos.x}`);
          // console.log(`Platform width: ${currentPlatwormWidth}`);
          // console.log(`Bridge length: ${bridgeActualLength}`);
          // console.log(`Distance between platforms: ${distanceBetweenPlatforms}`);

          if (bridgeActualLength > distanceBetweenPlatforms && bridgeActualLength < Math.abs(distanceBetweenPlatforms + nextPlatwormWidth)) {
            this.player.setPosition(nextPlatformPos.x, this.player.getPosition().y);
            this.score += 10;
            this.scoreLabel.string = "Score: " + this.score;
            console.log("Successful transition to the next platform.");
            this.currentPlatform = this.nextPlatform;
            this.moveCamera(nextPlatformPos.x + currentPlatwormWidth);
            this.generateNextPlatform(); // Обнуление моста после успешного перехода

            this.resetBridge();
          } else {// this.failureWindow.active = true;
          }
        }

        moveCamera(targetX) {
          var canvasNode = director.getScene().getChildByName("Canvas");
          var cameraNode = canvasNode.getChildByName("Camera");
          var uiHolderNode = canvasNode.getChildByName("UIHolder"); // Убедитесь, что узел с таким именем существует

          if (canvasNode && cameraNode && uiHolderNode) {
            var currentPosition = cameraNode.getPosition();
            var smoothMove = new Tween(cameraNode).to(1, {
              position: new Vec3(targetX, currentPosition.y, currentPosition.z)
            }, {
              easing: 'smooth'
            }).start();
            var smoothMoveUI = new Tween(uiHolderNode).to(1, {
              position: new Vec3(targetX, uiHolderNode.getPosition().y, uiHolderNode.getPosition().z)
            }, {
              easing: 'smooth'
            }).start();
          } else {
            console.warn("Не найдены нужные узлы на сцене!");
          }
        }

        resetBridge() {
          if (this.currentBridge) {
            // Сброс параметров моста
            this.currentBridge.setScale(v3(1, 1, 1)); // Сброс масштаба

            this.currentBridgeHeight = 0; // Сброс высоты моста
            // Опционально можно переместить мост вне видимой зоны или деактивировать его

            this.currentBridge.setPosition(this.player.getPosition().x, -1000); // Пример перемещения вне экрана
          }
        }

        generateNextPlatform() {
          var canvas = director.getScene().getChildByName("Canvas");
          var newPlatform = instantiate(this.platform);
          newPlatform.setParent(canvas); // Вычисляем случайное расстояние для новой платформы

          var platformWidth = this.currentPlatform.getComponent(UITransform).contentSize.width;
          var xRandom = Math.random() * 200 + platformWidth; // Рандомное расстояние до следующей платформы
          // Устанавливаем позицию для новой платформы

          newPlatform.setPosition(this.currentPlatform.getPosition().x + xRandom, -590); // Обновляем ссылку на следующую платформу

          this.nextPlatform = newPlatform;
        }

        generateBridge() {
          this.isGrowingBridge = true;
          this.currentBridge = instantiate(this.bridge);
          var canvas = director.getScene().getChildByName("Canvas");
          this.currentBridge.setParent(canvas);
          var playerPos = this.player.getPosition();
          var playerHeight = this.player.getComponent(UITransform).height;
          this.currentBridge.setPosition(playerPos.x + playerHeight * 7 / 9, playerPos.y - playerHeight / 2, 0);
          this.currentBridge.getComponent(UITransform).anchorY = 0;
          this.currentBridge.setScale(v3(1, 1, 1)); // Установите начальный масштаб в 1

          var rigidBody = this.currentBridge.getComponent(RigidBody2D) || this.currentBridge.addComponent(RigidBody2D);
          rigidBody.type = 0;
        }

        generateInitialPlatforms() {
          var canvas = director.getScene().getChildByName("Canvas");
          var platformInstance = instantiate(this.platform);
          this.node.addChild(platformInstance);
          var sprite = platformInstance.getComponent(Sprite);
          var platformWidth = sprite.spriteFrame.rect.width;
          var xRandom = Math.random() * 200 + platformWidth; // Даем небольшой случайный разброс для платформ

          this.currentPlatform = instantiate(this.platform);
          this.currentPlatform.setParent(canvas);
          this.currentPlatform.setPosition(-350, -590);
          this.nextPlatform = instantiate(this.platform);
          this.nextPlatform.setParent(canvas);
          this.nextPlatform.setPosition(this.currentPlatform.getPosition().x + xRandom, -590);
        }

        update(deltaTime) {
          if (this.isGrowingBridge && this.currentBridge) {
            this.currentBridgeHeight += this.bridgeGrowthSpeed * deltaTime;
            this.currentBridge.setScale(v3(1, this.currentBridgeHeight, 1));
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "player", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "platform", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "failureWindow", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "bridge", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=94ab24ab614f9ae60b5c9dc5790494b56da6ba6d.js.map