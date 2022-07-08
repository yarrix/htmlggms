function CConfigPanel(){
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _oText1;
    var _oText2;
    var _oText3;
    var _oText4;
    var _oText5;
    var _oText6;
    var _oText7;

    var _oHelpBg;
    var _oGroup;
    var _oParent;
    var _oButHelp;
    var _oButDel;
    var _oButSolve;
    var _oButReset;
    var _oButTime;
    var _oButHint;
    var _oButFullscreen;
    var _oListener;
    
    var _oHelp1Container;
    var _oHelp2Container;
    var _oHelp3Container;
    var _oHelp4Container;
    var _oHelp5Container;
    var _oHelp6Container;
    var _oHelp7Container;

    this._init = function(){
        s_oGame.pauseTimer(true);
        
        var oButtonX = 750;
        
        var oParent = this;
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));        
        
        _oHelp1Container = new createjs.Container();
        _oHelp1Container.x = 130;
        _oHelp1Container.y = 450;
        s_oStage.addChild(_oHelp1Container);
  
       _oText1 = new CTLText(_oHelp1Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_GETHINT,
                    true, true, false,
                    false );
       
        var oSprite = s_oSpriteLibrary.getSprite('but_help_hint');
        _oButHint = new CGfxButton(oButtonX, 0,oSprite,_oHelp1Container);
        _oButHint.addEventListener(ON_MOUSE_UP, this._onHintPress, this); 
       
        
  
        //////////////////////////////////////////////////////////////////
        
        _oHelp2Container = new createjs.Container();
        _oHelp2Container.x = 130;
        _oHelp2Container.y = 620;
        s_oStage.addChild(_oHelp2Container);
  
        _oText2 = new CTLText(_oHelp2Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_FILL_WITH_NOTE,
                    true, true, false,
                    false );

        
        var oSprite = s_oSpriteLibrary.getSprite('but_help_note');
        _oButHelp = new CGfxButton(oButtonX, 0,oSprite,_oHelp2Container);
        _oButHelp.addEventListener(ON_MOUSE_UP, this._onHelpPress, this); 
     
         //////////////////////////////////////////////////////////////////
        
        _oHelp3Container = new createjs.Container();
        _oHelp3Container.x = 130;
        _oHelp3Container.y = 790;
        s_oStage.addChild(_oHelp3Container);
  
        _oText3 = new CTLText(_oHelp3Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_SOLVE,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_solve');
        _oButSolve = new CGfxButton(oButtonX, 0,oSprite,_oHelp3Container);
        _oButSolve.addEventListener(ON_MOUSE_UP, this._onSolvePress, this);
        
         //////////////////////////////////////////////////////////////////
        
        _oHelp4Container = new createjs.Container();
        _oHelp4Container.x = 130;
        _oHelp4Container.y = 1210;
        s_oStage.addChild(_oHelp4Container);
  
        _oText4 = new CTLText(_oHelp4Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_RESET,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_reset');
        _oButReset = new CGfxButton(oButtonX, 0,oSprite,_oHelp4Container);
        _oButReset.addEventListener(ON_MOUSE_UP, this._onResetPress, this);
        
        //////////////////////////////////////////////////////////////////
        
        _oHelp5Container = new createjs.Container();
        _oHelp5Container.x = 130;
        _oHelp5Container.y = 1390;
        s_oStage.addChild(_oHelp5Container);
  
        _oText5 = new CTLText(_oHelp5Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_DELETE_ALL_NOTE,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_del_note');
        _oButDel = new CGfxButton(oButtonX, 0,oSprite,_oHelp5Container);
        _oButDel.addEventListener(ON_MOUSE_UP, this._onDelPress, this); 
                
        //////////////////////////////////////////////////////////////////
        
        _oHelp6Container = new createjs.Container();
        _oHelp6Container.x = 130;
        _oHelp6Container.y = 1570;
        s_oStage.addChild(_oHelp6Container);
  
        _oText6 = new CTLText(_oHelp6Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_SETNOTIME,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_time');
        _oButTime = new CGfxButton(oButtonX, 0,oSprite,_oHelp6Container);
        _oButTime.addEventListener(ON_MOUSE_UP, this._onTimePress, this);
        
        //////////////////////////////////////////////////////////////////
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        _oHelp7Container = new createjs.Container();
        _oHelp7Container.x = 130;
        _oHelp7Container.y = 1030;
        s_oStage.addChild(_oHelp7Container);
            
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oText7 = new CTLText(_oHelp7Container, 
                    0, -50, 600, 50, 
                    50, "left", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_FULLSCREEN,
                    true, true, false,
                    false );
            
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _oButFullscreen = new CToggle(oButtonX,0,oSprite,s_bFullscreen,_oHelp7Container);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }
        
        
                     
        _oGroup = new createjs.Container();
        _oGroup.addChild(_oHelpBg, _oHelp1Container, _oHelp2Container, _oHelp3Container, _oHelp4Container, _oHelp5Container, _oHelp6Container,_oHelp7Container);
        s_oStage.addChild(_oGroup);     
        
        _oListener = _oHelpBg.on("pressup",function(){oParent._onExitHelp();});
        
        
    };

    this.unload = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        s_oStage.removeChild(_oGroup);
        var oParent = this;        
        _oHelpBg.off("pressup",_oListener);
        
        s_oInterface.onExitFromConfig();
    };

    this._onHelpPress = function(){
        s_oGame.fillWithNote();
        _oParent._onExitHelp();
    };
    
    this._onDelPress = function(){
        s_oGame.deleteAllNote();
        _oParent._onExitHelp();
    };

    this._onSolvePress = function(){
        s_oGame.solveAndWrite();
        _oParent.unload();
    };
    
    this._onResetPress = function(){
        $(s_oMain).trigger("restart_level",1);
        s_oGame.resetGame();
        _oParent._onExitHelp();
    };
    
    this._onTimePress = function(){
        s_oGame.setNoTime();
        _oParent._onExitHelp();
    };    

    this._onHintPress = function(){
        s_oGame.getHint();
        _oParent._onExitHelp();
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
    
    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame.pauseTimer(false);
    };
    
    _oParent=this;
    this._init();

}


