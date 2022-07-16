var LOCALSTORAGE_SOLUTION = "solution";
var LOCALSTORAGE_MASK = "gridmask";
var LOCALSTORAGE_GRID_STATE = "gridstate";
var LOCALSTORAGE_NOTES_WRITTEN = "noteswritten";
var LOCALSTORAGE_GAME_PARAM = "gameparam";

var s_aSolution = null;
var s_aGridMask = null;
var s_aGridState = null;
var s_aNotesWritten = null;
var s_oGameParam = null;

function CLocalStorage(szName){
    var _bLocalStorage = true;

    this._init = function(szName){   
        try{
            var bFlag = window.localStorage.getItem(szName);
            this.resetData();
            if(bFlag !== null && bFlag !== undefined){  
                this.loadData();
            }
        }catch(e){
            this.resetData();
        }        
        
    };

    this.isUsed = function(){
        if(s_aSolution !== null){
            return true;
        }
        return false;
    };

    this.isAvailable = function(){
        try{
            window.localStorage.setItem("ls_available","ok");
        }catch(evt){
            _bLocalStorage = false;
        }
        
        return _bLocalStorage;
    };

    this.resetData = function(){
        s_aSolution = null;
        s_aGridMask = null;
        s_aGridState = null;
        s_aNotesWritten = null;
        s_oGameParam = null;
    };

    this.deleteData = function(){
        window.localStorage.removeItem(szName);
        
        this.resetData();
    };

    this.saveData = function(){
        var oJSONData = {};
        oJSONData[LOCALSTORAGE_SOLUTION] = s_aSolution;
        oJSONData[LOCALSTORAGE_MASK] = s_aGridMask;
        oJSONData[LOCALSTORAGE_GRID_STATE] = s_aGridState;
        oJSONData[LOCALSTORAGE_NOTES_WRITTEN] = s_aNotesWritten;
        oJSONData[LOCALSTORAGE_GAME_PARAM] = s_oGameParam;

        /*ADD MORE JSON THIS WAY
        var randB = "randomboolean";
        oJSONData[randB] = true;
        oJSONData["anothernestedjson"] = {pippo: 3, ciccio: 10};
        */

        window.localStorage.setItem(szName, JSON.stringify(oJSONData));
    };

    this.loadData = function(){
        var szData = JSON.parse(window.localStorage.getItem(szName));

        var oLoaded = szData[LOCALSTORAGE_SOLUTION];
        s_aSolution = oLoaded;
        
        var oLoaded = szData[LOCALSTORAGE_MASK];
        s_aGridMask = oLoaded;

        var oLoaded = szData[LOCALSTORAGE_GRID_STATE];
        s_aGridState = oLoaded;
        
        var oLoaded = szData[LOCALSTORAGE_NOTES_WRITTEN];
        s_aNotesWritten = oLoaded;
        
        var oLoaded = szData[LOCALSTORAGE_GAME_PARAM];
        s_oGameParam = oLoaded;
        
        console.log(szData)
    };

    this._init(szName);
    
}