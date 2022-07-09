function CInfoBoard(iX, iY, oSprite, oParentContainer) {
    var _oBg;
    var _oTextNumLevel;
    var _oTextNumLevelStroke;
    var _oTextLine;
    var _oTextLineStroke;
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
        
        
        var oTextLevelStroke = new CTLText(_oContainer, 
                    -90, -_oBg.regY * 0.5 - 24, 180, 33, 
                    33, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL,
                    true, true, false,
                    false );
                    

        oTextLevelStroke.setOutline(4);

        var oTextLevel = new CTLText(_oContainer, 
                    -90, -_oBg.regY * 0.5 - 24, 180, 33, 
                    33, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL,
                    true, true, false,
                    false );
                    
                    
        _oTextNumLevelStroke = new CTLText(_oContainer, 
                    -45, -_oBg.regY * 0.5 +25, 100, 33, 
                    33, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
                    

        _oTextNumLevelStroke.setOutline(4);

        _oTextNumLevel = new CTLText(_oContainer, 
                    -45, -_oBg.regY * 0.5 +25, 100, 33, 
                    33, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
                    
        
        var oTextLineStroke =  new CTLText(_oContainer, 
                    -90, -_oBg.regY * 0.5 +74, 180, 33, 
                    33, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LINES,
                    true, true, false,
                    false );
                    
        oTextLineStroke.setOutline(4);

        var oTextLine = new CTLText(_oContainer, 
                    -90, -_oBg.regY * 0.5 +74, 180, 33, 
                    33, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LINES,
                    true, true, false,
                    false );
                    
                    
        _oTextLineStroke =  new CTLText(_oContainer, 
                    -45, -_oBg.regY * 0.5 +124, 100, 33, 
                    33, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );
                    
        _oTextLineStroke.setOutline(4);

        _oTextLine = new CTLText(_oContainer, 
                    -45, -_oBg.regY * 0.5 +124, 100, 33, 
                    33, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    "1",
                    true, true, false,
                    false );

    };

    this.refreshLevel = function (iLevel) {
        _oTextNumLevel.refreshText( iLevel);
        _oTextNumLevelStroke.refreshText(iLevel);
    };

    this.refreshLines = function (iLines) {
        _oTextLineStroke.refreshText( iLines);
        _oTextLine.refreshText(iLines);
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


