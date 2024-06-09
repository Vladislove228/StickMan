System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, input, Input, Prefab, director, instantiate, RigidBody2D, Label, UITransform, v3, Vec3, Tween, AudioSource, AudioClip, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _crd, ccclass, property, GameManager;

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
      Tween = _cc.Tween;
      AudioSource = _cc.AudioSource;
      AudioClip = _cc.AudioClip;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "65bb5zGwHZChYidg1rqyjLu", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'input', 'Input', 'Prefab', 'director', 'instantiate', 'RigidBody2D', 'Label', 'UITransform', 'v3', 'Vec3', 'Tween', 'AudioSource', 'AudioClip']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property(Node), _dec3 = property(Prefab), _dec4 = property(Node), _dec5 = property(Prefab), _dec6 = property(Prefab), _dec7 = property(Label), _dec8 = property(Label), _dec9 = property(AudioClip), _dec10 = property(AudioClip), _dec11 = property(AudioClip), _dec(_class = (_class2 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "player", _descriptor, this);

          _initializerDefineProperty(this, "platform", _descriptor2, this);

          _initializerDefineProperty(this, "failureWindow", _descriptor3, this);

          _initializerDefineProperty(this, "bridge", _descriptor4, this);

          _initializerDefineProperty(this, "point", _descriptor5, this);

          _initializerDefineProperty(this, "scoreLabel", _descriptor6, this);

          _initializerDefineProperty(this, "bestScoreLabel", _descriptor7, this);

          _initializerDefineProperty(this, "backgroundMusic", _descriptor8, this);

          _initializerDefineProperty(this, "bridgeFallSound", _descriptor9, this);

          _initializerDefineProperty(this, "winSound", _descriptor10, this);

          this.isGameStarted = false;
          this.isGrowingBridge = false;
          this.score = 0;
          this.scoreArray = [];
          this.currentBridge = null;
          this.currentBridgeHeight = 0;
          this.bridgeGrowthSpeed = 10;
          this.currentPlatform = null;
          this.nextPlatform = null;
        }

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

        goNextPlatform() {
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
            new Tween(this.player).to(1, {
              position: new Vec3(playerNewX, playerCurrentY, 0)
            }, {
              easing: 'smooth'
            }).call(() => {
              this.resetBridge();
              this.score += 1;

              if (bridgeActualLength > Math.abs(distanceBetweenPlatforms + nextPlatformWidth / 2 - 10) && bridgeActualLength < Math.abs(distanceBetweenPlatforms + nextPlatformWidth / 2 + 15)) {
                this.score += 1;
              }

              this.playSoundEffect(this.winSound);
              this.scoreLabel.string = `Score: ${this.score}`;
            }).start();
            this.currentPlatform = this.nextPlatform;
            this.moveCamera(playerNewX + currentPlatformWidth);
            this.generateNextPlatform();
          } else {
            this.scoreArray.push(this.score);
            this.fallDawn();
          }
        }

        fallDawn() {
          const bridgeActualLength = this.currentBridge.getComponent(UITransform).contentSize.height * this.currentBridge.scale.y;
          const playerCurrentY = this.player.getPosition().y;
          const playerCurrentX = this.player.getPosition().x;
          const playerX = playerCurrentX + bridgeActualLength + this.player.getComponent(UITransform).width;
          new Tween(this.player).to(1, {
            position: new Vec3(playerX, playerCurrentY, 0)
          }, {
            easing: 'smooth'
          }).call(() => {
            this.playSoundEffect(this.bridgeFallSound);
            new Tween(this.player).to(0.1, {
              position: new Vec3(playerCurrentX, -1000, 0)
            }, {
              easing: 'smooth'
            }).start();
            this.currentBridge.setRotationFromEuler(0, 0, -180);
            this.scoreArray.push(this.score);
            var sortedArray = this.scoreArray.sort((n1, n2) => n2 - n1);
            this.bestScoreLabel.string = `Best score: ${sortedArray[0]}`;
            this.failureWindow.active = true;
          }).start();
        }

        moveCamera(targetX) {
          const canvasNode = director.getScene().getChildByName("Canvas");
          const cameraNode = canvasNode.getChildByName("Camera");
          const uiHolderNode = canvasNode.getChildByName("UIHolder");
          const failureWindowNode = canvasNode.getChildByName("FailureWindow");

          if (canvasNode && cameraNode && uiHolderNode) {
            const currentPosition = cameraNode.getPosition();
            const smoothMove = new Tween(cameraNode).to(1, {
              position: new Vec3(targetX, currentPosition.y, currentPosition.z)
            }, {
              easing: 'smooth'
            }).start();
            const smoothMoveUI = new Tween(uiHolderNode).to(1, {
              position: new Vec3(targetX, uiHolderNode.getPosition().y, uiHolderNode.getPosition().z)
            }, {
              easing: 'smooth'
            }).start();
            const failureWindowNodeUI = new Tween(failureWindowNode).to(1, {
              position: new Vec3(targetX, failureWindowNode.getPosition().y, failureWindowNode.getPosition().z)
            }, {
              easing: 'smooth'
            }).start();
          } else {
            console.warn("Не найдены нужные узлы на сцене!");
          }
        }

        resetBridge() {
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

        generateNextPlatform() {
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

        generateBridge() {
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

        generateInitialPlatforms() {
          const canvas = director.getScene().getChildByName("Canvas");
          const platformInstance = instantiate(this.platform);
          this.node.addChild(platformInstance);
          this.currentPlatform = instantiate(this.platform);
          this.currentPlatform.setParent(canvas);
          this.currentPlatform.setPosition(-350, -590);
          this.generateNextPlatform();
        }

        update(deltaTime) {
          if (this.isGrowingBridge && this.currentBridge) {
            this.currentBridgeHeight += this.bridgeGrowthSpeed * 2 * deltaTime;
            this.currentBridge.setScale(v3(1, this.currentBridgeHeight, 1));
          }
        }

        restartGame() {
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

        clearPlatforms() {
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

        playSoundEffect(sound) {
          const audioSource = this.node.addComponent(AudioSource);
          audioSource.clip = sound;
          audioSource.play();
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
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "point", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "scoreLabel", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "bestScoreLabel", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "backgroundMusic", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "bridgeFallSound", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "winSound", [_dec11], {
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