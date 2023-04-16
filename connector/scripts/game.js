var game_data = {
	cur_level: 1,
	coin: 0,
	total_level: 200,
	sound: true,
	hint_cost: 30,
}
var local_data = localStorage.getItem('redfoc_connector');
if(local_data){ //Load existing game data
	game_data = JSON.parse(local_data);
}
var first_play = 1;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		this.add.sprite(360,540,'bg_game');
		this.add.sprite(0,0,'header').setOrigin(0);
		this.add.sprite(0,config.height,'footer').setOrigin(0,1);
		this.add.sprite(230,50,'coin_bar');
		this.add.sprite(430,50,'level_bar');
		this.anims.create({
		    key: 'lamp',
		    frames: this.anims.generateFrameNumbers('lamp'),
		    frameRate: 8,
		    repeat: -1,
		    yoyo: true,
		});
		this.anims.create({
		    key: 'guide',
		    frames: this.anims.generateFrameNumbers('guide'),
		    frameRate: 8,
		    repeat: -1,
		});
		let self = this;
		let state = 'play';
		let container = this.add.container();
		let popup = this.add.group();
		let guides = this.add.group();
		let width = 5;
		let height = 5;
		let size = 144;
		let start_x = 0;
		let start_y = 0;
		let finish_count = 0;
		let tiles = this.add.group();
		let blocks = this.add.group();
		let level_data = this.cache.json.get('level-'+game_data.cur_level);
		let hint_level = 10;
		width = level_data.width;
		height = level_data.height;
		container.setPosition(size/2, 220);
		let array = [];
		//Generate
		for(let y=0; y<height; y++){
			let arr = [];
			for(let x=0; x<width; x++){
				let _d = {type: 0, angle: 0};
				if(level_data.array[y][x][0] > 0){
					let type = Number(level_data.array[y][x][0]);
					let block = this.add.sprite(start_x+(size*x), start_y+(size*y), 'tile'+level_data.array[y][x][1]);
					block.pos = {x: x, y:y};
					block.block = true;
					block.type = type;
					blocks.add(block);
					container.add(block);
					let key;
					let angle = 0;
					if(type >= 1 && type <= 4){
						key = '1';
						if(type === 2){
							angle = 90;
						} else if(type === 3){
							angle = 180;
						} else if(type === 4){
							angle = 270;
						}
					} else if(type >= 5 && type <= 6){
						key = '5';
						if(type === 6){
							angle = 90;
						}
					} else if(type === 7){
						key = '7';
					} else if(type >= 8 && type <= 11){
						key = '8';
						if(type === 9){
							angle = 90;
						} else if(type === 10){
							angle = 180;
						} else if(type === 11){
							angle = 270;
						}
					} else if(type >= 12 && type <= 15){
						key = '12';
						if(type === 13){
							angle = 90;
						} else if(type === 14){
							angle = 180;
						} else if(type === 15){
							angle = 270;
						}
					}
					_d = {type: Number(type), angle: angle};
					let tile = this.add.sprite(block.x, block.y, key).setInteractive();
					tile.tile = true;
					tile.pos = block.pos;
					tile.type = Number(key);
					tile.rotation = get_radians(angle);
					tile.rotate = angle;
					container.add(tile);
					tiles.add(tile);
				} else {
					let block = this.add.sprite(start_x+(size*x), start_y+(size*y), 'tile0');
					container.add(block);
				}
				arr.push(_d);
			}
			array.push(arr);
		}
		//Resize container
		if(width === 6){
			container.setScale(0.8);
		} else if(width === 7){
			container.setScale(0.665);
		} else if(width === 8){
			container.setScale(0.61);
			container.x -= 20;
			container.y -= 20;
		}
		//End
		let b_home = draw_button(670,50, 'home', this);
		let b_sound = draw_button(570,50, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let b_hint = draw_button(50,50, 'hint', this);
		let txt_coin = this.add.text(320, 50, String(game_data.coin), {fontFamily: 'robotomono', fontSize: 31, align: 'right', color: '#fff'}).setOrigin(1,0.5);
		let txt_lvl = this.add.text(485, 50, 'Lv.'+game_data.cur_level, {fontFamily: 'robotomono', fontSize: 31, align: 'right', color: '#fff'}).setOrigin(1,0.5);
		//
		if(first_play && game_data.cur_level === 1){ //Show guide
			state = 'guide';
			let dark = self.add.rectangle(0,0,720,1080,0x00000, 0.5).setOrigin(0);
			let guide = this.add.sprite(360, 540, 'guide');
			guide.play('guide');
			guide.setScale(2);
			let btn = draw_button(480,270,'close_small', this);
			guides.addMultiple([dark, guide, btn]);
		}
		//
		this.input.on('gameobjectdown', function(pointer, obj){
			if(state === 'play' && obj.tile && level_data.array[obj.pos.y][obj.pos.x][1] != 3){
				play_sound('pop', self);
				obj.rotate += 90;
				if(obj.rotate >= 360){
					obj.rotate = 0;
				}
				array[obj.pos.y][obj.pos.x].type = get_type(obj.type, obj.rotate);
				obj.rotation = get_radians(obj.rotate);
				on_line();
			}
			if(obj.button){
				play_sound('click', self);
				self.tweens.add({
					targets: obj,
					scaleX: 0.95,
					scaleY: 0.95,
					yoyo: true,
					duration: 100,
					ease: 'Linear',
					onComplete: function(){
						if(state === 'play'){
							if(obj.name === 'hint'){
								window_hint();
							} else if(obj.name === 'sound'){
								switch_audio(obj);
							} else if(obj.name === 'home'){
								self.scene.start('menu');
							}
						} else {
							if(obj.name === 'pay_hint'){
								if(game_data.coin >= game_data.hint_cost){
									game_data.coin -= game_data.hint_cost;
									txt_coin.setText(game_data.coin);
									show_hint();
									Android.gameProgressEvent("use_hint");
								} else {
									alert('No enough coin!')
									Android.gameProgressEvent("no_enough_coins_for_hint");
								}
							} else if(obj.name === 'close'){
								state = 'play';
								popup.clear(true, true);
							} else if(obj.name === 'exit'){
								self.scene.start('menu');
							}
						}
						if(obj.name === 'next'){
							if(game_data.cur_level <= game_data.total_level){
							    Android.levelCompleteInGame(game_data.cur_level-1);
								self.scene.start('game');
							} else {
								alert('Awesome! You\'ve completed all levels. Level will be reset to 1.');
								game_data.cur_level = 1;
								self.scene.start('menu');
							}
						}
					}
				})
			}
		}, this);
		this.input.on('pointerdown', function(){
			if(state === 'guide'){
				guides.destroy(true, true);
				state = 'play';
			}
		});
		if(level_data.shuffle){
			shuffle();
		}
		function shuffle(){
			let total = tiles.getLength();
			let child = tiles.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(level_data.array[p.pos.y][p.pos.x][1] != 3){ //p.type != 8 && p.type != 12
					let rand = Math.floor(Math.random()*4);
					let rotate = 0;
					if(rand === 1){
						rotate = 90;
					} else if(rand === 2){
						rotate = 180;
					} else if(rand === 3){
						rotate = 270;
					}
					p.rotate = rotate;
					array[p.pos.y][p.pos.x].type = get_type(p.type, p.rotate);
					p.rotation = get_radians(p.rotate);
				}
			}
			if(on_line(0, true)){
				shuffle();
			}
		}
		function get_angle(type){
			if(type === 1){
				return 0;
			} else if(type === 2){
				return 90;
			} else if(type === 3){
				return 180;
			} else if(type === 4){
				return 270;
			} else if(type === 5){
				return 0;
			} else if(type === 6){
				return 90;
			} else if(type === 7){
				return 0;
			} else if(type === 8){
				return 0;
			} else if(type === 9){
				return 90;
			} else if(type === 10){
				return 180;
			} else if(type === 11){
				return 270;
			} else if(type === 12){
				return 0;
			} else if(type === 13){
				return 90;
			} else if(type === 14){
				return 180;
			} else if(type === 15){
				return 270;
			}
		}
		function get_type(type, angle){
			if(type === 1){
				if(angle === 0){
					return 1;
				} else if(angle === 90){
					return 2;
				} else if(angle === 180){
					return 3;
				} else if(angle === 270){
					return 4;
				}
			} else if(type === 5){
				if(angle === 0){
					return 5;
				} else if(angle === 90){
					return 6;
				} else if(angle === 180){
					return 5;
				} else if(angle === 270){
					return 6;
				}
			} else if(type === 7){
				return 7;
			} else if(type === 8){
				if(angle === 0){
					return 8;
				} else if(angle === 90){
					return 9;
				} else if(angle === 180){
					return 10;
				} else if(angle === 270){
					return 11;
				}
			} else if(type === 12){
				if(angle === 0){
					return 12;
				} else if(angle === 90){
					return 13;
				} else if(angle === 180){
					return 14;
				} else if(angle === 270){
					return 15;
				}
			}
		}
		function get_radians(deg){
			return deg * (Math.PI / 180);
		}
		function on_line(arr, check){
			let count = 0;
			for(let y=0; y<height; y++){
				for(let x=0; x<width; x++){
					if(array[y][x].type >= 8 && array[y][x].type <= 11){
						count++;
						let to;
						if(array[y][x].type === 8){
							to = {x: -1, y: 0};
						} else if(array[y][x].type === 9){
							to = {x: 0, y: -1};
						} else if(array[y][x].type === 10){
							to = {x: 1, y: 0};
						} else if(array[y][x].type === 11){
							to = {x: 0, y: 1};
						}
						check_line(x,y,to,0,arr);
					}
				}
			}
			if(count === finish_count){
				finish_count = 0;
				if(!arr && !check){
					completed();
				}
				if(check){
					return true;
				}
			} else {
				finish_count = 0;
			}
		}
		function check_line(x,y,to,index,arr){
			index++;
			//let dirrection = get_dirrection(x,y,to);
			let to2;
			let can_connect = false;
			let finish = false;
			if(x+(to.x) >= 0 && x+(to.x) < width && y+(to.y) >= 0 && y+(to.y) < height){
				let p = array[y+(to.y)][x+(to.x)];
				if(to.x === 0 && to.y === -1){ //up
					if(p.type === 1){
						to2 = {x: 1, y: 0};
						can_connect = true;
					} else if(p.type === 2){
						to2 = {x: -1, y: 0};
						can_connect = true;
					} else if(p.type === 6){
						to2 = {x: 0, y: -1};
						can_connect = true;
					} else if(p.type === 7){
						to2 = {x: 0, y: -1};
						can_connect = true;
					} else if(p.type === 15){
						finish = true;
					}
				} else if(to.x === 1 && to.y === 0){ //right
					if(p.type === 2){
						to2 = {x: 0, y: 1};
						can_connect = true;
					} else if(p.type === 3){
						to2 = {x: 0, y: -1};
						can_connect = true;
					} else if(p.type === 5){
						to2 = {x: 1, y: 0};
						can_connect = true;
					} else if(p.type === 7){
						to2 = {x: 1, y: 0};
						can_connect = true;
					} else if(p.type === 12){
						finish = true;
					}
				} else if(to.x === 0 && to.y === 1){ //down
					if(p.type === 3){
						to2 = {x: -1, y: 0};
						can_connect = true;
					} else if(p.type === 4){
						to2 = {x: 1, y: 0};
						can_connect = true;
					} else if(p.type === 6){
						to2 = {x: 0, y: 1};
						can_connect = true;
					} else if(p.type === 7){
						to2 = {x: 0, y: 1};
						can_connect = true;
					} else if(p.type === 13){
						finish = true;
					}
				} else if(to.x === -1 && to.y === 0){ //left
					if(p.type === 1){
						to2 = {x: 0, y: 1};
						can_connect = true;
					} else if(p.type === 4){
						to2 = {x: 0, y: -1};
						can_connect = true;
					} else if(p.type === 5){
						to2 = {x: -1, y: 0};
						can_connect = true;
					} else if(p.type === 7){
						to2 = {x: -1, y: 0};
						can_connect = true;
					} else if(p.type === 14){
						finish = true;
					}
				}
			}
			if(finish){
				if(arr){
					arr.push({id: index, x:x, y:y});
					arr.push({id: index+1, x:x+(to.x), y:y+(to.y), lamp: true});
				}
				finish_count++;
			} else if(can_connect){
				if(arr){
					arr.push({id: index, x:x, y:y});
				}
				check_line(x+(to.x), y+(to.y), to2, index, arr);
			}
		}
		function get_dirrection(x,y,to){
			let e = array[y][x];
			if(e.type === 1){
				if(e.angle === 0 && to === 'up'){

				}
			}
		}
		function completed(){
			state = 'completed';
			let arr = [];
			on_line(arr);
			let index = 1;
			let max = 0;
			for(let i=0; i<arr.length; i++){
				if(arr[i].id > max){
					max = arr[i].id;
				}
			}
			let interval = setInterval(function(){
				for(let i=0; i<arr.length; i++){
					if(arr[i].id === index){
						set_tile(arr[i]);
						if(arr[i].lamp){
							lamp_on(arr[i].x, arr[i].y);
						}
					}
				}
				if(index < max){
					play_sound('fill', self);
				}
				if(index === max+8) {
					show_window();
					clearInterval(interval);
				}
				index++;
			}, 200);
			game_data.coin += hint_level;
			game_data.cur_level++;
			//
			function set_tile(data){
				let total = tiles.getLength();
				let child = tiles.getChildren();
				for(let i=0; i<total; i++){
					let p = child[i];
					if(p.pos.x === data.x && p.pos.y === data.y){
						p.setTexture(p.type+'x');
					}
				}
			}
			function lamp_on(x,y){
				let total = tiles.getLength();
				let child = tiles.getChildren();
				for(let i=0; i<total; i++){
					let p = child[i];
					if(p.type === 12 && p.pos.x === x && p.pos.y === y){
						p.setTexture('lamp');
						p.play('lamp');
					}
				}
			}
			function show_window(){
				save_game();
				play_sound('completed', self);
				self.add.rectangle(0,0,720,1080,0x00000, 0.5).setOrigin(0);
				self.add.sprite(360,540,'window_big');
				self.add.text(360, 360, 'Level '+(game_data.cur_level-1)+'\ncompleted.', {fontFamily: 'robotomono', fontSize: 50, align: 'center', color: '#fff'}).setOrigin(0.5);
				self.add.text(360, 460, 'Bonus coin: +'+hint_level, {fontFamily: 'robotomono', fontSize: 35, align: 'center', color: '#fff'}).setOrigin(0.5);
				draw_button(360, 570, 'next', self);
				draw_button(360, 690, 'exit', self);
			}
		}
		function window_hint(){
			state = 'hint';
			let dark = self.add.rectangle(0,0,720,1080,0x00000, 0.5).setOrigin(0);
			let win = self.add.sprite(360,540,'window_small');
			let caption = self.add.text(360, 380, 'Show hint', {fontFamily: 'robotomono', fontSize: 50, align: 'center', color: '#fff'}).setOrigin(0.5);
			let b_pay = draw_button(360, 530, 'pay_hint', self);
			let b_close = draw_button(360, 650, 'close', self);
			let price = self.add.text(b_pay.x+50, b_pay.y, String(game_data.hint_cost), {fontFamily: 'robotomono', fontSize: 60, align: 'center', color: '#fff'}).setOrigin(0.5);
			popup.addMultiple([dark, win, caption, b_pay, b_close, price]);
		}
		function show_hint(){
			popup.clear(true, true); //Hide window hint
			//
			let qualify = [];
			let total = tiles.getLength();
			let child = tiles.getChildren();
			for(let i=0; i<total; i++){
				let p = child[i];
				if(level_data.array[p.pos.y][p.pos.x][1] === 1){
					qualify.push(p);
				}
			}
			if(qualify.length > 0){
				setTimeout(function(){
					play_sound('hint', self);
					state = 'play';
					let rand = Math.floor(Math.random()*qualify.length);
					let picked = qualify[rand];
					picked.rotate = get_angle(Number(level_data.array[picked.pos.y][picked.pos.x][0]));
					array[picked.pos.y][picked.pos.x].type = get_type(picked.type, picked.rotate);
					array[picked.pos.y][picked.pos.x].angle = picked.rotate;
					picked.rotation = get_radians(picked.rotate);
					//Block
					total = blocks.getLength();
					child = blocks.getChildren();
					for(let i=0; i<total; i++){
						let p = child[i];
						if(p.pos.x === picked.pos.x && p.pos.y === picked.pos.y){
							level_data.array[p.pos.y][p.pos.x][1] = 3;
							//p.alpha = 0.5;
							p.setTexture('tile2');
						}
					}
					on_line();
				}, 400);
			}
		}
	}
}
function save_game(){
	localStorage.setItem('redfoc_connector', JSON.stringify(game_data));
}
function play_sound(id, scope){
	if(game_data.sound){
		scope.sound.play(id);
	}
}
function draw_button(x, y, id, scope){
	var o = scope.add.sprite(x, y, 'btn_'+id).setInteractive();
	o.button = true;
	o.name = id;
	return o;
}
var config = {
	type: Phaser.AUTO,
//	width: 720,
//	height: 1080,
	    scale: {
            mode: Phaser.Scale.FIT,
            parent: 'redfoc',
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 720,
            height: 1080
        },
//	scale: {
//        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
//        parent: 'redfoc',
//        autoCenter: Phaser.Scale.CENTER_BOTH,
//    },
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);