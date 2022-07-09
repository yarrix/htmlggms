function CScoreBoard(iX, iY, oSprite, oParentContainer) {
    var _oBg;
    var _oTextScoreAmount;
    var _oTextScoreAmountAmountStroke;
    var _oContainer;
    var _pStartPos;

    var _oParentContainer = oParentContainer;

    this._init = function (iX, iY, oSprite) {

        _pStartPos = {x: iX, y: iY};
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;

        _oParentContainer.addChild(_oContainer);

        _oBg = createBitmap(oSprite);
        _oBg.regX = oSprite.width * 0.5;
        _oBg.regY = oSprite.height * 0.5;
        _oContainer.addChild(_oBg);
        
        
        var oTextScoreAmountStroke = new CTLText(_oContainer, 
                    -90, -45, 180, 36, 
                    36, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE,
                    true, true, false,
                    false );

        oTextScoreAmountStroke.setOutline(4);


        var oTextScore = new CTLText(_oContainer, 
                     -90, -45, 180, 36, 
                    36, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE,
                    true, true, false,
                    false );
        
        _oTextScoreAmountAmountStroke = new CTLText(_oContainer, 
                    -80, 6, 170, 36, 
                    36, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );

        _oTextScoreAmountAmountStroke.setOutline(4);


        _oTextScoreAmount = new CTLText(_oContainer, 
                    -80, 6, 170, 36, 
                    36, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    "0",
                    true, true, false,
                    false );

    };

    this.refreshScore = function (iScore) {
        _oTextScoreAmount.refreshText(iScore);
        _oTextScoreAmountAmountStroke.refreshText(iScore);
    };

    this.getStartPos = function () {
        return _pStartPos;
    };

    this.setPosition = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this._init(iX, iY, oSprite);

    return this;
}




