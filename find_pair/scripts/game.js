var cur_level = 1;
var pre_score = 0;
class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		let self = this;
		this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let state = 'play';
		let first_click = true;
		let popup = this.add.group();
		let max_type = 23 + (1 * (cur_level-1));
		if(max_type > 30){
			max_type = 30;
		}
		let amount = 10 + (5 * (cur_level-1)); //x2 (pair)
		let area_x = 580;
		let area_y = 800;
		let start_x = (config.width-area_x)/2; //Center
		let start_y = 400;
		let max_timer = 100 - (10 * (cur_level-1));
		if(max_timer < 30){
			max_timer = 30;
		}
		let cur_timer = max_timer;
		let timer_interval;
		let score = 0;
		if(pre_score){
			let str = String(pre_score);
			if(str.slice(0, 5) === '99x36'){
				score = Number(str.replace('99x36', ''));
			}
		}
		pre_score = 0;
		this.add.sprite(360, 171, 'header');
		this.add.sprite(197, 161, 'score_bar');
		this.add.sprite(514, 167, 'best_bar');
		this.add.sprite(375, 247, 'timer_bar');
		let timer_max_width = 331;
		let timer_progress = this.add.tileSprite(210, 247.2, timer_max_width, 27, 'progress');
		timer_progress.setOrigin(0, 0.5);
		let txt_timer = this.add.text(375, 247, cur_timer, {fontFamily: 'vanilla', fontSize: 20, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		this.add.sprite(193, 242, 'timer_icon');
		let b_pause = draw_button(659, 57, 'pause', this);
		let b_sound = draw_button(60, 57, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		//
		let txt_score = this.add.text(300, 161, score, {fontFamily: 'vanilla', fontSize: 33, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		let txt_best = this.add.text(620, 161, bestscore, {fontFamily: 'vanilla', fontSize: 33, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
		update_score();
		//
		let tiles = [];
		let frames = [];
		let selected = [];
		//
		for(let i=0; i<amount; i++){
			frames.push(Math.floor(Math.random()*max_type));
		}
		frames = frames.concat(frames);
		frames = frames.sort(() => Math.random() - 0.5);
		//Generate pieces
		let total = frames.length;
		for(let i=0; i<total; i++){
			let rand_x = Math.round(Math.random()*area_x);
			let rand_y = Math.round(Math.random()*area_y);
			let tile = this.add.sprite(start_x+rand_x, start_y+rand_y, 'tiles');
			tile.setInteractive(new Phaser.Geom.Circle(64, 64, 64), Phaser.Geom.Circle.Contains);
			//this.input.enableDebug(tile);
			tile.setFrame(frames[i]);
			tile.tile= true;
			tile.uid = i;
			tile.selected = false;
			tile.rotation = deg_to_rad(Math.round(Math.random()*360));
			tiles.push(tile);
		}
		//Position fixer
		loop_fix:
		for(let a=0; a<10; a++){
			let overlap = false;
			for(let i=0; i<total; i++){
				let tile1 = tiles[i];
				for(let j=0; j<total; j++){
					let tile2 = tiles[j];
					if(tile1.uid != tile2.uid){
						if(tile1.frame.name === tile2.frame.name){
							if(is_overlap(tile1, tile2)){
								overlap = true;
								let rand_x = Math.round(Math.random()*area_x);
								let rand_y = Math.round(Math.random()*area_y);
								tile1.setPosition(start_x+rand_x, start_y+rand_y);
							}
						}
					}
				}
			}
			if(!overlap){
				break loop_fix;
			}
		}
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.tile && state === 'play'){
				if(!obj.selected){
					play_sound('tile', self);
					if(first_click){
						first_click = false;
						start_timer();
					}
					if(selected.length < 2){
						obj.selected = true;
						self.children.bringToTop(obj);
						animate_scale(1.3, obj);
						selected.push(obj);
						obj.tween = self.tweens.add({
							targets: obj,
							duration: 4000,
							rotation: obj.rotation+deg_to_rad(360),
							loop: -1,
						});
					}
					if(selected.length === 2){
						if(selected[0].frame.name === selected[1].frame.name){
							match();
						} else {
							animate_scale(1, selected[0]);
							selected[0].tween.stop();
							selected[0].tween = null;
							selected[0].selected = false;
							selected.shift();
						}
					}
				}
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
						} else if(obj.name === 'next'){
							cur_level++;
							// alert(cur_level);
							Android.levelCompleteInGame(cur_level);
							self.scene.restart();
						}
					}
				}, this);
			}
		});
		function remove_from_tiles(uid){
			let total = tiles.length;
			for(let i=0; i<total; i++){
				let tile = tiles[i];
				if(tile.uid === uid){
					tiles.splice(i, 1);
					break;
				}
			}
		}
		function is_overlap(spriteA, spriteB) {
			let boundsA = spriteA.getBounds();
			let boundsB = spriteB.getBounds();
			return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
		}
		function match(){
			state = 'match';
			self.time.delayedCall(200, ()=>{
				play_sound('match', self);
				state = 'play';
				for(let i=0; i<2; i++){
					let tile = selected[i];
					tile.tween.stop();
					if(i === 1){
						selected = [];
					}
					self.tweens.add({
						targets: tile,
						scaleX: 0,
						scaleY: 0,
						duration: 600,
						rotation: tile.rotation+5,
						ease: 'Back.easeIn',
						onComplete: ()=>{
							remove_from_tiles(tile.uid);
							tile.destroy(true, true);
							score++;
							update_score();
							if(tiles.length === 0){
								timer_interval.remove();
								state = 'end';
								if(cur_timer < 1){
									self.time.delayedCall(1000, completed);
								} else {
									self.time.delayedCall(1000, bonus_score);
								}
							}
							//state = 'play';
						}
					});
				}
			});
				
		}
		function start_timer(){
			timer_interval = self.time.addEvent({
				delay: 1000,
				callback: update_timer_progress,
				loop: true
			});
		}
		function update_timer_progress(){
			if(cur_timer > 0){
				if(state === 'play' || state === 'bonus'){
					cur_timer--;
					timer_progress.width = Math.round(timer_max_width*(cur_timer/max_timer));
					txt_timer.setText(cur_timer);
				}
			} else {
				if(state === 'play'){
					timer_interval.remove();
					gameover();
				}
			}
		}
		function bonus_score(){
			state = 'bonus';
			let bonus_interval = self.time.addEvent({
				delay: 20,
				callback: ()=>{
					score++;
					update_score();
					update_timer_progress();
					if(cur_timer === 0){
						completed();
					}
				},
				repeat: cur_timer,
			});
		}
		function deg_to_rad(degrees){
			let pi = Math.PI;
			return degrees * (pi/180);
		}
		function animate_scale(scale, obj){
			self.tweens.add({
				targets: obj,
				scaleX: scale,
				scaleY: scale,
				duration: 100,
				ease: 'Sine.easeOut'
			});
		}
		function paused(){
			state = 'paused';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_pause');
			let title = self.add.sprite(360, 425, 'txt_pause');
			let b_resume = draw_button(360, 620, 'resume', self);
			let b_restart = draw_button(360, 736, 'restart', self);
			let b_menu = draw_button(360, 852, 'menu', self);
			let b_close = draw_button(610, 370, 'close', self);
			popup.addMultiple([dark, win, title, b_resume, b_restart, b_menu, b_close]);
		}
		function gameover(){
			play_sound('gameover', self);
			if(score >= bestscore){
				localStorage.setItem('rf.find_pair', bestscore);
			}
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_gameover');
			let title = self.add.sprite(360, 425, 'txt_gameover');
			let b_restart = draw_button(360, 770, 'restart', self);
			let b_menu = draw_button(360, 890, 'menu', self);
			self.add.text(config.width/2, 610, 'LEVEL '+(cur_level+1)+' FAILED!', {fontFamily: 'vanilla', fontSize: 35, align: 'center',color: '#441F0B'}).setOrigin(0.5);
			cur_level = 0;
		}
		function completed(){
			play_sound('completed', self);
			if(score >= bestscore){
				localStorage.setItem('rf.find_pair', bestscore);
			}
			pre_score = '99x36'+String(score);
			state = 'completed';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.setInteractive();
			dark.alpha = 0;
			self.tweens.add({
				targets: dark,
				alpha: 0.5,
				duration: 200,
			});
			let win = self.add.sprite(360, 670, 'popup_completed');
			let title = self.add.sprite(360, 425, 'txt_completed');
			let b_next = draw_button(360, 770, 'next', self);
			let b_menu = draw_button(360, 890, 'menu', self);
			self.add.text(460, 549, score, {fontFamily: 'vanilla', fontSize: 35, align: 'right',color: '#FFFFFF'}).setOrigin(1, 0.5);
			self.add.text(config.width/2, 640, 'LEVEL '+(cur_level+1), {fontFamily: 'vanilla', fontSize: 35, align: 'center',color: '#441F0B'}).setOrigin(0.5);

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