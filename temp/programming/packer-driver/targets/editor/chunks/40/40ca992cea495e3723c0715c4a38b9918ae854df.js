System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, director, GameManager, _dec, _class, _crd, ccclass, property, FailureWindow;

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "db://assets/scripts/GameManager", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      director = _cc.director;
    }, function (_unresolved_2) {
      GameManager = _unresolved_2.GameManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "78a8fT3th9JDb/CM+bdwIeq", "FailureWindow", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'director', 'RigidBody2D']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("FailureWindow", FailureWindow = (_dec = ccclass('FailureWindow'), _dec(_class = class FailureWindow extends Component {
        start() {}

        restartGame() {
          let gameManager = director.getScene().getChildByName("GameManager").getComponent(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
            error: Error()
          }), GameManager) : GameManager);

          if (gameManager) {
            gameManager.restartGame();
          } else {
            console.error("GameManager not found in the scene!");
          }
        }

        mainMenu() {
          director.loadScene("MainMenu");
        }

        update(deltaTime) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=40ca992cea495e3723c0715c4a38b9918ae854df.js.map