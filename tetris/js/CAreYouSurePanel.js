function CAreYouSurePanel(oParentContainer) {
    var _oMsgStroke;
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oBg;
    var _oContainer;
    var _oFade;
    var _oParentContainer;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;

        _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oMsgBox);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF
        _oBg.regX = oMsgBox.width * 0.5;
        _oBg.regY = oMsgBox.height * 0.5;
        _oContainer.addChild(_oBg);

        _oBg.on("click", function () {});

        _oMsgStroke = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-300, CANVAS_HEIGHT * 0.5-150, 600, 150, 
                    70, "center", "#0025c2", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_ARE_SURE,
                    true, true, true,
                    false );
        
        _oMsgStroke.setOutline(5);
        

        _oMsg = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-300, CANVAS_HEIGHT * 0.5-150, 600, 150, 
                    70, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_ARE_SURE,
                    true, true, true,
                    false );
                    
 

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 170, CANVAS_HEIGHT * 0.5 + 150, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 170, CANVAS_HEIGHT * 0.5 + 150, s_oSpriteLibrary.getSprite('but_not'), _oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };

    this.onPause = function (bVal) {
        s_oGame.setPause(bVal);
        createjs.Ticker.paused = bVal;
        if (bVal === true) {
            s_oGame.canInput(false);
        } else {
            s_oGame.canInput(true);
        }
    };

    this.show = function () {
        this.onPause(true);
        _oContainer.visible = true;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oFade.off("click", function () {});
    };

    this._onButYes = function () {
        this.unload();
        this.onPause(false);

        s_oGame.onExit();
    };

    this._onButNo = function () {
        this.unload();
        this.onPause(false);
        
        _oContainer.visible = false;
    };

    _oParentContainer = oParentContainer;

    this._init();
}