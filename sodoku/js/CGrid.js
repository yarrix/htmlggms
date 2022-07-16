function CGrid(){
    
    var _bNote;
    var _bDigitFirst;
    var _bDeleteMode;
    
    var _iCurNumActive;
    

    var _aGridCenterPos;    
    var _aCell;
    var _aListNumber;
    
    var _oGridContainer;
    var _oActiveCell;
    var _aHorizRect;
    var _aVertRect;
    
    this._init = function(){
        
        _bNote = false;
        _bDigitFirst = false;
        _bDeleteMode = false;
        
        _iCurNumActive  = 0;
        
        _oActiveCell = {row: 0, col: 0};
        
        _oGridContainer = new createjs.Container();
        _oGridContainer.x = CANVAS_WIDTH/2;
        _oGridContainer.y = 880;
        s_oStage.addChild(_oGridContainer);                    
        
        var iCellSize = CELL_SIZE;
        var iOffsetSmall = 4;
        var iOffsetBig = 10;
        var iSize = CELL_SIZE*9 + iOffsetSmall*6 + iOffsetBig*2;
        var iStart = iSize * 0.5;
        var iOffToAdd = iCellSize;
        var aPos = new Array();
        aPos.push(iCellSize*0.5);

        _aHorizRect = new Array();
        for(var i=0; i<8; i++){
            if(i%3 === 2){
                var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart, -iStart+iOffToAdd, iSize, iOffsetBig);
                iOffToAdd += iCellSize + iOffsetBig;                
            } else {
                var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart, -iStart+iOffToAdd, iSize, iOffsetSmall);
                iOffToAdd += iCellSize + iOffsetSmall;                
            }
            aPos.push(iOffToAdd -iCellSize*0.5);
            
            _aHorizRect[i] = new createjs.Shape(graphics);
            _oGridContainer.addChild(_aHorizRect[i]);
        }

        iOffToAdd = iCellSize;
        _aVertRect = new Array();
        for(var i=0; i<8; i++){
            if(i%3 === 2){
                var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart+iOffToAdd, -iStart, iOffsetBig, iSize);
                iOffToAdd += iCellSize + iOffsetBig;                
            } else {
                var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart+iOffToAdd, -iStart, iOffsetSmall, iSize);
                iOffToAdd += iCellSize + iOffsetSmall;                
            }   
            
            _aVertRect[i] = new createjs.Shape(graphics);
            _oGridContainer.addChild(_aVertRect[i]);
        }
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart-iOffsetBig, -iStart-iOffsetBig, iOffsetBig, iSize+2*iOffsetBig);
        var oLeftEdge = new createjs.Shape(graphics);
        _oGridContainer.addChild(oLeftEdge);
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(iStart, -iStart-iOffsetBig, iOffsetBig, iSize+2*iOffsetBig);
        var oRightEdge = new createjs.Shape(graphics);
        _oGridContainer.addChild(oRightEdge);
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart -iOffsetBig, -iStart-iOffsetBig, iSize+2*iOffsetBig, iOffsetBig);
        var oTopEdge = new createjs.Shape(graphics);
        _oGridContainer.addChild(oTopEdge);
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,1)").drawRect(-iStart -iOffsetBig, +iStart, iSize+2*iOffsetBig, iOffsetBig);
        var oBotEdge = new createjs.Shape(graphics);
        _oGridContainer.addChild(oBotEdge);
        
        
        _aGridCenterPos = new Array(); 
        for (var i=0; i<9; i++){
            _aGridCenterPos[i]= new Array();
            for (var j=0; j<9; j++){
                _aGridCenterPos[i][j] = {x: aPos[j]  , y:aPos[i]};
            }
        }
        
        _aCell = new Array();
        for (var i=0; i<9; i++){
            _aCell[i]= new Array();
            for (var j=0; j<9; j++){
                var oLogicPos = {row: i, col: j};
                _aCell[i][j] = new CCell(_aGridCenterPos[i][j].x - iStart, _aGridCenterPos[i][j].y - iStart, oLogicPos, _oGridContainer);              
            }
        }

        _aListNumber = new Array();
        for (var i=0; i<10; i++){
            _aListNumber[i] = new Array();
        }

    };
   
    this.setCurNum = function(iNum){
        _iCurNumActive = iNum;
    };
    
    this.setActiveCell = function(oLogicPos){
        
        this.turnOffAllCells();
        _oActiveCell = {row: oLogicPos.row, col: oLogicPos.col};
        this.highlightCells();        
        if(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber() !== 0){
            this.showSameNumbers(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber() );
        }
    };
    
    this.showCorner = function(){
        _aCell[_oActiveCell.row][_oActiveCell.col].setCorner(true);

    };
   
    this.turnOffAllCells = function(){
        for (var i=0; i<9; i++){
            for (var j=0; j<9; j++){
                _aCell[i][j].highlight("off");
            }
        }                

        _aCell[_oActiveCell.row][_oActiveCell.col].setCorner(false);

        
    };
    
    this.showSameNumbers = function(iNum){
        if(iNum !== 0){
            for(var i=0; i<_aListNumber[iNum].length; i++){
                _aCell[_aListNumber[iNum][i].row][_aListNumber[iNum][i].col].highlight("green");
            }
            
            for(var i=0; i<9; i++){
                for(var j=0; j<9; j++){
                    
                    if(_aCell[i][j].getNote(iNum) !== 0){
                        _aCell[i][j].highlight("green");
                    }
                }
            }           
        }      
    };
    
    this.highlightCells = function(){
            this.showCorner();
            
            for(var i=0; i<9; i++){
                _aCell[_oActiveCell.row][i].highlight("yellow");
            }

            for(var i=0; i<9; i++){
                _aCell[i][_oActiveCell.col].highlight("yellow");
            }        

            var row = Math.floor(_oActiveCell.row / 3) * 3;
            var col = Math.floor(_oActiveCell.col / 3) * 3;

            for (var r = 0; r < 3; r++)
                for (var c = 0; c < 3; c++)
                    _aCell[row + r][col + c].highlight("yellow");       
    };
    
    
    this.deleteCell = function(){
        if (_aCell[_oActiveCell.row][_oActiveCell.col].getGiven()){
                return;
        }
        if(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber() !== 0){
            s_oGame.checkEndGame("remove");
        } 
        this.deleteSmartFromList( _aCell[_oActiveCell.row][_oActiveCell.col].getNumber());
        _aCell[_oActiveCell.row][_oActiveCell.col].clearCell();

        
        this.turnOffAllCells();
        this.highlightCells();
    };
    
    this.writeNum = function(iNum){
        if (_aCell[_oActiveCell.row][_oActiveCell.col].getGiven() || iNum === 0 || iNum === _aCell[_oActiveCell.row][_oActiveCell.col].getNumber()){
                return;
        }
        this.turnOffAllCells();
        this.highlightCells();
        
        if(this.checkCollision(iNum, _oActiveCell.row, _oActiveCell.col, true)){
            return;
        }
        if(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber() !== 0){
            this.deleteCell();
        }  
           
        _aCell[_oActiveCell.row][_oActiveCell.col].setNumber(iNum);
        this.insertSmartInList(iNum);
        this.updateNote(iNum);
        this.showSameNumbers(iNum);

        s_oGame.checkEndGame("add");  
        
        return true;
    };
    
    this.resumeNum = function(iNum, iRow, iCol){
        _aCell[iRow][iCol].setNumber(iNum);
        _aListNumber[iNum].push({row: iRow, col: iCol });
        this.updateNote(iNum);
        
        s_oGame.checkEndGame("add");   
    };
    
    this.resumeNotes = function(aListNote, iRow, iCol){
        for(var i=0; i<aListNote.length; i++){
            var iNum = aListNote[i];
            _aCell[iRow][iCol].setNote(iNum);
        }
    };
    
    this.deleteAllNote = function(){
        for(var i=0; i<_aListNumber[0].length; i++){
            _aCell[_aListNumber[0][i].row][_aListNumber[0][i].col].clearAllNote();
        }
        this.turnOffAllCells();
        this.highlightCells();
        this.showSameNumbers(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber());
    };
    
    this.writeNote = function(iNum){
        if (_aCell[_oActiveCell.row][_oActiveCell.col].getGiven()){
                return;
        }
        this.turnOffAllCells();
        this.highlightCells();
        _aCell[_oActiveCell.row][_oActiveCell.col].setNote(iNum);
        this.showSameNumbers(_aCell[_oActiveCell.row][_oActiveCell.col].getNumber());
    };
    
    this.writeHelpNote = function(iNum, iRow, iCol){
        _aCell[iRow][iCol].setHelpNote(iNum);
    };
    
    this.getAllNotes = function(){
        var aNotesList = new Array();
        for(var i=0; i<_aCell.length; i++){
            aNotesList[i] = new Array();
            for(var j=0; j<_aCell[i].length; j++){
                aNotesList[i][j] = _aCell[i][j].getAllNotesWritten();
            }
        }
        
        return aNotesList;
    };
    
    this.setGiven = function(iRow, iCol, iNum){
        _aCell[iRow][iCol].setGiven(iNum);
        _aListNumber[iNum].push({row: iRow, col: iCol});
    };
    
    this.isGiven = function(iRow, iCol){
        return _aCell[iRow][iCol].getGiven();
    };
    
    this.setSolvedNumber = function(iRow, iCol, iNum){
        _aCell[iRow][iCol].setHintNumber(iNum);
        _aListNumber[iNum].push({row: iRow, col: iCol});

        for(var i=0; i<_aListNumber[0].length; i++){
            if(_aListNumber[0][i].row ===  iRow && _aListNumber[0][i].col ===  iCol){
                _aListNumber[0].splice(i,1);
            }
        }
    };
    
    this.setHintNumber = function(iRow, iCol, iNum){
        _aCell[iRow][iCol].setHintNumber(iNum);
        _aListNumber[iNum].push({row: iRow, col: iCol});
        for(var i=0; i<_aListNumber[0].length; i++){
            if(_aListNumber[0][i].row ===  iRow && _aListNumber[0][i].col ===  iCol){
                _aListNumber[0].splice(i,1);
            }
        }
    };
    
    this.deleteResetNumber = function(iRow, iCol){
        var iNum = _aCell[iRow][iCol].getNumber();
        if(iNum !== 0){
            for(var i=0; i<_aListNumber[iNum].length; i++){
                if(_aListNumber[iNum][i].row ===  iRow && _aListNumber[iNum][i].col ===  iCol){
                    _aListNumber[iNum].splice(i,1);
                }
            }  
            _aCell[iRow][iCol].clearCell();                      
        } 
        _aListNumber[0].push({row: iRow, col: iCol});
        
    };
    
    this.updateNote = function(iNum){
        
        for(var i=0; i<9; i++){
            //Check row
            if(_aCell[_oActiveCell.row][i].getNote(iNum) !== 0){
                _aCell[_oActiveCell.row][i].clearNote(iNum);
            }
            
            //Check col
            if(_aCell[i][_oActiveCell.col].getNote(iNum) !== 0){
                _aCell[i][_oActiveCell.col].clearNote(iNum);
            }
        }    
            //Check block
        var iBlockRow = Math.floor(_oActiveCell.row / 3) * 3;
        var iBlockCol = Math.floor(_oActiveCell.col / 3) * 3;
        for (var i = 0; i < 3; i++){
            for (var j = 0; j < 3; j++){
                if(_aCell[iBlockRow + i][iBlockCol + j].getNote(iNum) !== 0){
                    _aCell[iBlockRow + i][iBlockCol + j].clearNote(iNum);
                }
            }
        }        
        
    };
    
    this.checkCollision = function (iNum, iCurRow, iCulCol, bHighlight){
        var iBlockRow = Math.floor(iCurRow / 3) * 3;
        var iBlockCol = Math.floor(iCulCol / 3) * 3;
        for(var i=0; i<_aListNumber[iNum].length; i++){
            //Check row and col
            if(_aListNumber[iNum][i].row === iCurRow || _aListNumber[iNum][i].col === iCulCol){
                if(bHighlight){
                    _aCell[_aListNumber[iNum][i].row][_aListNumber[iNum][i].col].highlight("red");
                }
                return true;
            }
            //Check block
            if( (iBlockRow <= _aListNumber[iNum][i].row && _aListNumber[iNum][i].row < iBlockRow +3) && (iBlockCol <= _aListNumber[iNum][i].col && _aListNumber[iNum][i].col < iBlockCol +3) ){
                if(bHighlight){
                    _aCell[_aListNumber[iNum][i].row][_aListNumber[iNum][i].col].highlight("red");
                }
                return true;
            }       
        }        
    };
    
    this.deleteSmartFromList = function(iNum){        
        if(iNum !== 0){
            for(var i=0; i<_aListNumber[iNum].length; i++){
                if(_aListNumber[iNum][i].row ===  _oActiveCell.row && _aListNumber[iNum][i].col ===  _oActiveCell.col){
                    _aListNumber[iNum].splice(i,1);
                }
            }
            
            _aListNumber[0].push({row: _oActiveCell.row, col: _oActiveCell.col });
        }
            

    };
    
    this.insertSmartInList = function(iNum){
        if(iNum !== 0){
            _aListNumber[iNum].push({row: _oActiveCell.row, col: _oActiveCell.col });
        
            for(var i=0; i<_aListNumber[0].length; i++){
                if(_aListNumber[0][i].row ===  _oActiveCell.row && _aListNumber[0][i].col ===  _oActiveCell.col){
                    _aListNumber[0].splice(i,1);
                }
            }        
        }

    };
    
    this.removeList = function(iNum){
        _aListNumber[iNum] = {};
    };
    
    this.getList = function(iNum){
        return _aListNumber[iNum];
    };
    
    this.viewList = function(iIndex){
            trace(_aListNumber[iIndex]);
            trace(_aListNumber[iIndex].length);

    };
    
    this.getCurActiveCell = function(){
            return {row: _oActiveCell.row, col: _oActiveCell.col, num: _aCell[_oActiveCell.row][_oActiveCell.col].getNumber()} ;      
    };
    
    this.getCurGrid = function(){
        var aGrid = new Array();
        for(var i=0; i<9; i++){
            aGrid[i] = new Array();
            for(var j=0; j<9; j++){
                aGrid[i][j] = _aCell[i][j].getNumber();
            }
        }
        return aGrid;
    };
    
    this._init();    
}


