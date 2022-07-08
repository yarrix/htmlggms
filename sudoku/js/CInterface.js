function CInterface(){
    
    var _aButton;
    var _oButDelete;
    var _oToggleNote;
    var _oToggleMode;
    var _oButHelp;
    var _oTimeNum;
    var _oTimePane;
    var _oAudioToggle;
    var _oButConf;
    var _oButExit;
    var _oButUndo;
    var _oConfigPanel;
    var _oAreYouSurePanel;

    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosConf;
    var _pStartPosHelp;
    var _pStartPosUndo;
    
    
    this._init = function(){                
        
        _aButton = new Array();
        var oButStartPos = {x: 97, y: 1500};
        var oOffset = {x: 177.5, y:150};
        for(var i=0; i<9; i++){
            if(i>5){
                _aButton[i+1] = new CNumButton(oButStartPos.x + (i-6)*oOffset.x , oButStartPos.y + oOffset.y ,i+1);
            }else {
                _aButton[i+1] = new CNumButton(oButStartPos.x +i*oOffset.x, oButStartPos.y  ,i+1);
            }                        
        };
        
        var oSprite = s_oSpriteLibrary.getSprite('but_del_toggle');
        _oButDelete = new CDeleteButton(oButStartPos.x + 3*oOffset.x , oButStartPos.y  + oOffset.y, oSprite,false);
        _oButDelete.changeMode();
        
        var oSprite = s_oSpriteLibrary.getSprite('note_toggle');
        _oToggleNote = new CToggle(oButStartPos.x + 4*oOffset.x , oButStartPos.y  + oOffset.y,oSprite,true,s_oStage);
        _oToggleNote.addEventListener(ON_MOUSE_UP, this._onNoteToggle, this); 
        
        var oSprite = s_oSpriteLibrary.getSprite('mode_toggle');
        _oToggleMode = new CToggle(oButStartPos.x + 5*oOffset.x , oButStartPos.y  + oOffset.y,oSprite,true,s_oStage);
        _oToggleMode.addEventListener(ON_MOUSE_UP, this._onModeToggle, this);
        
        
       
        var oExitX;        
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 20, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 175;
        _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 10};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }
        
        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 257;
        
        var oSprite = s_oSpriteLibrary.getSprite('config_icon');
        _pStartPosConf = {x: oExitX, y: (oSprite.height/2) + 10};
        _oButConf = new CGfxButton(_pStartPosConf.x,_pStartPosConf.y,oSprite,s_oStage);
        _oButConf.addEventListener(ON_MOUSE_UP, this._onConf, this);

        oExitX = CANVAS_WIDTH - (oSprite.width/2) - 490;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_help_icon');
        _pStartPosHelp = {x: oExitX, y: (oSprite.height/2) + 10};
        _oButHelp = new CGfxButton(_pStartPosHelp.x,_pStartPosHelp.y,oSprite,s_oStage);
        _oButHelp.addEventListener(ON_MOUSE_UP, this._onHelpPress, this);

        oExitX = _pStartPosHelp.x - oSprite.width - 10;
        
        var oSprite = s_oSpriteLibrary.getSprite('but_undo');
        _pStartPosUndo = {x: oExitX, y: (oSprite.height/2) + 10};
        _oButUndo = new CGfxButton(_pStartPosUndo.x,_pStartPosUndo.y,oSprite,s_oStage);
        _oButUndo.addEventListener(ON_MOUSE_UP, this._onUndoPress, this);
        this.disableUndo();

        var oSprite = s_oSpriteLibrary.getSprite('time_display');
        _oTimePane = createBitmap(oSprite);
        _oTimePane.x = 30;
        _oTimePane.y = 260;
        s_oStage.addChild(_oTimePane);

        _oTimeNum = new CTLText(s_oStage, 
                    55, 276, 150, 60, 
                    60, "center", "#fff", PRIMARY_FONT, 1.1,
                    0, 0,
                    "00:00",
                    true, true, false,
                    false ); 

        
       
       this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();

        for(var i=0; i<9; i++){
            _aButton[i+1].unload();
        }
        _oButDelete.unload();
        _oToggleNote.unload();
        _oToggleMode.unload();
        _oButHelp.unload();
        _oButUndo.unload();
        _oConfigPanel = null;
        s_oInterface = null;

    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        _oButConf.setPosition(_pStartPosConf.x - iNewX,iNewY + _pStartPosConf.y);
        _oButHelp.setPosition(_pStartPosHelp.x - iNewX,iNewY + _pStartPosHelp.y);
        _oButUndo.setPosition(_pStartPosUndo.x - iNewX,iNewY + _pStartPosUndo.y)
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }    
    };
    
    this.refreshTime = function(iValue){
        _oTimeNum.refreshText(iValue);
    };

    this._onConf = function(){
        _oConfigPanel = new CConfigPanel();
    };
   
    this.setNoTime = function(){
        s_oStage.removeChild(_oTimeNum.getText());
        s_oStage.removeChild(_oTimePane);
    };
   
    this._onHelpPress = function(){
        new CHelpPanel();
        s_oGame.pauseTimer(true);
    };
   
    this.enableUndo = function(){
        _oButUndo.enable();
    };
   
    this.disableUndo = function(){
        _oButUndo.disable();
    };
    
    this._onUndoPress = function(){
        s_oGame.undo();
    };
   
    this._onNoteToggle = function(){
        s_oGame.setNoteState();
    };

    this._onModeToggle = function(){
        for(var i=0; i<9; i++){
            _aButton[i+1].changeMode();
        }
        _oButDelete.changeMode();
        this.setAllBlackColor();
        s_oGame.setDigitState();
    };
    
    this.updateCounterOnButton = function(iNum, iLength){
        if(iNum>0 && iNum<=9){
           _aButton[iNum].clearCounter();
            _aButton[iNum].setCounter(iLength); 
        }
        
    };
    
    this.pressNumButton = function(iNum){
        _aButton[iNum].buttonDown();
    };
    
    this.releaseNumButton = function(iNum){
        _aButton[iNum].buttonRelease();
    };
    
    this.pressDelButton = function(){
        _oButDelete.buttonDown();
    };
    
    this.releaseDelButton = function(iNum){
        _oButDelete.buttonRelease();
    };

    this.setAllBlackColor = function(){
        for(var i=0; i<9; i++){
            _aButton[i+1].changeNumColor(false);
        }
        
        _oButDelete.reset();
    };  
    
    this.resetFullscreenBut = function(){
        if (_oConfigPanel){
            _oConfigPanel.resetFullscreenBut();
        }
    };
    
    this.onExitFromConfig = function(){
        _oConfigPanel = null;
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){
        _oAreYouSurePanel = new CAreYouSurePanel(s_oInterface._onConfirmExit);
    };
    
    this._onNegateExit = function(){
        _oAreYouSurePanel = null;
    };
    
    this._onConfirmExit = function(){
        _oAreYouSurePanel = null;
        
        $(s_oMain).trigger("end_level",1);
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        s_oGame.onExit();  
    };
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;