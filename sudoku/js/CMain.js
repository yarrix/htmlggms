function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage, true);
		
	s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	s_oLocalStorage = new CLocalStorage(GAME_NAME);
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);

        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});


        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
         
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                       

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
        
        
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./sprites/ctl_logo.png");
        
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_mode_menu","./sprites/bg_mode_menu.jpg");
        s_oSpriteLibrary.addSprite("mod_easy_icon","./sprites/mod_easy_icon.png");
        s_oSpriteLibrary.addSprite("mod_medium_icon","./sprites/mod_medium_icon.png");
        s_oSpriteLibrary.addSprite("mod_hard_icon","./sprites/mod_hard_icon.png");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("bg_help","./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("bg_help2","./sprites/bg_help2.png");     
        s_oSpriteLibrary.addSprite("arrow","./sprites/arrow.png");
        
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("config_icon","./sprites/config_icon.png");    
        s_oSpriteLibrary.addSprite("but_help_icon","./sprites/but_help_icon.png"); 
        s_oSpriteLibrary.addSprite("but_help_note","./sprites/but_help_note.png");
        s_oSpriteLibrary.addSprite("but_del_note","./sprites/but_del_note.png");
        s_oSpriteLibrary.addSprite("but_solve","./sprites/but_solve.png");
        s_oSpriteLibrary.addSprite("but_reset","./sprites/but_reset.png");
        s_oSpriteLibrary.addSprite("but_time","./sprites/but_time.png");
        s_oSpriteLibrary.addSprite("but_help_hint","./sprites/but_help_hint.png");
        s_oSpriteLibrary.addSprite("time_display","./sprites/time_display.png");
        
        s_oSpriteLibrary.addSprite("given_bg","./sprites/given_bg.png");
        s_oSpriteLibrary.addSprite("blank","./sprites/blank.png");
        s_oSpriteLibrary.addSprite("background","./sprites/background.png");
        s_oSpriteLibrary.addSprite("highlight","./sprites/highlight.png");
        s_oSpriteLibrary.addSprite("cell_selected","./sprites/cell_selected.png");
        s_oSpriteLibrary.addSprite("but_num","./sprites/but_num.png");
        s_oSpriteLibrary.addSprite("but_del_toggle","./sprites/but_del_toggle.png");
        s_oSpriteLibrary.addSprite("note_toggle","./sprites/note_toggle.png");
        s_oSpriteLibrary.addSprite("mode_toggle","./sprites/mode_toggle.png");
	s_oSpriteLibrary.addSprite("credit_bg","./sprites/credit_bg.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_fullscreen_help","./sprites/but_fullscreen_help.png");
        s_oSpriteLibrary.addSprite("but_undo","./sprites/but_undo.png");
        s_oSpriteLibrary.addSprite("arrow_back","./sprites/arrow_back.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
        
    this.goToModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };    

    this.gotoGame = function(iMode){
        s_iDifficultyMode=iMode;
        _oGame = new CGame(_oData);  
        
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(s_bAudioActive){
                Howler.mute(false);
        }
        
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    s_bAudioActive = oData.audio_enable_on_startup;

    this.initContainer();
}
var s_bMobile;
var s_iDifficultyMode;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_bFullscreen = false;
var s_aSounds;
var s_aSoundsInfo;