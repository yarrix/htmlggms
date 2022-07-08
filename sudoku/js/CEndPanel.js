function CEndPanel(oSpriteBg, bNote, bSolve, bTime, iNumHint, iScore){
    
    var _iScore;
    
    var _aHelpUsed;
    var _aHelp;
    
    var _oBg;
    var _oGroup;    
    var _oMsgText;
    var _oHelpText;
    var _oScore;
    var _oListener;
    

    
    this._init = function(oSpriteBg, bNote, bSolve, bTime, iNumHint, iScore){
        
        _iScore = iScore;
        
        /// PROGRESSIVELY SCALE POINTS BASED ON HELPS USED
        if(iNumHint > 0){
            var iReductionFactor = Math.floor(TIME_BONUS_LIMIT[s_iDifficultyMode]/4000);
            
            _iScore -= iReductionFactor*iNumHint;
        }
        
        if(bNote){
            _iScore /= 2;
        }

        if(bSolve || bTime){
            _iScore = 0;
        }
        
        if(_iScore < 0){
            _iScore = 0;
        }
        
        _aHelpUsed = new Array();
        if(bNote){
            _aHelpUsed.push(TEXT_HELP_NOTE+ " "+TEXT_INFO_NOTE);
        }
        if(bSolve){
            _aHelpUsed.push(TEXT_HELP_SOLVE + " "+TEXT_INFO_SOLVE);
        }
        if(bTime){
            _aHelpUsed.push(TEXT_HELP_TIME + " "+TEXT_INFO_SOLVE);
        }
        if(iNumHint > 0){
            
            if(iNumHint > 1){
                _aHelpUsed.push(iNumHint+ TEXT_HELP_HINTS + " (-"+iReductionFactor+" " + TEXT_INFO_HINT);
            } else {
                _aHelpUsed.push(iNumHint+ TEXT_HELP_HINT + " (-"+iReductionFactor+" " + TEXT_INFO_HINT);
            }
        }
        
        
        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(oSpriteBg);
        _oGroup.addChild(_oBg);

        _oMsgText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-350, (CANVAS_HEIGHT/2)-562, 700, 300, 
                    80, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
        
        _oHelpText = new CTLText(_oGroup, 
                    CANVAS_WIDTH/2-350, (CANVAS_HEIGHT/2) - 220, 700, 80, 
                    50, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        
        _aHelp = new Array();

        var oPos = {x: CANVAS_WIDTH/2-350};
        
        _aHelp[0] = new CTLText(_oGroup, 
                    oPos.x, (CANVAS_HEIGHT/2) - 90, 700, 80, 
                    40, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        
        _aHelp[1] = new CTLText(_oGroup, 
                    oPos.x, (CANVAS_HEIGHT/2) +10, 700, 80, 
                    40, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        
        _aHelp[2] = new CTLText(_oGroup, 
                    oPos.x, (CANVAS_HEIGHT/2) +110, 700, 80, 
                    40, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );
                    

        
        _aHelp[3] = new CTLText(_oGroup, 
                    oPos.x, (CANVAS_HEIGHT/2) +210, 700, 80, 
                    40, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, true,
                    false );

        _oScore = new CTLText(_oGroup, 
                    oPos.x, (CANVAS_HEIGHT/2) + 380, 700, 70, 
                    70, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );

    };
    
    this.unload = function(){
        _oGroup.off("mousedown",_oListener);
    };
    
    this._initListener = function(){
        _oListener = _oGroup.on("mousedown",this._onExit);
    };
    
    this.show = function(iTime){
        playSound("game_over",1,false);
        
        iTime = formatTime(iTime);
        
        var aModality = new Array();
        aModality[0] = TEXT_EASY;
        aModality[1] = TEXT_MEDIUM;
        aModality[2] = TEXT_EASY;
        
        if(!bTime){
            _oMsgText.refreshText(TEXT_GAMEOVER + aModality[s_iDifficultyMode] + TEXT_SUDOKU + TEXT_IN + iTime);
        } else {
            _oMsgText.refreshText(TEXT_GAMEOVER + aModality[s_iDifficultyMode] + TEXT_SUDOKU);
        }

        if(_aHelpUsed.length === 1){
            _oHelpText.refreshText(TEXT_HELP_USED); 
        } else if(_aHelpUsed.length > 1){
            _oHelpText.refreshText(TEXT_HELPS_USED); 
        }


        if (_aHelpUsed.length > 0){
            for(var i=0; i<_aHelpUsed.length; i++){
                _aHelp[i].refreshText("-"+_aHelpUsed[i]);
            }
        }
        
        
        
        _oScore.refreshText(TEXT_SCORE +" " +_iScore);    
 
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
		
        $(s_oMain).trigger("save_score",[_iScore, s_iDifficultyMode, iTime, bNote, bSolve, bTime, iNumHint]);

        
        $(s_oMain).trigger("share_event",iScore);
        
        $(s_oMain).trigger("end_level",1);
    };
    
    this._onExit = function(){
        _oGroup.off("mousedown",_oListener);
        s_oStage.removeChild(_oGroup);
        
        $(s_oMain).trigger("end_session");
        
        s_oGame.onExit();
    };
    
    this._init(oSpriteBg, bNote, bSolve, bTime, iNumHint, iScore);
    
    return this;
}
