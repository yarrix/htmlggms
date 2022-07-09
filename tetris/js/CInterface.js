function CInterface(iNextBlock) {
    var _pStartPosPause;
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosLogo;
    var _pStartPosFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oAudioToggle;
    var _oButPause;
    var _oButExit;
    var _oHelpPanel;
    var _oFpsText;
    var _oFpsTextStruct;
    var _oWinPanel;
    var _oCongratPanel;
    var _oGameOverPanel;
    var _oPausePanel;
    var _oNextBlockBoard;
    var _oInfoBoard;
    var _oScoreBoard;
    var _oLogo;
    var _oController = null;
    var _oButFullscreen;

    this._init = function (iNextBlock) {
        var iPadding = 30;
        var oSpriteExit = s_oSpriteLibrary.getSprite('but_exit');

        _pStartPosExit = {x: CANVAS_WIDTH - (oSpriteExit.width / 2) - iPadding, y: (oSpriteExit.height / 2) + iPadding};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSpriteExit);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSpritePause = s_oSpriteLibrary.getSprite('but_pause');
        _pStartPosPause = {x: CANVAS_WIDTH - (oSpritePause.width / 2) - (oSpriteExit.width) - iPadding - 15, y: (oSpritePause.height / 2) + iPadding};
        _oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSpritePause);
        _oButPause.addEventListener(ON_MOUSE_UP, this.onButPauseRelease, this);
        
        var oSpriteFullscreen = s_oSpriteLibrary.getSprite('but_fullscreen');
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('icon_audio');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width / 2) - (oSpritePause.width) - (oSpriteExit.width / 2) - iPadding - 30,
                y: (oSprite.height / 2) + iPadding};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            _pStartPosFullscreen = {x: _pStartPosAudio.x - oSpriteFullscreen.width/2 - 10,y:_pStartPosAudio.y};
        }else{
            _pStartPosFullscreen = {x: CANVAS_WIDTH - (oSpriteFullscreen.width / 2) - (oSpritePause.width) - (oSpriteExit.width / 2) - iPadding - 30,
                y: (oSpriteFullscreen.height / 2) + iPadding};
        }
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled ) {
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSpriteFullscreen,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        } 
        
        var oSpriteNextBoard = s_oSpriteLibrary.getSprite("next_board");
        _oNextBlockBoard = new CNextBlockBoard(800, 417, oSpriteNextBoard, iNextBlock, s_oStage);

        var oSpriteInfoBoard = s_oSpriteLibrary.getSprite("info_board");
        _oInfoBoard = new CInfoBoard(800, 757, oSpriteInfoBoard, s_oStage);

        var oSpriteScoreBoard = s_oSpriteLibrary.getSprite("score_board");
        _oScoreBoard = new CScoreBoard(800, 1051, oSpriteScoreBoard, s_oStage);

        var oSpriteLogo = s_oSpriteLibrary.getSprite("small_logo");

        _pStartPosLogo = {x: oSpriteLogo.width * 0.5 + 30, y: oSpriteLogo.height * 0.5 + 30};
        _oLogo = createBitmap(oSpriteLogo);
        _oLogo.x = _pStartPosLogo;
        _oLogo.y = _pStartPosLogo;
        _oLogo.regX = oSpriteLogo.width * 0.5;
        _oLogo.regY = oSpriteLogo.height * 0.5;
        s_oStage.addChild(_oLogo);

        if (SHOW_FPS === true) {
            var iX = -330;
            var iY = 550;
            _oFpsText = new createjs.Text("", "normal " + 60 + "px " + PRIMARY_FONT, "#ffd800");
            _oFpsText.textAlign = "center";
            _oFpsText.textBaseline = "alphabetic";
            _oFpsText.x = CANVAS_WIDTH * 0.5 + iX;
            _oFpsText.y = CANVAS_HEIGHT * 0.5 + iY;

            _oFpsTextStruct = new createjs.Text("", "normal " + 60 + "px " + PRIMARY_FONT, "#025cce");
            _oFpsTextStruct.textAlign = "center";
            _oFpsTextStruct.textBaseline = "alphabetic";
            _oFpsTextStruct.x = CANVAS_WIDTH * 0.5 + iX + 2;
            _oFpsTextStruct.y = CANVAS_HEIGHT * 0.5 + iY + 2;

            s_oStage.addChild(_oFpsTextStruct, _oFpsText);
        }

        if (s_bMobile) {
            _oController = new CController();
        }

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, _pStartPosAudio.y + s_iOffsetY);
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        _oButPause.setPosition(_pStartPosPause.x - s_iOffsetX, _pStartPosPause.y + s_iOffsetY);
        _oButExit.setPosition(_pStartPosExit.x - s_iOffsetX, _pStartPosExit.y + s_iOffsetY);

        var oPosNextBlockBoard = _oNextBlockBoard.getStartPos();
        _oNextBlockBoard.setPosition(oPosNextBlockBoard.x - s_iOffsetX, oPosNextBlockBoard.y);

        var oPosInfoBoard = _oInfoBoard.getStartPos();
        _oInfoBoard.setPosition(oPosInfoBoard.x - s_iOffsetX, oPosInfoBoard.y);

        var oPosScoreBoard = _oScoreBoard.getStartPos();
        _oScoreBoard.setPosition(oPosScoreBoard.x - s_iOffsetX, oPosScoreBoard.y);

        _oLogo.x = _pStartPosLogo.x + s_iOffsetX;
        _oLogo.y = _pStartPosLogo.y + s_iOffsetY;

        if (_oController !== null) {
            var oPosLeft = _oController.getStartPositionControlLeft();
            _oController.setPositionControlLeft(oPosLeft.x + s_iOffsetX, oPosLeft.y - s_iOffsetY);

            var oPosRight = _oController.getStartPositionControlRight();
            _oController.setPositionControlRight(oPosRight.x + s_iOffsetX, oPosRight.y - s_iOffsetY);

            var oPosUp = _oController.getStartPositionControlUp();
            _oController.setPositionControlUp(oPosUp.x - s_iOffsetX, oPosUp.y - s_iOffsetY);

            var oPosDown = _oController.getStartPositionControlDown();
            _oController.setPositionControlDown(oPosDown.x + s_iOffsetX, oPosDown.y - s_iOffsetY);
        }
    };

    this.finishGame = function (iScore) {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box")
        _oCongratPanel = new CCongratulations(oSpriteBg, iScore);
    };

    this._onButNextLevelRelease = function () {
        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);

        _oWinPanel = null;

        s_oGame.nextLevel();
    };

    this._onButSpaceBarRelease = function () {
        if (_oWinPanel) {
            _oWinPanel._onContinue();
        }
    };

    this._onButMenuRelease = function () {
        if (_oCongratPanel) {
            _oCongratPanel.unload();
            _oCongratPanel = null;
        }

        s_oGame.onExit();
    };

    this.refreshScore = function (iScore) {
        _oScoreBoard.refreshScore(iScore);
    };

    this.refreshLevel = function (iLevel) {
        _oInfoBoard.refreshLevel(iLevel);
    };

    this.refreshLines = function (iLines) {
        _oInfoBoard.refreshLines(iLines);
    };

    this.unloadPause = function () {
        _oPausePanel.unload();
        _oPausePanel = null;
    };

    this.onButPauseRelease = function () {
        _oPausePanel = new CPause();
    };

    this.onContinuePauseRelease = function () {
        if (_oPausePanel)
            _oPausePanel._onLeavePause();
    };

    this.showHelpPanel = function () {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        _oHelpPanel = new CHelpPanel(0, 0, oSpriteBg);
    };

    this.gameOver = function (iScore, iLevel, iLines) {
        var oSpriteBg = s_oSpriteLibrary.getSprite("msg_box");
        _oGameOverPanel = new CGameOver(oSpriteBg, iScore, iLevel, iLines);
    };

    this.unloadHelp = function () {
        _oHelpPanel.unload();
        _oHelpPanel = null;
    };

    this._onButRestartLevelRelease = function () {
        _oGameOverPanel = null;
        s_oGame.restartLevelFromGameOver();
        _oButExit.block(false);
    };

    this.unload = function () {

        _oButExit.unload();
        _oButExit = null;
        _oButPause.unload();
        _oButPause = null;

        if (_oController !== null) {
            _oController.unload();
            _oController = null;
        }

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        s_oInterface = null;
    };

    this.refreshNextBlock = function (iNextBlock) {
        _oNextBlockBoard.refreshBlock(iNextBlock);
    };

    this.refreshFPS = function () {
        var iFPS = Math.ceil(createjs.Ticker.getMeasuredFPS());
        _oFpsText.text = "FPS:" + iFPS;
        _oFpsTextStruct.text = "FPS:" + iFPS;
    };

    this._onExit = function () {
        var _oAreYouSure = new CAreYouSurePanel(s_oStage);
        _oAreYouSure.show();
    };

    this._onButRestartLevelRelease = function () {
        s_oGame.restartGame();
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
        }
        
        sizeHandler();
    };
    
    s_oInterface = this;

    this._init(iNextBlock);

    return this;
}

var s_oInterface = null;