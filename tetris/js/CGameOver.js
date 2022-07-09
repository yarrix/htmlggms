function CGameOver(oSpriteBg, iScore, iLevel, iLines) {

    var _oGroup;
    var _oGroupMsgBox;
    var _oBg;
    var _oFade;
    var _oButMenu;
    var _oButRestart;

    this._init = function (oSpriteBg, iScore, iLevel, iLines) {
        s_oGame.setPause(true);

        _oGroup = new createjs.Container();

        _oGroupMsgBox = new createjs.Container();
        _oGroupMsgBox.y = -CANVAS_WIDTH_HALF - oSpriteBg.width * 0.5;

        _oBg = createBitmap(oSpriteBg);

        _oBg.x = CANVAS_WIDTH * 0.5;
        _oBg.y = CANVAS_HEIGHT * 0.5;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oGroupMsgBox.addChild(_oBg);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;

        _oFade.on("click", function () {});

        _oGroup.addChild(_oFade);

        var pGameOverPos = {x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.5 - 75};
        var iSizeFont = 40;
        var iSizeFontGameOver = 60;

        var oTextLevel;
        var oTextLevelStruct;
        var oTextLines;
        var oTextLinesStruct;
        var oTextGameOverScore;
        var oTextGameOverScoreStruct;
        var oTextTitle;
        var oTextTitleStruct;

        oTextTitleStruct = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-300, pGameOverPos.y - 150, 600, iSizeFontGameOver, 
                    iSizeFontGameOver, "center", "#0025c2", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );

        oTextTitleStruct.setOutline(OUTLINE_TEXT);


        oTextTitle = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-300, pGameOverPos.y-150, 600, iSizeFontGameOver, 
                    iSizeFontGameOver, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
                    


        oTextLevelStruct = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-300, pGameOverPos.y-25 , 250, iSizeFont*2, 
                    iSizeFont, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL + "\n" + iLevel,
                    true, true, true,
                    false );
        oTextLevelStruct.setOutline(OUTLINE_TEXT);            
       

        oTextLevel = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-300, pGameOverPos.y-25, 250, iSizeFont*2, 
                    iSizeFont, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LEVEL + "\n" + iLevel,
                    true, true, true,
                    false );
                    
        

        oTextLinesStruct = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x+50, pGameOverPos.y -25, 250, iSizeFont*2, 
                    iSizeFont, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LINES + "\n" + iLines,
                    true, true, true,
                    false );
                    
        
        oTextLinesStruct.setOutline(OUTLINE_TEXT);


        oTextLines = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x+50, pGameOverPos.y -25, 250, iSizeFont*2, 
                    iSizeFont, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_LINES + "\n" + iLines,
                    true, true, true,
                    false );
                    
      

        oTextGameOverScoreStruct = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-150, pGameOverPos.y +100, 300, iSizeFont*3, 
                    iSizeFont, "center", "#025cce", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE_GAMEOVER + "\n\n" + iScore,
                    true, true, true,
                    false );
                    
        
        oTextGameOverScoreStruct.setOutline(4);


        oTextGameOverScore = new CTLText(_oGroupMsgBox, 
                    pGameOverPos.x-150, pGameOverPos.y +100, 300, iSizeFont*3, 
                    iSizeFont, "center", "#ffd800", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_SCORE_GAMEOVER + "\n\n" + iScore,
                    true, true, true,
                    false );
                    
        

        _oGroup.addChild(_oGroupMsgBox);

        s_oStage.addChild(_oGroup);

        var oSpriteRestart = s_oSpriteLibrary.getSprite("but_restart");
        var oSpriteHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton((CANVAS_WIDTH / 2 - 250), CANVAS_HEIGHT / 2 + 150, oSpriteHome, _oGroupMsgBox);
        _oButMenu.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        _oButRestart = new CGfxButton((CANVAS_WIDTH / 2 + 250), CANVAS_HEIGHT / 2 + 150, oSpriteRestart, _oGroupMsgBox);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        _oButRestart.pulseAnimation();

        createjs.Tween.get(_oFade).to({alpha: 0.5}, 750, createjs.Ease.cubicOut);

        createjs.Tween.get(_oGroupMsgBox).to({y: 0}, 1500, createjs.Ease.bounceOut).call(function () {
            if (s_iAdsLevel === NUM_LEVEL_FOR_ADS) {
                $(s_oMain).trigger("show_interlevel_ad");
                s_iAdsLevel = 1;
            } else {
                s_iAdsLevel++;
            }
        });

        $(s_oMain).trigger("save_score", iScore);
        $(s_oMain).trigger("share_event", iScore);
    };

    this.unload = function () {
        _oFade.off("click", function () {});

        if (_oButMenu) {
            _oButMenu.unload();
            _oButMenu = null;
        }

        s_oStage.removeChild(_oGroup);
    };

    this._onMenu = function () {
        this.unload();
        s_oInterface._onButMenuRelease();
    };

    this._onRestart = function () {
        this.unload();
        s_oInterface._onButRestartLevelRelease();
    };

    this._init(oSpriteBg, iScore, iLevel, iLines);

    return this;
}

