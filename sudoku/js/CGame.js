function CGame(oData){
    var _bStartGame;
    var _bCalculateGrid;
    var _bNoteMode;
    var _bDeleteMode;
    var _bDigitMode;
    var _bNoteHelpUsed;
    var _bSolveHelpUsed;
    var _bTimeHelpUsed;
    
    var _iCurNumActive;
    var _iEndGameCounter;
    var _iTimeElaps;
    var _iSolution;
    var _iNumHintHelp;
    var _iAdCounter;

    var _aGridValue;
    var _aStartingGrid;
    var _aCoverMask;

    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oGrid;
    var _oBlock;
    var _oPausePanel;
    var _oPanelWhenSolve;
    var _oPanelListener;

    var _iTimeSaveData;
    var _aHistory;
    
    this._init = function(){                  
        
        _bNoteMode = false;
        _bDeleteMode = false;
        _bDigitMode = false;
        _bNoteHelpUsed = false;
        _bSolveHelpUsed = false;
        _bTimeHelpUsed = false;
        
        _iTimeElaps = 0;
        _iEndGameCounter = 0;
        _iCurNumActive = 0;
        _iNumHintHelp = 0;
        _iAdCounter = 0;
        _iTimeSaveData = 0;
        
        _aHistory = new Array();
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);

        _oPausePanel = null;
        _oInterface = new CInterface();           
    
        _oGrid = new CGrid();
    
        if(s_oLocalStorage.isUsed()){
            this.resumeGame();
        }else {
            this.setNewGame();
        }
        
    
        if(s_bMobile === false){
            document.onkeydown   = onKeyDown; 
            document.onkeyup   = onKeyUp; 
        }
    };
    
    this.unload = function(){
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

        s_oGame = null;
    };
    
    function onKeyDown(evt) { 
        if(!evt){ 
            evt = window.event; 
        } 

        evt.preventDefault();

        var iNum = evt.keyCode - 48;
        if(iNum < 10 && iNum > 0){
            _oInterface.pressNumButton(iNum);
        } else if( iNum === -2){
            _oInterface.pressDelButton();
        } else if(iNum < 58 && iNum > 48){
            iNum -= 48;
            _oInterface.pressNumButton(iNum);
        }              
    };
    
    function onKeyUp(evt) {
        
        evt.preventDefault();

        var iNum = evt.keyCode - 48;
        if(iNum < 10 && iNum > 0){
            _oInterface.releaseNumButton(iNum);
        } else if( iNum === -2){
            _oInterface.releaseDelButton();
        } else if(iNum < 58 && iNum > 48){
            iNum -= 48;
            _oInterface.releaseNumButton(iNum);
        }                 
    };      
    
    this.setNewGame = function(){
        _aGridValue = new Array(81);

        this._generateValidGrid(_aGridValue);   
        
        _aGridValue = this._convertToMatrix(_aGridValue);

        _aStartingGrid =  new Array();
        for(var i=0; i<9; i++){
            _aStartingGrid[i] = new Array();
            for(var j=0; j<9; j++){
                _aStartingGrid[i][j] = _aGridValue[i][j];
            }
        }
        _oBlock = new CSudokuLoader();

        _bCalculateGrid = true;
    };
    
    this.resumeGame = function(){
        _aStartingGrid =  new Array();
        _aGridValue =  new Array();
        _aCoverMask = new Array();
        for(var i=0; i<9; i++){
            _aStartingGrid[i] = new Array();
            _aGridValue[i] =  new Array();
            _aCoverMask[i] = new Array();
            for(var j=0; j<9; j++){
                _aGridValue[i][j] = s_aSolution[i][j];
                _aStartingGrid[i][j] = s_aSolution[i][j];
                _aCoverMask[i][j] = s_aGridMask[i][j];
            }
        }
        
        this._coverGrid(_aGridValue);
        this.setGrid(_aGridValue);

        if(s_aGridState !== null){
            for(var i=0; i<9; i++){
                for(var j=0; j<9; j++){
                    if(!_oGrid.isGiven(i,j)){
                        if(s_aGridState[i][j] !== 0){
                            //Avoid insert zero on zero
                            var iNumToResume = s_aGridState[i][j];

                            _oGrid.resumeNum(iNumToResume, i, j);
                            _oInterface.updateCounterOnButton(iNumToResume, _oGrid.getList(iNumToResume).length);

                            _aGridValue[i][j] = iNumToResume;
                        }else {
                            if(s_aNotesWritten !== null && s_aNotesWritten[i][j].length >0){
                                _oGrid.resumeNotes(s_aNotesWritten[i][j], i, j);
                            }
                        }
                    }
                }
            }
        }
        
        _bNoteHelpUsed = s_oGameParam.helpnotes;
        _bTimeHelpUsed = s_oGameParam.helptime;
        _iNumHintHelp = s_oGameParam.numhint;
        _iTimeElaps = s_oGameParam.time;
        s_iDifficultyMode = s_oGameParam.difficulty;
        
        if(_bTimeHelpUsed){
            this.setNoTime();
        }
        
        _bStartGame=true;        
    };
    
    this.saveData = function(){
        _iTimeSaveData = 0;
        
        s_oGameParam = {helpnotes:_bNoteHelpUsed, helptime:_bTimeHelpUsed, 
                        numhint:_iNumHintHelp, time:_iTimeElaps, difficulty:s_iDifficultyMode
                    };
        s_oLocalStorage.saveData();         
    };
    
    this.getHint = function(){
        _iNumHintHelp++;
        var aFreeCellList = new Array();
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                if(_aGridValue[i][j] === 0){
                    aFreeCellList.push({row: i, col: j});
                }
            }
        }
        
        if(aFreeCellList.length === 1){
            this.gameOver();
            return;
        } else if (aFreeCellList.length === 0){
            return;
        }
        
        shuffle(aFreeCellList);
        var iRow = aFreeCellList[0].row;
        var iCol = aFreeCellList[0].col;
        var iNum = _aStartingGrid[iRow][iCol];
        
        _aGridValue[iRow][iCol] = iNum;
        _oGrid.setHintNumber(iRow, iCol, iNum);
        _oGrid.setActiveCell(aFreeCellList[0]);
        
        _oGrid.updateNote(iNum);
        _oGrid.setActiveCell(aFreeCellList[0]);
        this._getEndCounterAndSetButCounter();
        
        
        s_aGridState = _aGridValue;
        this.saveData();
    };
    
    this.setNoTime = function(){
        _bStartGame = false;
        _oInterface.setNoTime();

        _bTimeHelpUsed = true;
        
        this.saveData();
    };
    
    this.solveAndWrite = function(){
        for (var r = 0; r < 9; r++){
            for (var c = 0; c < 9; c++){
                if(!_oGrid.isGiven(r,c) || _aGridValue[r][c] !== _aStartingGrid[r][c]){
                    _oGrid.setSolvedNumber(r,c,_aStartingGrid[r][c]);
                    _aGridValue[r][c] = _aStartingGrid[r][c];
                }         
            }
        }        

        this._setEndingStateWhenSolve();

        _bSolveHelpUsed = true;

    };
    
    this.resetGame = function(){
        for (var r = 0; r < 9; r++){
            for (var c = 0; c < 9; c++){
                if(!_oGrid.isGiven(r,c)){
                    _oGrid.deleteResetNumber(r,c);
                    _aGridValue[r][c] = 0;
                }         
            }
        }        
        this._getEndCounterAndSetButCounter();
        _oGrid.turnOffAllCells();
        _oGrid.highlightCells();
    };
    
    this.fillWithNote = function(){
        this.clearNoteFill();
        var aZeroList = _oGrid.getList(0);      
        for(var i=0; i<aZeroList.length; i++){
            var oZeroCell = aZeroList[i];            
            for(var j=1; j<10; j++){
                if(_oGrid.checkCollision(j,oZeroCell.row,oZeroCell.col, false) !== true){
                    _oGrid.writeHelpNote(j,oZeroCell.row,oZeroCell.col);
                }
            }            
        }
        
        _bNoteHelpUsed = true;  

        s_aNotesWritten = _oGrid.getAllNotes();
        this.saveData();
    };
    
    this.deleteAllNote = function(){
        this.clearNoteFill();  
        
        s_aNotesWritten = _oGrid.getAllNotes();
        this.saveData();
    };
    
    this.clearNoteFill = function(){
        _oGrid.deleteAllNote();
    };
    
    this.setNoteState = function(){
        _bNoteMode = !_bNoteMode;
    };
    
    this.setDigitState = function(){
        _bDigitMode = !_bDigitMode;
        _bDeleteMode = false;        
        _iCurNumActive = 0;
    };
    
    this.setDeleteState = function(){
        _bDeleteMode = true;
        _iCurNumActive = 0;
    };    
    
    this.setCurNum = function(iNum){
        _bDeleteMode = false;
        _iCurNumActive = iNum;
    };
    
    this.activeCell = function(oLogicPos){
        
        if(_bDigitMode && !_bDeleteMode){
            _oGrid.setActiveCell(oLogicPos);
            this.writeNum(_iCurNumActive);
        } else if (_bDigitMode && _bDeleteMode){
            _oGrid.setActiveCell(oLogicPos);
            _oGrid.deleteCell();
        } else {
            _oGrid.setActiveCell(oLogicPos);
        }
    };
    
    this.writeNum = function(iNum){
        if(_bNoteMode){
            _oGrid.writeNote(iNum);
            
            s_aNotesWritten = _oGrid.getAllNotes();
            
        }else {
            var iRow = _oGrid.getCurActiveCell().row;
            var iCol = _oGrid.getCurActiveCell().col;
            var iPrevNum = _oGrid.getCurActiveCell().num;
            
            this.addHistory(iNum, iPrevNum);
            
            var bNumInserted = _oGrid.writeNum(iNum);
            _oInterface.updateCounterOnButton(iNum, _oGrid.getList(iNum).length);
            
            if(iPrevNum !== 0) {
                _oInterface.updateCounterOnButton(iPrevNum, _oGrid.getList(iPrevNum).length);
            }
            
            if(bNumInserted){
                _aGridValue[iRow][iCol] = iNum;
            }
            
        }        
        
        s_aGridState = _aGridValue;
        this.saveData();
    };
    
    this.deleteCell = function(){
        var iNum = _oGrid.getCurActiveCell().num;
        var iRow = _oGrid.getCurActiveCell().row;
        var iCol = _oGrid.getCurActiveCell().col;
        
        _oGrid.deleteCell();
        if(iNum !== 0){
            this.addHistory(0, iNum);
            
            _oInterface.updateCounterOnButton(iNum, _oGrid.getList(iNum).length);
            _aGridValue[iRow][iCol] = 0;
            
            s_aGridState = _aGridValue;
            
        }       
        
        s_aNotesWritten = _oGrid.getAllNotes();
        this.saveData();
    };
    
    this.showPausePanel = function(bVal){
        if(bVal){
            if(_oPausePanel === null){
                _oPausePanel = new CPausePanel();
            }            
        } else {
            if(_oPausePanel !== null){
                _oPausePanel.unload();
                _oPausePanel = null;
            }            
        }
    };
    
    this.tryShowAd = function(){
        _iAdCounter++;
        if(_iAdCounter === AD_SHOW_COUNTER){
            _iAdCounter = 0;
            $(s_oMain).trigger("show_interlevel_ad");
        }
    };

    this.restartGame = function () {
        this.unload();
        this._init();
    };        

    this.onExit = function(){
        this.saveData();
        
        this.unload();
        s_oMain.gotoMenu();
    };
    
    this._onExitHelp = function () {
        _bStartGame = true;
    };
    
    this.checkEndGame = function(szType){
        if(szType === "add"){
            _iEndGameCounter++;
        } else {
            _iEndGameCounter--;
        }
        
        if(_iEndGameCounter === 81){
            this.gameOver();
        }
        
    };
    
    this.gameOver = function(){  
        
        var iScore = Math.floor( (TIME_BONUS_LIMIT[s_iDifficultyMode] - _iTimeElaps) / 100 );
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'),_bNoteHelpUsed, _bSolveHelpUsed, _bTimeHelpUsed, _iNumHintHelp, iScore);
        _oEndPanel.show(_iTimeElaps);
        
        s_oLocalStorage.deleteData();
    };

    this.addHistory = function(iNum, iPrevNum){
        var iRow = _oGrid.getCurActiveCell().row;
        var iCol = _oGrid.getCurActiveCell().col;
        
        var bCollided = _oGrid.checkCollision(iNum, iRow, iCol, false) && iNum>0;
        var bValidNumber = !_oGrid.isGiven(iRow, iCol) && !(iNum===iPrevNum);
        
        if(bValidNumber && !bCollided){
            _aHistory.push({row: iRow, col: iCol, numpushed: iNum, oldnum:iPrevNum});
            _oInterface.enableUndo();
        }
    };

    this.undo = function(){
        var oMove = _aHistory.pop();
        
        var iRow = oMove.row;
        var iCol = oMove.col;
        var iNumToResume = oMove.oldnum;
        var iCurNum = oMove.numpushed;
        var oLogicPos = {row: iRow, col:iCol};

        _oGrid.setActiveCell(oLogicPos);

        if(iNumToResume === 0){
            _oGrid.deleteCell();
            _oInterface.updateCounterOnButton(iCurNum, _oGrid.getList(iCurNum).length);
            _aGridValue[iRow][iCol] = 0;
        }else {
            _oGrid.writeNum(iNumToResume);
            _oInterface.updateCounterOnButton(iNumToResume, _oGrid.getList(iNumToResume).length);

            if(iCurNum !== 0) {
                _oInterface.updateCounterOnButton(iCurNum, _oGrid.getList(iCurNum).length);
            }
            
            _aGridValue[iRow][iCol] = iNumToResume;
        }
        
        s_aGridState = _aGridValue;
        this.saveData();
        
        if(_aHistory.length === 0){
            _oInterface.disableUndo();
        }
    };

    this.pauseTimer = function(bPause){
        _bStartGame = !bPause;
    };
    
    this.update = function(){
        
        if(_bCalculateGrid){
            
            _oBlock.update();
            
            for(var k=0; k<12; k++){
                for(var i=0; i<9; i++){
                    for(var j=0; j<9; j++){
                        _aGridValue[i][j] = _aStartingGrid[i][j];
                    }
                }            
                this._generateMask(s_iDifficultyMode);
                this._coverGrid(_aGridValue);
                _iSolution = solve(_aGridValue);
                if(_iSolution !== 1){
                    _bCalculateGrid = false;
                    _oBlock.unload();
                    this._coverGrid(_aGridValue);
                    this.setGrid(_aGridValue);

                    _bStartGame=true;
                    s_oMain.startUpdate();
                    
                    s_aSolution = _aStartingGrid;
                    s_aGridMask = _aCoverMask;
                    
                    this.saveData();
                    break;
                }
                
            }
                
        }
        
        if(_bStartGame){
            _iTimeSaveData += s_iTimeElaps;
            if(_iTimeSaveData>TIME_SAVE_DATA){
                this.saveData();
            }
            
            _iTimeElaps += s_iTimeElaps;
            if(_iTimeElaps > 5999000){
                _iTimeElaps = 5999000;
            }
                
            _oInterface.refreshTime(formatTime(_iTimeElaps));           
        }
        
    };

    this.setGrid = function(aGrid){
        for (var r = 0; r < 9; r++){
            for (var c = 0; c < 9; c++){
                    _oGrid.setGiven(r, c, aGrid[r][c]);              
            }
        }
        this._getEndCounterAndSetButCounter();           
    };
    
    this._getEndCounterAndSetButCounter = function(){
        _iEndGameCounter = 0;
        for(var i=1; i<10; i++){
            var iLength = _oGrid.getList(i).length;
            _iEndGameCounter +=  iLength;
            _oInterface.updateCounterOnButton(i, iLength);
        }
    };
    
    this._setEndingStateWhenSolve = function(){
        _iEndGameCounter = 81;
        for(var i=1; i<10; i++){
            _oInterface.updateCounterOnButton(i, 9);
        }

        _oPanelWhenSolve = new createjs.Shape();
        _oPanelWhenSolve.graphics.beginFill("rgba(255,255,255,0.01)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        s_oStage.addChild(_oPanelWhenSolve);
        _oPanelListener = _oPanelWhenSolve.on("mousedown", this.buttonDownWhenSolve);   
        if(!s_bMobile){
            _oPanelListener = _oPanelWhenSolve.on("mouseover", this.buttonOverWhenSolve);
        }

    };
    
    this.buttonDownWhenSolve = function(){
        _oPanelWhenSolve.off("mousedown", _oPanelListener);   
        if(!s_bMobile){
            _oPanelWhenSolve.off("mouseover", _oPanelListener);
        }
        
        _oParent.gameOver();
    };
    
    this.buttonOverWhenSolve = function(evt){
        if(!s_bMobile){
            evt.target.cursor = "pointer";
        }  
    };
    
    this._convertToMatrix = function(aGrid){
        var j=0;
        var app = new Array();
        for (var i=0; i<81; i+=9){
            app[j] = [aGrid[i],aGrid[i+1],aGrid[i+2],aGrid[i+3],aGrid[i+4],aGrid[i+5],aGrid[i+6],aGrid[i+7],aGrid[i+8]];
            j++;
        };
        return app;
    };
    
    this._generateMask = function(iDifficulty){
        
        _aCoverMask = new Array();
        for(var i=0; i<9; i++){
            _aCoverMask[i] = new Array();
            for(var j=0; j<9; j++){
                _aCoverMask[i][j] = 0;
            }
        }
        
        var iMinGiven = MAX_GIVENS_EASY - RANGE_GIVENS;
        var iNumGiven;
        var iLowerBound;
        
        
        switch(iDifficulty){            
            case EASY_MODE: {
                    iMinGiven = MAX_GIVENS_EASY - RANGE_GIVENS;
                    iNumGiven = iMinGiven + Math.ceil(Math.random()*RANGE_GIVENS);
                    iLowerBound = LOWER_BOUND_EASY;
                break;
            } case MEDIUM_MODE:{
                    iMinGiven = MAX_GIVENS_MEDIUM - RANGE_GIVENS;
                    iNumGiven = iMinGiven + Math.ceil(Math.random()*RANGE_GIVENS);
                    iLowerBound = LOWER_BOUND_MEDIUM;                              
                break;
            } case HARD_MODE:{
                    iMinGiven = MAX_GIVENS_HARD - RANGE_GIVENS;
                    iNumGiven = iMinGiven + Math.ceil(Math.random()*RANGE_GIVENS);
                    iLowerBound = LOWER_BOUND_HARD;                              
                break;
            }
        }
        
        var aSingleMask = new Array();
        for(var i=0; i<9; i++){
            if(i<iLowerBound){
                aSingleMask.push(1);
            } else {
                aSingleMask.push(0);
            }            
        }
        
        //fill rows with ones
        var aRowWeight = new Array();
        for(var i=0; i<9; i++){
            aRowWeight[i] = 0;
            shuffle(aSingleMask);
            for(var j=0; j<9; j++){
                if(aSingleMask[j] === 1){
                    _aCoverMask[i][j] = 1;
                }                
            }            
        }        
        //fill cols with ones
        var aColWeight = new Array();
        for(var i=0; i<9; i++){
            aColWeight[i] = 0;
            shuffle(aSingleMask);
            for(var j=0; j<9; j++){
                if(aSingleMask[j] === 1){
                    _aCoverMask[j][i] = 1;
                }                
            }
        }
        //cont ones (ones = givens)
        var iContOnes = 0;
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                if(_aCoverMask[i][j] === 1){                    
                    aRowWeight[i]++;
                    aColWeight[j]++;
                    iContOnes++;
                }                
            }
        }
        
        var iDifference = iContOnes - iNumGiven;
        if(iDifference < 0){
            this._generateMask(s_iDifficultyMode);
        } else if (iDifference === 0){
            return;
        }
        
        var aOnesList = new Array();
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                if(_aCoverMask[i][j] === 1){
                    aOnesList.push({row:i, col:j, weightRow:aRowWeight[i], weightCol:aColWeight[j], weightTotal:aRowWeight[i]+aColWeight[j]});
                }
            }
        }
        
        function compare(a,b) {
            if (a.weightTotal < b.weightTotal)
                return -1;
            if (a.weightTotal > b.weightTotal)
                return 1;
            return 0;
        }       
        aOnesList.sort(compare);
        
        var iEliminated = 0;
        var iIndex; 
        while(iEliminated < iDifference){
            iIndex = aOnesList.length - 1;
            if(iIndex < 0){
                return;
            }
            if(aOnesList[iIndex].weightRow > iLowerBound && aOnesList[iIndex].weightCol > iLowerBound){
                _aCoverMask[aOnesList[iIndex].row][aOnesList[iIndex].col] = 0;
                var iOneRow = aOnesList[iIndex].row;
                var iOneCol = aOnesList[iIndex].col;
                aRowWeight[iOneRow]--;
                aColWeight[iOneCol]--;
                for(var i=0; i<aOnesList.length; i++){
                    if(aOnesList[i].row === iOneRow){
                        aOnesList[i].weightRow = aRowWeight[iOneRow];
                        aOnesList[i].weightTotal--;
                    }
                    if(aOnesList[i].col === iOneCol){
                        aOnesList[i].weightCol = aColWeight[iOneCol];
                        aOnesList[i].weightTotal--;
                    }
                }
                iEliminated++;                
            }
            
            aOnesList.pop();
        }

    };
    
    this._coverGrid = function(aGrid){
        for(var i=0; i<9; i++){
            for(var j=0; j<9; j++){
                if(_aCoverMask[i][j] === 0){
                    aGrid[i][j] = 0;
                }
            }
        }
    };

    this.printGrid = function(grid) {
        var res = "";

        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                res += grid[i][j] +" ";
                if(j===2 || j===5){
                    res += "| ";
                }
            }
            res += "\n";
            if(i===2 || i===5){
                res += "---------------------\n";
            }
        }
        trace(res);
    };
    
    this._generateValidGrid = function(aGrid) {

		for (var i = 0; i < 9; i++)
			for (var j = 0; j < 9; j++)
				aGrid[i * 9 + j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;


		for(var i = 0; i < 42; i++) {
			var n1 = Math.ceil(Math.random() * 9);
			var n2;

			do {
				n2 = Math.ceil(Math.random() * 9);
			}
			while(n1 === n2);
                        
			for(var row = 0; row < 9; row++) {
				for(var col = 0; col < 9; col++) {
					if(aGrid[row * 9 + col] === n1)
						aGrid[row * 9 + col] = n2;

					else if(aGrid[row * 9 + col] === n2)
						aGrid[row * 9 + col] = n1;
				}
			}
		}
		for (var c = 0; c < 42; c++) {
			var s1 = Math.floor(Math.random() * 3);
			var s2 = Math.floor(Math.random() * 3);
			for(var row = 0; row < 9; row++) {
				var tmp = aGrid[row * 9 + (s1 * 3 + c % 3)];
				aGrid[row * 9 + (s1 * 3 + c % 3)] = aGrid[row * 9 + (s2 * 3 + c % 3)];
				aGrid[row * 9 + (s2 * 3 + c % 3)] = tmp;
			}
		}
		for (var s = 0; s < 42; s++) {
			var c1 = Math.floor(Math.random() * 3);
			var c2 = Math.floor(Math.random() * 3);
			for(var row = 0; row < 9; row++) {
				var tmp = aGrid[row * 9 + (s % 3 * 3 + c1)];
				aGrid[row * 9 + (s % 3 * 3 + c1)] = aGrid[row * 9 + (s % 3 * 3 + c2)];
				aGrid[row * 9 + (s % 3 * 3 + c2)] = tmp;
			}
		}
		for (var s = 0; s < 42; s++) {
			var r1 = Math.floor(Math.random() * 3);
			var r2 = Math.floor(Math.random() * 3);
                        
			for(var col = 0; col < 9; col++)
			{
				var tmp = aGrid[(s % 3 * 3 + r1) * 9 + col];

				aGrid[(s % 3 * 3 + r1) * 9 + col] = aGrid[(s % 3 * 3 + r2) * 9 + col];

				aGrid[(s % 3 * 3 + r2) * 9 + col] = tmp;

			}
		}
    };


    s_oGame=this;
    
    MAX_GIVENS_EASY = oData.max_givens_beginner;
    MAX_GIVENS_MEDIUM = oData.max_givens_intermediate;
    MAX_GIVENS_HARD = oData.max_givens_advanced;
    
    TIME_BONUS_LIMIT[0] = oData.bonus_time_beginner;
    TIME_BONUS_LIMIT[1] = oData.bonus_time_intermediate;
    TIME_BONUS_LIMIT[2] = oData.bonus_time_advanced;
    
    AD_SHOW_COUNTER = oData.ad_show_counter;
    
    _oParent=this;
    this._init();
}

var s_oGame;
