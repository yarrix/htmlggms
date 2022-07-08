function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oButContinue;
    var _oFade;
    var _oAudioToggle;
    var _oButCredits;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    
    this._init = function(){
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var szPlayText;
        if(s_oLocalStorage.isUsed()){
            szPlayText = TEXT_NEW;
            
            var oSprite = s_oSpriteLibrary.getSprite('but_play');
            _oButContinue = new CTextButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -400,oSprite,TEXT_CONTINUE,SECONDARY_FONT,"#ffffff",100, s_oStage);
            _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinue, this);
            _oButContinue.animNotify();
            
        }else {
            szPlayText = TEXT_PLAY;
        }

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CTextButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -600,oSprite,szPlayText,SECONDARY_FONT,"#ffffff",100, s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);

     
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_credits');
        _pStartPosCredits = {x:(oSprite.height/2)+ 10, y:(oSprite.height/2) + 10};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite, s_oStage);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onButCreditRelease, this);
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        if(!s_oLocalStorage.isAvailable()){
            new CMsgBox(TEXT_IOS_PRIVATE);
        }
        
    };
    
    this.unload = function(){
        _oButPlay.unload(); 
        _oButPlay = null;
        
        if(_oButContinue){
            _oButContinue.unload(); 
            _oButContinue = null;
        }
        
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        s_oStage.removeChild(_oBg);
        _oBg = null;
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButCredits.setPosition(_pStartPosCredits.x + iNewX, iNewY + _pStartPosCredits.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }   
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButPlayRelease = function(){
        if(s_oLocalStorage.isUsed()){
            var _oConfirmPanel = new CAreYouSurePanel(s_oMenu._onConfirmExit);
            _oConfirmPanel.setMsg(TEXT_WARNING_NEW_GAME);
        }else {
            this._onConfirmExit();
        }
    };

    this._onConfirmExit = function(){
        s_oLocalStorage.deleteData();
        
        s_oMenu.unload();
        $(s_oMain).trigger("start_session");
        s_oMain.goToModeMenu();
    };

    this._onButContinue = function(){
        s_oMenu.unload();
        $(s_oMain).trigger("start_session");
        
        s_oMain.gotoGame();
    };

    this._onButCreditRelease = function(){

        new CCreditsPanel();
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
    
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;