function CGfxButton(iXPos,iYPos,oSprite, oParentContainer){
    var _bDisable;
    
    var _iScaleFactor;
    var _iWidth;
    var _iHeight;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oListenerMouseDown;
    var _oListenerMouseUp;
    var _oListenerMouseOver;
    var _oParentContainer;
    var _oTween;
    var _oParent;
    
    this._init =function(iXPos,iYPos,oSprite, oParentContainer){
        _iScaleFactor = 1;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        
        _oButton = createBitmap(oSprite);
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
                                   
        _oButton.regX = _iWidth/2;
        _oButton.regY = _iHeight/2;
       
        _oParentContainer = oParentContainer;
        
        _oParentContainer.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
       _oButton.off("mousedown", _oListenerMouseDown);
       _oButton.off("pressup" , _oListenerMouseUp); 
       
       if(!s_bMobile){
           _oButton.off("mouseover", _oListenerMouseOver);
       }
       
       _oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
       _oListenerMouseDown = _oButton.on("mousedown", this.buttonDown);
       _oListenerMouseUp = _oButton.on("pressup" , this.buttonRelease);  
       
       if(!s_bMobile){
           _oListenerMouseOver = _oButton.on("mouseover", this.buttonOver);
       }
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){
        if(_bDisable){
            return;
        }
        
        if(!_oTween){
            _oButton.scaleX = _iScaleFactor;
            _oButton.scaleY = _iScaleFactor;
        }


        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonDown = function(){
        if(_bDisable){
            return;
        }
        
        if(!_oTween){
            _oButton.scaleX = 0.9*_iScaleFactor;
            _oButton.scaleY = 0.9*_iScaleFactor;
        }
        

        playSound('click', 1, false);

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.buttonOver = function(evt){
        if(!s_bMobile){
            evt.target.cursor = "pointer";
        }  
    };
    
    this.pulseAnimation = function () {
        _oTween = createjs.Tween.get(_oButton, {loop:true}).to({scaleX: _iScaleFactor*1.1, scaleY: _iScaleFactor*1.1}, 850, createjs.Ease.quadOut).to({scaleX: _iScaleFactor, scaleY: _iScaleFactor}, 650, createjs.Ease.quadIn);
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };

    this.enable = function(){
        _bDisable = false;
        
        _oButton.filters = [];

        _oButton.cache(0,0,_iWidth,_iHeight);
    };
    
    this.disable = function(){
        _bDisable = true;
        
        try{
            var matrix = new createjs.ColorMatrix().adjustSaturation(-100).adjustBrightness(40);
            _oButton.filters = [
                     new createjs.ColorMatrixFilter(matrix)
            ];
            _oButton.cache(0,0,_iWidth,_iHeight);
        }catch(e){
            //console.log(e);
        }
        
    };

    this._init(iXPos,iYPos,oSprite, oParentContainer);
    
    return this;
    _oParent = this;
}