System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, Node, Tween, Vec3, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, MainMenu;

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
      director = _cc.director;
      Node = _cc.Node;
      Tween = _cc.Tween;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b7c51PQBjlN9KSQ7icGyf4K", "MainMenu", undefined);

      __checkObsolete__(['_decorator', 'Component', 'director', 'Node', 'Tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MainMenu", MainMenu = (_dec = ccclass('MainMenu'), _dec2 = property(Node), _dec3 = property(Node), _dec(_class = (_class2 = class MainMenu extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "player", _descriptor, this);

          _initializerDefineProperty(this, "platform", _descriptor2, this);

          this.animationsCompleted = 0;
        }

        // Счетчик завершенных анимаций
        start() {}

        initializeAnimation() {
          var playerCurrentY = this.player.getPosition().y;
          var platformCurrentY = this.platform.getPosition().y;
          new Tween(this.player).to(1.0, {
            position: new Vec3(-350, playerCurrentY, 0)
          }, {
            easing: 'quadInOut'
          }).call(() => {
            this.checkAllAnimationsCompleted();
          }).start();
          new Tween(this.platform).to(1.0, {
            position: new Vec3(-350, platformCurrentY, 0)
          }, {
            easing: 'quadInOut'
          }).call(() => {
            this.checkAllAnimationsCompleted();
          }).start();
        }

        checkAllAnimationsCompleted() {
          this.animationsCompleted++;

          if (this.animationsCompleted >= 2) {
            // Проверяем, что обе анимации завершены
            director.loadScene("MainScene");
          }
        }

        startGame() {
          this.animationsCompleted = 0; // Сброс счетчика

          this.initializeAnimation();
        }

        update(deltaTime) {}

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
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f5cd09085d4e4747cffdf8262386b34dc0091d4a.js.map