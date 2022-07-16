function CMsgBox(szMsg, oFunction) {
    var _oTitle;
    var _oButYes;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;

    this._init = function (szMsg, oFunction) {
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oFade.alpha = 0.01;
        _oFade.on("mousedown",function(){});
        s_oStage.addChild(_oFade);
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('credit_bg');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;  
        _pStartPanelPos = {x: _oPanelContainer.x, y: _oPanelContainer.y};

        _oTitle = new CTLText(_oPanelContainer, 
                    -450, -190, 900, 270, 
                    46, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    szMsg,
                    true, true, true,
                    false );


        _oButYes = new CGfxButton(380, 190, s_oSpriteLibrary.getSprite('but_yes'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);
        _oButYes.pulseAnimation();
        
    };

    this._onButYes = function () {
        _oParent.unload();
    };

    this.changeMessage = function(szText){
        _oTitle.refreshText(szText);
    };

    this.unload = function () {
        _oButYes.unload();

        s_oStage.removeChild(_oFade);
        s_oStage.removeChild(_oPanelContainer);

        _oFade.off("mousedown",function(){});
    };

    _oParent = this;
    this._init(szMsg, oFunction);
}

