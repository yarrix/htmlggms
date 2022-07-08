function CPausePanel(){
    
    var _oBg;
    var _oGroup;    
    var _oMsgText;
    

    
    this._init = function(){

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));

        _oMsgText = new createjs.Text(TEXT_PAUSE," 120px " +SECONDARY_FONT, PRIMARY_FONT_COLOUR);
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2);
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 700;

        _oGroup = new createjs.Container();
        
        _oGroup.addChild(_oBg, _oMsgText);

        s_oStage.addChild(_oGroup);
        s_oStage.update();

    };
    
    this.unload = function(){
        s_oStage.removeChild(_oGroup);
    };
    
    this._init();
    
}

