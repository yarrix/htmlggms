function CNextBlockBoard(iX, iY, oSprite, iNextBlock, oParentContainer) {
    var _oMsgStroke;
    var _oMsg;
    var _oBg;
    var _oContainer;
    var _oContainerBlock;
    var _oBlockNext;
    var _oParentContainer;
    var _fOffsetX;
    var _fOffsetY;
    var _pStartPos;

    this._init = function (iX, iY, iNextBlock, oSprite) {

        _pStartPos = {x: iX, y: iY};
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;

        _oParentContainer.addChild(_oContainer);

        _oBg = createBitmap(oSprite);
        _oBg.regX = oSprite.width * 0.5;
        _oBg.regY = oSprite.height * 0.5;
        _oContainer.addChild(_oBg);

        _oMsgStroke = new CTLText(_oContainer, 
                    -90, -_oBg.regY + 36, 180, 33, 
                    33, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_NEXT,
                    true, true, false,
                    false );
                    

        _oMsgStroke.setOutline(5);


        _oMsg = new CTLText(_oContainer, 
                    -90, -_oBg.regY + 36, 180, 33, 
                    33, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_NEXT,
                    true, true, false,
                    false );

        _oContainerBlock = new createjs.Container();
        _fOffsetX = _oBg.regX * 0.15;
        _fOffsetY = _oBg.regY * 0.25 + 16;
        _oContainer.addChild(_oContainerBlock);

        this.createNextBlock(iNextBlock);
    };

    this.createNextBlock = function (iNextBlock) {
        _oBlockNext = new CNextBlock(BLOCKS_TYPE[iNextBlock], s_oSpriteLibrary.getSprite("cell_" + iNextBlock), _oContainerBlock);
        _oContainerBlock.x = _fOffsetX - _oBlockNext.getOffsetX();
        _oContainerBlock.y = _fOffsetY - _oBlockNext.getOffsetY();
    };

    this.refreshBlock = function (iNextBlock) {
        _oBlockNext.unload();
        this.createNextBlock(iNextBlock);
    };

    this.getStartPos = function () {
        return _pStartPos;
    };

    this.setPosition = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    _oParentContainer = oParentContainer;

    this._init(iX, iY, iNextBlock, oSprite);
    return this;
}

