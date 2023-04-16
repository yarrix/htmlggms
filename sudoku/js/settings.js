var CANVAS_WIDTH = 1080;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 25;
var EDGEBOARD_Y = 200;

var CELL_SIZE = 106;

var FPS = 30;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;
var GAME_NAME = "ultimate_sudoku";

var PRIMARY_FONT = "Arial";
var SECONDARY_FONT = "blackplotan";

var PRIMARY_FONT_COLOUR = "#008df0";

var TIME_LOOP_WAIT = 2000;

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var EASY_MODE = 0;
var MEDIUM_MODE = 1;
var HARD_MODE = 2;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var MAX_GIVENS_EASY;
var MAX_GIVENS_MEDIUM;
var MAX_GIVENS_HARD;
var RANGE_GIVENS = 0;

var LOWER_BOUND_EASY = 4;
var LOWER_BOUND_MEDIUM = 3;
var LOWER_BOUND_HARD = 2;

var TIME_BONUS_LIMIT = new Array();
var ENABLE_FULLSCREEN;
var ENABLE_CHECK_ORIENTATION;

var TIME_SAVE_DATA = 60000;