function CSudokuLoader(){
    var _bStart;
    
    var _iTimeElaps;
    
    var _oGroup;
    var _oText;
    var _oTextDots;
    var _oRect;
    
    this._init = function(){
        _bStart = true;
      
        _iTimeElaps=0;
      
        _oGroup = new createjs.Container();
        s_oStage.addChild(_oGroup);
        
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.8)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oRect = new createjs.Shape(graphics);
        _oRect.on("click", function(){});
        _oGroup.addChild(_oRect);
        
        _oText = new CTLText(_oGroup, 
                    CANVAS_WIDTH*0.5-400, CANVAS_HEIGHT*0.5 -100, 800, 120, 
                    60, "center", "#fff", SECONDARY_FONT, 1,
                    0, 0,
                    TEXT_GENERATE_SUDOKU,
                    true, true, true,
                    false ); 
 
        _oTextDots = new createjs.Text(""," 180px " +PRIMARY_FONT, "#ffffff");
        _oTextDots.x = CANVAS_WIDTH*0.5 - 76;
        _oTextDots.y = CANVAS_HEIGHT*0.5 +50;
        _oTextDots.textAlign = "left";
        _oTextDots.textBaseline = "alphabetic";
        _oTextDots.lineWidth = 800;     
        _oGroup.addChild( _oTextDots);
    };
    
    this.unload = function(){
        _bStart =false;
        s_oStage.removeChild(_oGroup);
    };
    
    this.update = function(){
        if(_bStart){
            _iTimeElaps += s_iTimeElaps;
        
            if(_iTimeElaps >= 0 && _iTimeElaps < TIME_LOOP_WAIT/4){
                _oTextDots.text = "";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT/4 && _iTimeElaps < TIME_LOOP_WAIT*2/4){
                _oTextDots.text = ".";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*2/4 && _iTimeElaps < TIME_LOOP_WAIT*3/4){
                _oTextDots.text = "..";
            } else if (_iTimeElaps >= TIME_LOOP_WAIT*3/4 && _iTimeElaps < TIME_LOOP_WAIT){
                 _oTextDots.text = "...";
            } else {
                _iTimeElaps = 0;
            }
                
        }
        
        
    };
    
    s_oSudokuLoader = this;
    this._init();
    
}; 

var s_oSudokuLoader;