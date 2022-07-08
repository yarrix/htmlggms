var first_play = 1;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		let self = this;
		this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let popup = this.add.group();
		let duration_drop = 60; //100
		let duration_combine = 140; //200
		let gameover_delay = 200; //1000
		let delay = 100;
		let highest_type = 4;
		let state = 'play';
		let auto_play = false;
		let score = 0;
		let last_x = 2;
		let max_variation = 14;
		let next_type = 0;
		let pre_tile = [];
		let b_width = 5;
		let b_height = 6+1;
		let tile_size = 134;
		let start_x = 25+tile_size/2;
		let start_y = 450-tile_size;
		let board = [];
		let tiles = [];
		let colors = [0xF4691C, 0xD5B002, 0xA9E900, 0x54BB00, 0x01EB7D, 0x03E3ED, 0x5592F4, 0xA21AF3, 0xDB1CF2, 0xF434BD, 0xE22452, 0xE51010, 0xFF7100, 0x9AB7B7, 0x1039BA];
		//
		let b_pause = draw_button(652, 75, 'pause', this);
		let b_sound = draw_button(65, 75, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		//
		this.add.sprite(237, 68, 'score_bar');
		this.add.sprite(482, 67, 'best_bar');
		let txt_score = this.add.text(320, 69, score, {fontFamily: 'vanilla', fontSize: 26, align: 'right',color: '#FFFFFF'});
		txt_score.setOrigin(1, 0.5);
		let txt_best = this.add.text(563, 69, bestscore, {fontFamily: 'vanilla', fontSize: 26, align: 'right',color: '#FFFFFF'});
		txt_best.setOrigin(1, 0.5);
		//
		this.add.sprite(config.width/2, 160, 'next_tile_bar');
		this.add.sprite(config.width/2, tile_size+start_y-(tile_size/2)-175, 'board_top').setOrigin(0.5, 0);
		this.add.sprite(config.width/2, tile_size+start_y-(tile_size/2)-5, 'board').setOrigin(0.5, 0);
		let color_rect = this.add.sprite(start_x, start_y+(tile_size/2)+5, 'blend');
		color_rect.setOrigin(0.5, 0);
		color_rect.setBlendMode(Phaser.BlendModes.ADD);
		color_rect.alpha = 0;
		let hand;
		if(first_play){
			first_play = 0;
			hand = this.add.sprite(config.width/2, 700, 'hand');
			self.tweens.add({
				targets: hand,
				scaleX: 0.9,
				scaleY: 0.9,
				yoyo: true,
				duration: 300,
				loop: -1,
			})
		}
		for(let i=0; i<b_width; i++){
			let rect = this.add.rectangle(start_x+(i*tile_size), start_y-(tile_size/2), tile_size-10, tile_size*(b_height), 0xFFFFFF);
			rect.setOrigin(0.5, 0);
			rect.setInteractive();
			rect.alpha = 0.05;
			rect.type = i;
			rect.rect = true;
		}
		for(let y=0; y<b_height; y++){
			board[y] = [];
			for(let x=0; x<b_width; x++){
				board[y][x] = {type: 0};
				//let obj = this.add.sprite(start_x+(tile_size*x),start_y+(tile_size*y),'a1');
				//obj.setOrigin(0);
			}
		}
		let next_block = this.add.sprite(config.width/2 + 35, 159, 'tiles');
		next_block.setFrame(next_type);
		next_block.setScale(0.5);
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.rect && state === 'play' && !auto_play){
				if(hand){
					hand.destroy(true, true);
					hand = null;
				}
				insert_at(obj.type);
			}
			if(obj.button){
				play_sound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(state === 'play'){
							if(obj.name === 'pause'){
								paused();
							}
						} else {
							if(obj.name === 'resume' || obj.name === 'close'){
								state = 'play';
								popup.clear(true, true);
							}
						}
						if(obj.name === 'sound'){
							switch_audio(obj);
						} else if(obj.name === 'restart'){
							self.scene.restart();
						} else if(obj.name === 'menu' || obj.name === 'back'){
							self.scene.start('menu');
						}
					}
				}, this);
			}
		});
		if(auto_play){
			self.time.delayedCall(50, bot_play);
		}
		function add_at_top(){
			if(pre_tile.length){
				return false;
			}
			if(is_gameover()){
				// Target column is full
				// Do gameover
				state = 'gameover';
				self.time.delayedCall(gameover_delay, gameover);
			} else {
				let tile = self.add.sprite(start_x+(last_x*tile_size), start_y-34, 'tiles');
				tile.setFrame(next_type);
				tile.setScale(0.4);
				tile.alpha = 0;
				pre_tile.push(tile);
				self.tweens.add({
					targets: tile,
					alpha: 1,
					scaleX: 1,
					scaleY: 1,
					ease: 'Back.easeOut',
					duration: 300,
					onComplete: ()=>{
						state = 'play';
					}
				})
				//
				next_type = Math.round(Math.random()*highest_type);
				next_block.setFrame(next_type);
			}
		}
		function reset_state(){
			add_at_top();
			if(auto_play){
				state = 'play';
				self.time.delayedCall(200, bot_play);
			}
		}
		function insert_at(x, y = 0){
			last_x = x;
			let tile;
			if(pre_tile.length){
				tile = pre_tile[0];
				tile.x = start_x+(x*tile_size);
				tile.pos = {x:x, y:0};
				pre_tile.pop();
			} else {
				tile = self.add.sprite(start_x+(x*tile_size), start_y+(y*tile_size), 'tiles');
				tile.setFrame(0);
				tile.pos = {x:x, y:0};
			}
			color_rect.x = start_x+(x*tile_size);
			color_rect.setTint(colors[tile.frame.name]);
			show_color_rect(true);
			tiles.push(tile);
			board[y][x].type = tile.frame.name+1;
			if(board[1][x].type){
				// Target column is full
				// Do gameover
				state = 'gameover';
				self.time.delayedCall(gameover_delay, gameover);
			} else {
				play_sound('drop', self);
				drop_tiles();
			}
		}
		function drop_tiles(){
			let drop_count = 0;
			for(let x=0; x<b_width; x++){
				let shift = 0;
				for(let y=b_height-1; y>=0; y--){
					if(board[y][x].type === 0){
						shift++;
					} else {
						if(shift){
							drop_count++;
							let tile = get_tile(x, y);
							tile.shift = shift;
						}
					}
				}
			}
			let total = tiles.length;
			let count = 0;
			if(drop_count){
				let combines = [];
				let stop_reset = false;
				state = 'drop';
				for(let i=0; i<total; i++){
					let tile = tiles[i];
					if(tile.shift){
						board[tile.pos.y][tile.pos.x].type = 0;
						tile.pos.y = tile.pos.y + tile.shift;
						self.tweens.add({
							targets: tile,
							y: start_y+(tile.pos.y*tile_size),
							duration: duration_drop*(tile.shift),
							onComplete: ()=>{
								count++;
								tile.shift = 0;
								try {
									board[tile.pos.y][tile.pos.x].type = tile.frame.name + 1;
								} catch {
									console.error(tile);
								}
								let arounds = can_combine(tile.pos.x, tile.pos.y);
								if(arounds){
									combines.push(tile);
								}
								if(count === drop_count){
									show_color_rect(false);
									if(combines.length){
										combine_all(combines);
									} else {
										reset_state();
									}
								}
							}
						});
					}
				}
			} else {
				reset_state();
			}
		}
		function get_tile(x, y){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				if(tiles[i].pos.x === x && tiles[i].pos.y === y){
					return tiles[i];
				}
			}
		}
		function can_combine(x, y){
			if(y < b_height-1){
				if(board[y+1][x].type === 0){
					//Empty bottom
					return false;
				}
			}
			if(board[y][x].type === max_variation+1){
				//Prevent combine last tile
				return false;
			}
			let arounds = [];
			let cur_type = board[y][x].type;
			//
			if(x > 0){
				if(board[y][x-1].type === cur_type){
					arounds.push({x: x-1, y: y});
				}
			}
			if(x < b_width-1){
				if(board[y][x+1].type === cur_type){
					arounds.push({x: x+1, y: y});
				}
			}
			if(y > 0){
				if(board[y-1][x].type === cur_type){
					arounds.push({x: x, y: y-1});
				}
			}
			if(y < b_height-1){
				if(board[y+1][x].type === cur_type){
					arounds.push({x: x, y: y+1});
				}
			}
			if(arounds.length){
				return arounds;
			} else {
				return false;
			}
		}
		let global_combines = [];
		function combine_all(arrs){
			play_sound('combine', self);
			let total = arrs.length;
			for(let i=0; i<total; i++){
				let tile = arrs[i];
				if(tile){
					let arounds = can_combine(tile.pos.x, tile.pos.y);
					if(arounds){
						combine_tile(tile.pos, arounds);
					}
				}
			}
			self.time.delayedCall(duration_combine + delay, ()=>{
				//let combines = find_combines();
				if(global_combines.length){
					let combines = [];
					global_combines.forEach((item)=>{
						combines.push(get_tile(item.x, item.y));
					});
					global_combines = [];
					combine_all(combines);
				} else {
					global_combines = [];
					drop_tiles();
				}
			});
		}
		function show_color_rect(show){
			let alpha = 1;
			if(show){
				self.tweens.add({
					targets: color_rect,
					alpha: alpha,
					duration: 100,
					ease: 'Sine.easeOut',
				});
			} else {
				if(color_rect.alpha != 0){
					alpha = 0;
					self.tweens.add({
						targets: color_rect,
						alpha: alpha,
						duration: 100,
						ease: 'Sine.easeOut',
					});
				}	
			}
		}
		function bot_play(){
			if(state != 'play' && auto_play){
				return false;
			}
			let pick = null;
			let empty = true;
			for(let y=1; y<b_height; y++){
				for(let x=0; x<b_width; x++){
					if(board[y][x].type){
						empty = false;
					}
				}
			}
			if(empty){
				pick = Math.floor(Math.random()*5);
			} else {
				loop:
				for(let x=0; x<b_width; x++){
					for(let y=1; y<b_height; y++){
						if(board[y][x].type && board[y][x].type === pre_tile[0].frame.name+1 && !board[1][x].type){
							pick = x;
							break loop;
						}
						if(board[y][x].type){
							break;
						}
					}
				}

				if(pick === null){
					loop2:
					for(let x=0; x<b_width; x++){
						for(let y=1; y<b_height; y++){
							if(board[y][x].type && board[y][x].type === pre_tile[0].frame.name+2 && !board[1][x].type){
								pick = x;
								break loop2;
							}
							if(board[y][x].type){
								break;
							}
						}
					}
				}

				if(pick === null){
					loop3:
					for(let x=0; x<b_width; x++){
						for(let y=2; y<b_height; y++){
							if((board[y][x].type || (!board[y][x].type && y === b_height-1)) && !board[1][x].type){
								if(x > 0){
									if(board[y-1][x-1].type && board[y-1][x-1].type === pre_tile[0].frame.name+1){
										pick = x;
									}
								}
								if(x < b_width-1 && !pick){
									if(board[y-1][x+1].type && board[y-1][x+1].type === pre_tile[0].frame.name+1){
										pick = x;
									}
								}
								if(pick){
									break loop3;
								}
								break;
							}
						}
					}
				}

				if(pick === null){
					let list = [];
					for(let x=0; x<b_width; x++){
						if(!board[6][x].type){
							list.push(x);
						}
					}
					if(list.length){
						pick = list[Math.floor(Math.random()*list.length)];
					}
				}

				if(pick === null){
					let list = [];
					for(let x=0; x<b_width; x++){
						if(!board[1][x].type){
							list.push(x);
						}
					}
					if(list.length){
						pick = list[Math.floor(Math.random()*list.length)];
					}
				}

				if(pick === null){
					pick = 0;
				}
			}
			insert_at(pick);
		}
		function combine_tile(pos, arounds){
			let target_tile = get_tile(pos.x, pos.y);
			//
			if(!target_tile){
				return false;
			}
			state = 'combine';
			let upgrade_to = target_tile.frame.name+1;
			score += upgrade_to;
			target_tile.setBlendMode(Phaser.BlendModes.ADD);
			for (let j=0; j<arounds.length; j++){
				let tile = get_tile(arounds[j].x, arounds[j].y);
				board[tile.pos.y][tile.pos.x].type = 0;
				board[target_tile.pos.y][target_tile.pos.x].type = -1;
				tile.setBlendMode(Phaser.BlendModes.ADD);
				self.tweens.add({
					targets: tile,
					duration: duration_combine,
					x: start_x+(target_tile.pos.x*tile_size),
					y: start_y+(target_tile.pos.y*tile_size),
					onComplete: ()=>{
						target_tile.setBlendMode(0);
						score += upgrade_to;
						update_score();
						board[tile.pos.y][tile.pos.x].type = 0;
						board[target_tile.pos.y][target_tile.pos.x].type = upgrade_to+1;
						let total = tiles.length;
						for(let i=total-1; i>=0; i--){
							if(tiles[i].pos.x === tile.pos.x && tiles[i].pos.y === tile.pos.y){
								tiles.splice(i, 1);
							}
						}
						tile.destroy(true, true);
						target_tile.setFrame(upgrade_to);
						if(target_tile.frame.name > highest_type){
							highest_type = target_tile.frame.name;
							if(highest_type > max_variation-2){
								highest_type = max_variation-2;
							}
						}
						if(j === arounds.length-1){
							let arounds = can_combine(target_tile.pos.x, target_tile.pos.y);
							if(arounds){
								global_combines.push(target_tile.pos);
							}
						}
					}
				});
			}
		}
		function paused(){
			state = 'paused';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0.5;
			let win = self.add.sprite(360, 670, 'popup_pause');
			let title = self.add.sprite(360, 382, 'txt_pause');
			let b_resume = draw_button(360, 624, 'resume', self);
			let b_restart = draw_button(360, 736, 'restart', self);
			let b_menu = draw_button(360, 848, 'menu', self);
			let b_close = draw_button(631, 310, 'close', self);
			popup.addMultiple([dark, win, title, b_resume, b_restart, b_menu, b_close]);
		}
		function is_gameover(){
			for(let y=1; y<b_height; y++){
				for(let x=0; x<b_width; x++){
					if(!board[y][x].type){
						return false;
					}
				}
			}
			return true;
		}
		function gameover(){
			if(auto_play){
				self.scene.restart();
			}
			play_sound('gameover', self);
			localStorage.setItem('rf.drop_n_merge', bestscore);
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0.5;
			let win = self.add.sprite(360, 630, 'popup_gameover');
			let title = self.add.sprite(360, 369, 'txt_gameover');
			let b_restart = draw_button(360, 755, 'restart', self);
			let b_menu = draw_button(360, 870, 'menu', self);
			self.add.text(473, 554-33, score, {fontFamily: 'vanilla', fontSize: 35, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			self.add.text(473, 665-33, bestscore, {fontFamily: 'vanilla', fontSize: 35, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		}
		function update_score(){
			if(score > bestscore){
				bestscore = score;
				txt_best.setText(bestscore);
			}
			txt_score.setText(score);
		}
	}
}
function play_sound(id, scope){
	if(game_settings.sound){
		scope.sound.play(id);
	}
}
function switch_audio(obj){
	if(game_settings[obj.name]){
		game_settings[obj.name] = false;
		obj.setTexture('btn_sound_off');
	} else {
		game_settings[obj.name] = true;
		obj.setTexture('btn_sound_on');
	}
}
function check_audio(obj){
	if(game_settings[obj.name]){
		obj.setTexture('btn_sound_on');
	} else {
		obj.setTexture('btn_sound_off');
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
	width: 720,
	height: 1280,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: 'game_content',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);