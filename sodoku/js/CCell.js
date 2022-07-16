function CCell(iX, iY, oLogicPos, oParentContainer){
    
    var _bGiven;
    
    var _iNumber;    
    
    var _aNotePos;
    var _aNote;
    
    var _oParent;
    var _oLogicPos;
    var _oHighLight;
    var _oBackGround;
    var _oCorner;
    var _oNumber;    
    var _oCellContainer;
    
    this._init= function(iX, iY, oLogicPos, oParentContainer){
        
        _bGiven = false;
        
        var iCellSize = CELL_SIZE;
        _iNumber = 0;
        
        _aNote = new Array();
        
        _oCellContainer = new createjs.Container();
        _oCellContainer.x = iX;
        _oCellContainer.y = iY;
        oParentContainer.addChild(_oCellContainer);
        
        _oLogicPos = {row: oLogicPos.row, col: oLogicPos.col};
        
        var oSprite = s_oSpriteLibrary.getSprite('background');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX:(oSprite.width/2)/2, regY:oSprite.height/2}, 
                        animations: {white:[0],grey:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);         
        _oBackGround = createSprite(oSpriteSheet, "white",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);       
        _oCellContainer.addChild(_oBackGround);
        
        var oSprite = s_oSpriteLibrary.getSprite('highlight');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/3, height: oSprite.height, regX:(oSprite.width/3)/2, regY:oSprite.height/2}, 
                        animations: {yellow:[0],green:[1], red:[2]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);         
        _oHighLight = createSprite(oSpriteSheet, "yellow",(oSprite.width/3)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
        _oHighLight.alpha = 0.9;
        _oHighLight.visible = false;        
        _oCellContainer.addChild(_oHighLight);
        
        _aNotePos = new Array();
        var iNoteOffset = iCellSize/3;
        _aNotePos[1] = {x: -iNoteOffset, y: -iNoteOffset};
        _aNotePos[2] = {x: 0, y: -iNoteOffset};
        _aNotePos[3] = {x: iNoteOffset, y: -iNoteOffset};
        _aNotePos[4] = {x: -iNoteOffset, y: 0};
        _aNotePos[5] = {x: 0, y: 0};
        _aNotePos[6] = {x: iNoteOffset, y: 0};
        _aNotePos[7] = {x: -iNoteOffset, y: iNoteOffset};
        _aNotePos[8] = {x: 0, y: iNoteOffset};
        _aNotePos[9] = {x: +iNoteOffset, y: iNoteOffset};
        this.clearAllNote();
        
        var oSprite = s_oSpriteLibrary.getSprite('cell_selected');
        _oCorner = createBitmap(oSprite);
        _oCorner.regX = oSprite.width/2;
        _oCorner.regY = oSprite.height/2;
        _oCorner.visible = false;
        _oCellContainer.addChild(_oCorner);
        
        var graphics = new createjs.Graphics().beginFill("rgba(158,158,158,0.01)").drawRect(-iCellSize/2, -iCellSize/2, iCellSize, iCellSize);
        _oCellContainer.on("click", this._setActive);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oCellContainer);
    };
    
    this.setGiven = function(iNum){
        if(iNum !== 0){
            _oBackGround.gotoAndStop("grey");
            _bGiven = true;
        }        
        this.setNumber(iNum);        
    };
    
    this.getGiven = function (){
        return _bGiven;
    };        
    
    this.setHintNumber = function(iNum){
        if(iNum === 0){
            return;
        }
        this.clearNumber();
        this.clearAllNote();
        _oNumber = new createjs.Text(iNum,"bold 80px "+PRIMARY_FONT, "#add8fd");
        _oNumber.textAlign = "center";
        _oNumber.textBaseline = "middle";
        _oCellContainer.addChild(_oNumber);
        _iNumber = iNum;
    };
    
    this.setNumber = function(iNum){
        if(iNum === 0){
            return;
        }
        this.clearNumber();
        this.clearAllNote();
        _oNumber = new createjs.Text(iNum,"bold 80px "+PRIMARY_FONT, "#000000");
        _oNumber.textAlign = "center";
        _oNumber.textBaseline = "middle";
        _oCellContainer.addChild(_oNumber);
        _iNumber = iNum;
    };
    
    this.getNumber = function(){
        return _iNumber;
    };
    
    this.clearNumber = function(){
        _iNumber = 0;
        _oCellContainer.removeChild(_oNumber);
    };
    
    this.setNote = function(iNum){
        if(_iNumber !== 0){
            return;
        }
        
        if(_aNote[iNum] !== 0){
            this.clearNote(iNum);
        } else {
            _aNote[iNum] = new createjs.Text(iNum," 30px "+PRIMARY_FONT, "#000000");
            _aNote[iNum].textAlign = "center";
            _aNote[iNum].textBaseline = "middle";
            _aNote[iNum].x = _aNotePos[iNum].x;
            _aNote[iNum].y = _aNotePos[iNum].y;
            _oCellContainer.addChild(_aNote[iNum]);
        }   
    };
    
    this.setHelpNote = function(iNum){
        this.clearNote(iNum);
        _aNote[iNum] = new createjs.Text(iNum," 30px "+PRIMARY_FONT, "#000000");
        _aNote[iNum].textAlign = "center";
        _aNote[iNum].textBaseline = "middle";
        _aNote[iNum].x = _aNotePos[iNum].x;
        _aNote[iNum].y = _aNotePos[iNum].y;
        _oCellContainer.addChild(_aNote[iNum]);
    };
    
    this.getNote = function(iNum){
        return _aNote[iNum];
    };
    
    this.getAllNotesWritten = function(){
        var aListNotes = new Array();
        for(var i=1; i<=9; i++){
            if(_aNote[i] !== 0){
                aListNotes.push(i);
            }
        }
        return aListNotes;
    };
    
    this.clearNote = function(iNum){
        _oCellContainer.removeChild(_aNote[iNum]);
        _aNote[iNum] = 0;
    };
    
    this.clearAllNote = function(){
        for(var i=1; i<10; i++){  
            _oCellContainer.removeChild(_aNote[i]);
            _aNote[i] = 0;
        }
    };
    
    this.clearCell = function(){         
        this.clearNumber();
        this.clearAllNote();
    };
    
    this.highlight = function(szType){
        _oHighLight.visible = true;
        if(szType !== "off"){
            _oHighLight.gotoAndStop(szType);
        } else {
            _oHighLight.visible = false;
        }        
    };
    
    this.setCorner = function(bActive){
        if(bActive){
            _oCorner.visible = true;
        } else {
            _oCorner.visible = false;
        }
    };
    
    this._setActive = function(){        
        _oParent.highlight("yellow");        
        s_oGame.activeCell(_oLogicPos);
    };
    
    _oParent = this;
    this._init(iX, iY, oLogicPos, oParentContainer);

}