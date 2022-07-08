function CHelpPanel(){
    var _oText0;
    var _oText1;
    var _oMessage;

    var _oText0Page2;
    var _oText1Page2;
    var _oText2Page2;
    var _oText3Page2;
    var _oText4Page2;        

    var _oHelpBg;
    var _oHelpBgPage2;
    var _oGroup;
    var _oGroupPage2;
    var _oParent;
    var _oListenerGroup;
    var _oListenerGroup2;
    var _oListenerArrow;
    var _oListenerArrow2;
    
    var _oArrow;
    var _oArrowPage2;

    this._init = function(){
        var oParent = this;
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup); 
        
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('bg_help'));
        _oGroup.addChild(_oHelpBg);
  
        var oText1Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2)-400};          
  
        _oText0 = new CTLText(_oGroup, 
                    oText1Pos.x-350, oText1Pos.y -210, 700, 140, 
                    140, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_HELP0,
                    true, true, false,
                    false );

  
        _oText1 = new CTLText(_oGroup, 
                    oText1Pos.x-400, oText1Pos.y , 800, 250, 
                    48, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP1,
                    true, true, true,
                    false );         
        
        _oListenerGroup = _oGroup.on("pressup",function(){oParent._onExitHelp();});
        
        _oGroupPage2 = new createjs.Container();
        _oGroupPage2.visible=0;
        s_oStage.addChild(_oGroupPage2);
        
        _oGroupPage2.on("pressup",function(){oParent._onExitHelp()});
        
        
        _oHelpBgPage2 = createBitmap(s_oSpriteLibrary.getSprite('bg_help2'));
        _oGroupPage2.addChild(_oHelpBgPage2);
  
        if(s_bMobile=== false){
            _oMessage=TEXT_HELP1_PAGE2;
        } else {
            _oMessage=TEXT_HELP1_MOB_PAGE2;
        }
  
        _oText0Page2 = new CTLText(_oGroupPage2, 
                    oText1Pos.x-400, oText1Pos.y-210 , 800, 140, 
                    140, "center", PRIMARY_FONT_COLOUR, SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_HELP0_PAGE2,
                    true, true, false,
                    false );       

  
        _oText1Page2 = new CTLText(_oGroupPage2, 
                    CANVAS_WIDTH/2-400, (CANVAS_HEIGHT/2)-470 , 800, 80, 
                    35, "center", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    _oMessage,
                    true, true, true,
                    false );     
                    

  
        _oText2Page2 = new CTLText(_oGroupPage2, 
                    CANVAS_WIDTH/2 -200, (CANVAS_HEIGHT/2) -300 , 600, 150, 
                    35, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP2_PAGE2,
                    true, true, true,
                    false );    
                    


        _oText3Page2 = new CTLText(_oGroupPage2, 
                    CANVAS_WIDTH/2 -380, (CANVAS_HEIGHT/2) +10, 600, 150, 
                    35, "right", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP3_PAGE2,
                    true, true, true,
                    false );    


        _oText4Page2 = new CTLText(_oGroupPage2, 
                    CANVAS_WIDTH/2 -200, (CANVAS_HEIGHT/2) +300, 600, 150, 
                    35, "left", PRIMARY_FONT_COLOUR, PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_HELP4_PAGE2,
                    true, true, true,
                    false ); 
        
        _oListenerGroup2 = _oGroupPage2.on("pressup",function(){oParent._onExitHelp()});

        createjs.Tween.get(_oGroupPage2).to({alpha:1}, 700);
        
        _oArrow = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrow.x = 740;
        _oArrow.y = 1450 ;
        _oArrow.alpha=0;
        _oListenerArrow = _oArrow.on("click", oParent._changePageTo2);
        if(!s_bMobile){
            _oArrow.on("mouseover", oParent.buttonOver);
        }
        s_oStage.addChild(_oArrow);
        
        _oArrowPage2 = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrowPage2.scaleX = -1;
        _oArrowPage2.x = 340;
        _oArrowPage2.y = 1450;
        _oArrowPage2.visible=false;
        _oListenerArrow2 = _oArrowPage2.on("click", oParent._changePageTo1);
        if(!s_bMobile){
            _oArrowPage2.on("mouseover", oParent.buttonOver);
        }
        s_oStage.addChild(_oArrowPage2);
        
        createjs.Tween.get(_oArrow).to({alpha:1}, 700);
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup, _oGroupPage2, _oArrow, _oArrowPage2);

        var oParent = this;
        _oGroup.off("pressup",_oListenerGroup);
        _oGroupPage2.off("pressup",_oListenerGroup2);
        
        if(!s_bMobile){
            _oArrow.off("mouseover", _oListenerArrow);
            _oArrowPage2.off("mouseover", _oListenerArrow2);
        }
    };
    
    this._changePageTo1 = function(){ 
        _oGroupPage2.visible=false;
        _oArrowPage2.visible=false;

        _oGroup.visible=true;
        _oArrow.visible=true;

    };

    this._changePageTo2 = function(){        
        _oGroup.visible=false;
        _oArrow.visible=false;

        _oGroupPage2.visible=true;
        _oArrowPage2.visible=true;
        
    };

    this.buttonOver = function(evt){
        if(!s_bMobile){
            evt.target.cursor = "pointer";
        }  
    };

    this._onExitHelp = function(){
        $(s_oMain).trigger("show_interlevel_ad");
        _oParent.unload();
        s_oGame._onExitHelp();
    };

    _oParent=this;
    this._init();

}
