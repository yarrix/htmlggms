class Game extends Phaser.Scene {
	constructor(){
		super('game');
	}
	create(){
		this.add.sprite(0,0,'background').setOrigin(0);
		let state = 'play';
		let drop_count = 0;
		let self = this;
		let hint_shown;
		let is_new_game = false;
		let selected_stage = 4;
		let key_press = false;
		let pieces = this.add.group();
		let shadows = this.add.group();
		let lines = this.add.group();
		let selected = 0;
		let size = {
			width: 80,
			height: 77,
		}
		let start_x = ((config.width-(size.width*8))/2)+(size.width/2);
		let start_y = ((config.height-(size.height*10))/2)+(size.height/2);
		let array = new Array(10);
		//Generate pieces from data
		let colors = [];
		let _cur = 1;
		let _max = 18+player_data.drop_mode;
		if(_max > 22){
			_max = 22;
		}
		for(let i=0; i<((10*8)/2); i++){
			if(_cur > _max){
				_cur = 1;
			}
			colors.push(_cur);
			_cur++;
		}
		colors = colors.concat(colors);
		shuffle(colors);
		let index = 0;
		if(last_array){
			array = last_array;
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(array[y][x].filled){
						let color = array[y][x].color;
						let piece = this.add.sprite(start_x+(size.width*x), start_y+(size.height*y), 'obj'+color).setInteractive();
						piece.color = color;
						piece.piece = true;
						piece.pos = {
							x: x,
							y: y,
						}
						pieces.add(piece);
					}
				}
			}
		} else {
			for(let y=0; y<10; y++){
				let arr_x = [];
				for(let x=0; x<8; x++){
					let color = colors[index];
					let data = {
						color: color,
						filled: false,
					}
					data.filled = true;
					let piece = this.add.sprite(start_x+(size.width*x), start_y+(size.height*y), 'obj'+color).setInteractive();
					piece.color = color;
					piece.piece = true;
					piece.pos = {
						x: x,
						y: y,
					}
					pieces.add(piece);
					index++;
					arr_x.push(data);
				}
				array[y] = arr_x;
			}
			is_new_game = true;
		}
		//START UI
		this.add.sprite(0,0,'header').setOrigin(0);
		this.add.sprite(config.width/2,35,'score_bar');
		let txt_score = this.add.text(config.width/2, 35, String(player_data.score), {fontFamily: 'robotomono', fontSize: 40, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		this.add.sprite(0,config.height,'footer').setOrigin(0,1);
		let b_hint = draw_button(650, 40, 'hint', this);
		if(player_data.hint_left === 0){
			b_hint.alpha = 0.5;
		}
		let b_shuffle = draw_button(560, 40, 'shuffle', this);
		if(player_data.shuffle_left === 0){
			b_shuffle.alpha = 0.5;
		}
		let b_home = draw_button(70, 40, 'home', this);
		let b_sound = draw_button(160, 40, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		let circle_hint = this.add.sprite(b_hint.x+35, b_hint.y+25, 'circle');
		let circle_shuffle = this.add.sprite(b_shuffle.x+35, b_shuffle.y+25, 'circle');
		let txt_hint_left = this.add.text(circle_hint.x, circle_hint.y, String(player_data.hint_left), {fontFamily: 'robotomono', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let txt_shuffle_left = this.add.text(circle_shuffle.x, circle_shuffle.y, String(player_data.shuffle_left), {fontFamily: 'robotomono', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let sign = this.add.sprite(180, 180, 'sign');
		sign.setDepth(100);
		sign.setVisible(false);
		let arrow = this.add.sprite(b_shuffle.x, 140, 'arrow');
		arrow.setDepth(100);
		arrow.setVisible(false);
		this.tweens.add({
			targets: sign,
			scaleX: 1.1,
			scaleY: 1.1,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: -1,
		});
		this.tweens.add({
			targets: arrow,
			y: arrow.y+20,
			ease: 'Linear',
			duration: 250,
			yoyo: true,
			repeat: -1,
		});
		//END UI
		for(let i=0; i<25; i++){
			let line = this.add.sprite(80, 80, 'lines');
			line.setDepth(100);
			line.setVisible(false);
			lines.add(line);
		}

		setTimeout(()=>{
			if(is_new_game){
				show_hint();
				is_new_game = false;
			}
		}, 500);

		this.input.keyboard.on('keydown', function(key, pointer){
			key_press = key.key;
			if(key_press === 't'){
				if(state === 'play'){
					//quick_move();
				}
			}
		});
		this.input.keyboard.on('keyup', function(key, pointer){
			key_press = false;
		});
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(key_press === 'z'){
				array[obj.pos.y][obj.pos.x].filled = false;
				obj.destroy(true, true);
				//show_available_piece();
			} else if(obj.button){
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
							if(obj.name === 'hint'){
								if(player_data.hint_left > 0){
									player_data.hint_left--;
									update_left();
									show_hint();
									
									if(player_data.hint_left === 0){
										obj.alpha = 0.5;
									}
									Android.gameProgressEvent("hint_left_"+player_data.hint_left);
								}
							} else if(obj.name === 'shuffle'){
								if(player_data.shuffle_left > 0){
									if(arrow.visible){
										arrow.setVisible(false);
									}
									player_data.shuffle_left--;
									update_left();
									shuffle_pieces();
									
									if(player_data.shuffle_left === 0){
										obj.alpha = 0.5;
									}
									Android.gameProgressEvent("shuffle_left_"+player_data.shuffle_left);
								}
							} else if(obj.name === 'home'){
								self.scene.start('menu');
							}
						}
						if(obj.name === 'sound'){
							switch_audio(obj);
						} else if(obj.name === 'next'){
							self.scene.start('game');
						} else if(obj.name === 'restart'){
							player_data.drop_mode = 0;
							player_data.score = 0;
							self.scene.start('game');
						} else if(obj.name === 'menu'){
							self.scene.start('menu');
						}
					}
				}, this);
			} else if(obj.piece){
				if(hint_shown){
					let total = pieces.getLength();
					let child = pieces.getChildren();
					if(true){
						for(let i=0; i<total; i++){
							let piece = child[i];
							if((piece.pos.x === hint_shown[0].x && piece.pos.y === hint_shown[0].y) || (piece.pos.x === hint_shown[1].x && piece.pos.y === hint_shown[1].y)){ // piece.available
								piece.clearTint();
							}
						}
					}
					hint_shown = null;
				}
				if(!selected){
					if(state === 'play'){ //obj.available
						play_sound('itemclick', self);
						selected = obj;
						obj.setTint(0x4fdbc6);
						sign.setVisible(true);
						sign.setPosition(obj.x, obj.y);
					}
				} else {
					if(state === 'play'){ // obj.available
						play_sound('itemclick', self);
						if(obj.pos.x != selected.pos.x || obj.pos.y != selected.pos.y){
							obj.setTint(0x4fdbc6);
							if(array[obj.pos.y][obj.pos.x].color === array[selected.pos.y][selected.pos.x].color){
								let way = find_way(selected.pos, obj.pos);
								if(way){
									player_data.score += 2;
									txt_score.setText(player_data.score);
									Android.scoreInGame(player_data.score);
									state = 'wait1';
									sign.setVisible(false);
									show_lines(way);
									array[obj.pos.y][obj.pos.x].filled = false;
									array[selected.pos.y][selected.pos.x].filled = false;
									setTimeout(()=>{
										state = 'wait';
										copy_obj(obj.x, obj.y, obj.color);
										copy_obj(selected.x, selected.y, selected.color);
										obj.destroy(true, true);
										selected.destroy(true, true);
										selected = null;
										setTimeout(()=>{
											lets_drop();
										}, 100);
										hide_lines();
									}, 300);
								} else {
									selected.clearTint();
									selected = obj;
									sign.setPosition(obj.x, obj.y);
								}
							} else {
								selected.clearTint();
								selected = obj;
								sign.setPosition(obj.x, obj.y);
							}
						}
					}
				}
			}
		}, this);
		//show_available_piece();
		if(!hint() && !last_array){
			this.scene.start('game');
		}
		//
		function copy_obj(x, y, color){
			let obj = self.add.sprite(x, y, 'obj'+color);
			//obj.setFrame(color);
			self.tweens.add({
				targets: obj,
				scaleY: 0,
				scaleX: 0,
				duration: 150,
				ease: 'Linear',
				onComplete: ()=>{
					obj.destroy(true, true);
				}
			})
		}
		function shuffle(arr) {
			let m = arr.length, t, i;
			// While there remain elements to shuffle…
			while (m) {
				// Pick a remaining element…
				i = Math.floor(Math.random() * m--);
				// And swap it with the current element.
				t = arr[m];
				arr[m] = arr[i];
				arr[i] = t;
			}
			return arr;
		}
		function shuffle_pieces(){
			if(selected){
				selected.clearTint();
				selected = null;
			}
			let arr = [];
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(array[y][x].filled){
						arr.push(array[y][x].color);
					}
				}
			}
			shuffle(arr);
			for(let i=0; i<total; i++){
				let piece = child[i];
				piece.color = arr[i];
				piece.setTexture('obj'+piece.color);
			}
			board_update();
			if(!hint()){
				console.log('not match')
				shuffle_pieces();
			} else {
				setTimeout(()=>{
					play_sound('shuffle', self);
				}, 200);
			}
		}
		function quick_move(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			let obj;
			let _hint = hint();
			if(_hint){
				hint_shown = _hint;
				for(let i=0; i<total; i++){
					let piece = child[i];
					if((piece.pos.x === _hint[0].x && piece.pos.y === _hint[0].y)){
						selected = piece;
						piece.setTint(0x4fdbc6);
						sign.setVisible(true);
						sign.setPosition(piece.x, piece.y);
					}
					if((piece.pos.x === _hint[1].x && piece.pos.y === _hint[1].y)){ // piece.available
						piece.setTint(0x4fdbc6);
						obj = piece;

					}
				}
				if(obj){
					state = 'wait1';
					player_data.score += 2;
					txt_score.setText(player_data.score);
					sign.setVisible(false);
					let way = find_way(selected.pos, obj.pos);
					show_lines(way);
					array[obj.pos.y][obj.pos.x].filled = false;
					array[selected.pos.y][selected.pos.x].filled = false;
					setTimeout(()=>{
						state = 'wait';
						copy_obj(obj.x, obj.y, obj.color);
						copy_obj(selected.x, selected.y, selected.color);
						obj.destroy(true, true);
						selected.destroy(true, true);
						selected = null;
						setTimeout(()=>{
							lets_drop();
						}, 100);
						hide_lines();
					}, 300);
				}
			}
		}
		function show_hint(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			let _hint = hint();
			if(_hint){
				hint_shown = _hint;
				for(let i=0; i<total; i++){
					let piece = child[i];
					if((piece.pos.x === _hint[0].x && piece.pos.y === _hint[0].y) || (piece.pos.x === _hint[1].x && piece.pos.y === _hint[1].y)){ // piece.available
						piece.setTint(0x4fdbc6);
					}
				}
			} else {
				alert('err')
			}
			setTimeout(()=>{
				play_sound('hint', self);
			}, 200);
		}
		function hint(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				if(true){ // piece.available
					let src = search_match(piece.pos);
					if(src){
						return [piece.pos, src];
					}
				}
			}
			return false;
		}
		function depth_sorting(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			let index = 0;
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(array[y][x].filled){
						index++;
						loop:
						for(let i=0; i<total; i++){
							let piece = child[i];
							if(piece.pos.x === x && piece.pos.y === y){
								piece.depth = index;
								break loop;
							}
						}
					}
				}
			}
		}
		function bring_piece_to_back(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(array[y][x].filled){
						loop:
						for(let i=0; i<total; i++){
							let piece = child[i];
							if(piece.pos.x === x && piece.pos.y === y){
								piece.depth = 0;
								break loop;
							}
						}
					}
				}
			}
		}
		function lets_drop(){
			let to;
			if(player_data.drop_mode === 1){
				to = 'down';
			} else if(player_data.drop_mode === 2){
				to = 'up';
			} else if(player_data.drop_mode === 3){
				to = 'left';
			} else if(player_data.drop_mode === 4){
				to = 'right';
			} else if(player_data.drop_mode === 5){
				if(drop_count === 0){
					to = 'down';
				} else if(drop_count === 1){
					to = 'up';
				}
				drop_count++;
				if(drop_count > 1){
					drop_count = 0;
				}
			} else if(player_data.drop_mode === 6){
				if(drop_count === 0){
					to = 'left';
				} else if(drop_count === 1){
					to = 'right';
				}
				drop_count++;
				if(drop_count > 1){
					drop_count = 0;
				}
			} else if(player_data.drop_mode === 7){
				if(drop_count === 0){
					to = 'up';
				} else if(drop_count === 1){
					to = 'right';
				}
				drop_count++;
				if(drop_count > 1){
					drop_count = 0;
				}
			} else if(player_data.drop_mode === 8){
				if(drop_count === 0){
					to = 'down';
				} else if(drop_count === 1){
					to = 'left';
				}
				drop_count++;
				if(drop_count > 1){
					drop_count = 0;
				}
			} else if(player_data.drop_mode === 9){
				if(drop_count === 0){
					to = 'up';
				} else if(drop_count === 1){
					to = 'right';
				} else if(drop_count === 2){
					to = 'down';
				} else if(drop_count === 3){
					to = 'left';
				}
				drop_count++;
				if(drop_count > 3){
					drop_count = 0;
				}
			} else if(player_data.drop_mode > 9){
				let rand = Math.floor(Math.random()*4);
				if(rand === 0){
					to = 'up';
				} else if(rand === 1){
					to = 'right';
				} else if(rand === 2){
					to = 'down';
				} else if(rand === 3){
					to = 'left';
				}
			}
			drop(to);
			save_game();
		}
		function drop(to){
			let counter = 0;
			if(to === 'down'){
				for(let x=0; x<8; x++){
					let shift = 0;
					for(let y=9; y>=0; y--){
						if(!array[y][x].filled){
							shift++;
						} else {
							if(shift != 0){
								counter++;
							}
							array[y][x].to = {x: 0, y: shift}
						}
					}
				}
			} else if(to === 'up'){
				for(let x=0; x<8; x++){
					let shift = 0;
					for(let y=0; y<10; y++){
						if(!array[y][x].filled){
							shift--;
						} else {
							if(shift != 0){
								counter++;
							}
							array[y][x].to = {x: 0, y: shift}
						}
					}
				}
			} else if(to === 'left'){
				for(let y=0; y<10; y++){
					let shift = 0;
					for(let x=0; x<8; x++){
						if(!array[y][x].filled){
							shift--;
						} else {
							if(shift != 0){
								counter++;
							}
							array[y][x].to = {x: shift, y: 0}
						}
					}
				}
			} else if(to === 'right'){
				for(let y=0; y<10; y++){
					let shift = 0;
					for(let x=7; x>=0; x--){
						if(!array[y][x].filled){
							shift++;
						} else {
							if(shift != 0){
								counter++;
							}
							array[y][x].to = {x: shift, y: 0}
						}
					}
				}
			}
			if(counter){
				depth_sorting();
				drop_all(counter);
			} else {
				state = 'play';
				if(!hint()){ //No possible match
					if(is_layer_empty()){
						completed();
					} else {
						if(player_data.shuffle_left > 0){
							arrow.setVisible(true);
							play_sound('nomatch', self);
						} else {
							Android.gameProgressEvent("GameOver");
							state = 'gameover1';
							setTimeout(gameover, 1000);
						}
					}
				}
			}
		}
		function drop_all(counter){
			state = 'drop';
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				let arr = array[piece.pos.y][piece.pos.x];
				if(arr.to.x != 0 || arr.to.y != 0){
					piece.pos.x += arr.to.x;
					piece.pos.y += arr.to.y;
					let target = {
						x: start_x+(size.width*piece.pos.x),
						y: start_y+(size.height*piece.pos.y)
					}
					self.tweens.add({
						targets: piece,
						x: target.x,
						y: target.y,
						duration: 200,
						ease: 'Linear',
						onComplete: ()=>{
							counter--;
							if(counter === 0){
								state = 'play';
								board_update();
								if(!hint()){
									if(player_data.shuffle_left > 0){
										arrow.setVisible(true);
										play_sound('nomatch', self);
									} else {
										state = 'gameover1';
										setTimeout(gameover, 1000);
									}
								}
							}
						}
					})
				}
			}
		}
		function board_update(){
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					array[y][x].filled = false;
					array[y][x].color = 0;
					array[y][x].to = null;
				}
			}
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				array[piece.pos.y][piece.pos.x].filled = true;
				array[piece.pos.y][piece.pos.x].color = piece.color;
			}
		}
		function check_drop(){
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
			}
		}
		function search_match(pos){
			let color = array[pos.y][pos.x].color;
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(y === pos.y && x === pos.x){
						//
					} else if(array[y][x].filled){ //array[y][x].available
						if(array[y][x].color === color){
							let way = find_way(pos, {x: x, y: y});
							if(way){
								return {x: x, y: y};
							}
						}
					}
				}
			}
			return false;
		}
		function get_radians(degrees){
			var pi = Math.PI;
			return degrees * (pi/180);
		}
		function get_dirrection(to, i, data){
			if(data[i].x === data[i+1].x){
				if(data[i].y > data[i+1].y){
					prev = 'down';
				} else {
					prev = 'top';
				}
			} else {
				if(data[i].x > data[i+1].x){
					prev = 'left';
				} else {
					prev = 'right';
				}
			}
		}
		function hide_lines(){
			let child = lines.getChildren();
			let total = lines.getLength();
			for(let i=0; i<total; i++){
				child[i].setVisible(false);
			}
		}
		function show_lines(data){
			play_sound('connected', self);
			hide_lines();
			let line = lines.getChildren();
			let prev;
			let cur;
			let next;
			for(let i=0; i<data.length; i++){
				let p = line[i];
				p.setVisible(true);
				p.setPosition(start_x+(size.width*data[i].x), start_y+(size.height*data[i].y));
				if(i < data.length-1){ //Next
					//
				}
				if(i === 0){ //First
					if(data[i].x === data[i+1].x){
						if(data[i].y > data[i+1].y){
							cur = 'up';
						} else {
							cur = 'down';
						}
					} else {
						if(data[i].x > data[i+1].x){
							cur = 'left';
						} else {
							cur = 'right';
						}
					}
				} else if(i < data.length-1) { //Lines
					if(data[i].x === data[i+1].x){
						if(data[i].y > data[i+1].y){ //UP							
							cur = 'up';
							if(prev === 'up'){
								p.setFrame(1);
							} else if(prev === 'down'){
								//cur = 'down';
							} else if(prev === 'left'){
								p.setFrame(2);
								p.setRotation(get_radians(180));
							} else if(prev === 'right'){
								p.setFrame(2);
								p.setRotation(get_radians(90));
							}
						} else { //DOWN
							cur = 'down';
							if(prev === 'up'){
								//p.setFrame(1);
							} else if(prev === 'down'){
								p.setFrame(1);
								//cur = 'down';
							} else if(prev === 'left'){
								p.setFrame(2);
								p.setRotation(get_radians(270));
							} else if(prev === 'right'){
								p.setFrame(2);
								p.setRotation(get_radians(0));
							};
						}
					} else {
						if(data[i].x > data[i+1].x){ //LEFT
							cur = 'left';
							if(prev === 'up'){
								p.setFrame(2);
								p.setRotation(get_radians(0));
							} else if(prev === 'down'){
								p.setFrame(2);
								p.setRotation(get_radians(90));
							} else if(prev === 'left'){
								p.setFrame(1);
							} else if(prev === 'right'){
								//p.setFrame(1);
							};
						} else { //RIGHT
							cur = 'right';
							if(prev === 'up'){
								p.setFrame(2);
								p.setRotation(get_radians(270));
							} else if(prev === 'down'){
								p.setFrame(2);
								p.setRotation(get_radians(180));
							} else if(prev === 'left'){
								//p.setFrame(1);
							} else if(prev === 'right'){
								p.setFrame(1);
							};
						}
					}
				}
				if(i === data.length-1){ //Last
					if(data[i].x === data[i-1].x){
						if(data[i].y > data[i-1].y){
							cur = 'up';
						} else {
							cur = 'down';
						}
					} else {
						if(data[i].x > data[i-1].x){
							cur = 'left';
						} else {
							cur = 'right';
						}
					}
					p.setFrame(0);
				}
				//Set rotation
				if(p.frame.name === 0){
					if(cur === 'up'){
						p.setRotation(get_radians(270));
					} else if(cur === 'down'){
						p.setRotation(get_radians(90));
					} else if(cur === 'left'){
						p.setRotation(get_radians(180));
					} else if(cur === 'right'){
						p.setRotation(get_radians(0));
					}
				} else if(p.frame.name === 1){
					if(cur === 'up' || cur === 'down'){
						p.setRotation(get_radians(90));
					} else {
						p.setRotation(get_radians(0));
					}
				}
				prev = cur;
			}
		}
		function show_available_piece(){
			if(is_layer_empty()){
				completed();
			}
			let total = pieces.getLength();
			let child = pieces.getChildren();
			for(let i=0; i<total; i++){
				let piece = child[i];
				piece.available = false;
				let pos = piece.pos;
				if(pos.x === 0){
					piece.available = true;
				} else if(pos.x === 7){
					piece.available = true;
				} else if(pos.y === 0){
					piece.available = true;
				} else if(pos.y === 9){
					piece.available = true;
				} else if(!array[pos.y-1][pos.x].filled){
					piece.available = true;
				} else if(!array[pos.y+1][pos.x].filled){
					piece.available = true;
				} else if(!array[pos.y][pos.x-1].filled){
					piece.available = true;
				} else if(!array[pos.y][pos.x+1].filled){
					piece.available = true;
				}
				if(piece.available){
					array[piece.pos.y][piece.pos.x].available = true;
					piece.clearTint();
				} else {
					piece.setTint(0xd4ccba);
				}
			}
		}
		function is_layer_empty(){
			for(let y=0; y<10; y++){
				for(let x=0; x<8; x++){
					if(array[y][x].filled){
						return false;
					}
				}
			}
			return true;
		}
		function remove_shadow_at(pos){
			let child = shadows.getChildren();
			let total = shadows.getLength();
			for(let i=0; i<total; i++){
				if(child[i].pos.x === pos.x && child[i].pos.y === pos.y){
					child[i].destroy(true, true);
					break;
				}
			}
		}
		function inside(val, board){
			if(val.x >= 0 && val.y >=0 && val.x < board[0].length && val.y < board.length){
				return true;
			} else {
				return false;
			}
		}
		function find_around(to, pos1, pos2, board, next){
			let ways = [];
			for(let i=1; i<10; i++){
				let val = {
					x: pos1.x+(to.x*i),
					y: pos1.y+(to.y*i),
				}
				if(inside(val, board)){
					if(board[val.y][val.x].filled){
						if(!board[val.y][val.x]){
							//return false;
						}
						if(val.x === pos2.x && val.y === pos2.y){
							ways.push(val);
							return ways;
						} else {
							return false;
						}
					} else {
						ways.push(val);
						if(next){
							if(to.x === 1 || to.x === -1){
								let top = find_around({x:0, y:-1}, val, pos2, board);
								if(top){
									for(let i=0; i<top.length; i++){
										ways.push(top[i]);
									}
									return ways;
								}
								let down = find_around({x:0, y:1}, val, pos2, board);
								if(down){
									for(let i=0; i<down.length; i++){
										ways.push(down[i]);
									}
									return ways;
								}
							} else {
								let left = find_around({x:-1, y:0}, val, pos2, board);
								if(left){
									for(let i=0; i<left.length; i++){
										ways.push(left[i]);
									}
									return ways;
								}
								let right = find_around({x:1, y:0}, val, pos2, board);
								if(right){
									for(let i=0; i<right.length; i++){
										ways.push(right[i]);
									}
									return ways;
								}
							}
						} else {
							if(to.x === 1 || to.x === -1){
								if(find_straigh({x:0, y:1}, val, pos2, board)){
									for(let j=val.y+1; j<pos2.y+1; j++){
										ways.push({x: val.x, y: j});
									}
									return ways;
								} else if(find_straigh({x:0, y:-1}, val, pos2, board)){
									for(let j=val.y-1; j>pos2.y-1; j--){
										ways.push({x: val.x, y: j});
									}
									return ways;
								}
							} else {
								if(find_straigh({x:1, y:0}, val, pos2, board)){
									for(let j=val.x+1; j<pos2.x+1; j++){
										ways.push({x: j, y: val.y});
									}
									return ways;
								} else if(find_straigh({x:-1, y:0}, val, pos2, board)){
									for(let j=val.x-1; j>pos2.x-1; j--){
										ways.push({x: j, y: val.y});
									}
									return ways;
								}
							}
						}
					}
				}
			}
			return false;
		}
		function find_straigh(to, pos1, pos2, board){
			for(let i=1; i<10; i++){
				let val = {
					x: pos1.x+(to.x*i),
					y: pos1.y+(to.y*i),
				}
				if(inside(val, board)){
					if(board[val.y][val.x].filled){
						if(val.x === pos2.x && val.y === pos2.y){
							return true;
						} else {
							return false;
						}
					}
				} else {
					return false;
				}
			}
		}
		function find_way(pos1, pos2){
			let color = array[pos1.y][pos1.x].color;
			let board = JSON.parse(JSON.stringify(array)); //Framed board from array
			for(let y=0; y<10; y++){
				board[y].unshift({filled: false});
				board[y].push({filled: false});
			}
			let bx = [];
			for(let x=0; x<10; x++){
				bx.push({filled: false});
			}
			board.push(bx);
			board.unshift(bx);
			pos1.x++;
			pos1.y++;
			pos2.x++;
			pos2.y++;
			let ways = [];
			for(let i=0; i<4; i++){
				let to = {x: -1, y:0};
				if(i === 1){
					to = {x: 1, y: 0};
				} else if(i === 2){
					to = {x: 0, y: -1};
				} else if(i === 3){
					to = {x: 0, y: 1};
				}
				let res = find_around(to, pos1, pos2, board, true);
				//console.log(res);
				if(res){
					let arr = [];
					res.unshift(pos1);
					for(let i=0; i<res.length; i++){
						arr.push({x: res[i].x-1, y: res[i].y-1});
					}
					ways.push(arr);
				}
			}
			let pick = null;
			let max = 999;
			for(let i=0; i<ways.length; i++){
				if(ways[i].length < max){
					max = ways[i].length;
					pick = ways[i];
				}
			}

			pos1.x--;
			pos1.y--;
			pos2.x--;
			pos2.y--;
			return pick;
		}
		function update_left(){
			txt_shuffle_left.setText(player_data.shuffle_left);
			txt_hint_left.setText(player_data.hint_left);
		}
		function completed(){
			play_sound('completed', self);
			state = 'bonus';
			let type = 'hint';
			let rand = (Math.floor(Math.random()*2));
			if(rand === 1){
				type = 'shuffle';
			}
			if(type === 'hint'){
				player_data.hint_left++;
			} else if(type === 'shuffle'){
				player_data.shuffle_left++;
			}
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.alpha = 0.8;
			self.add.text(360, 320, 'COMPLETED', {fontFamily: 'PoetsenOne', fontSize: 65, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let bonus_icon = self.add.sprite(360,480,type+'_icon');
			self.add.text(360, 600, '+1', {fontFamily: 'PoetsenOne', fontSize: 75, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let b_next = draw_button(360, 700, 'next', self);
			//
			last_array = null;
			player_data.drop_mode++;
			array = null;
			save_game();
		}
		function gameover(){
			play_sound('gameover', self);
			if(player_data.score > best_score){
				best_score = player_data.score;
				localStorage.setItem('redfoc_onet_best', best_score);
			}
			bring_piece_to_back();
			state = 'gameover';
			let dark = self.add.rectangle(0,0,config.width,config.height,0x000000).setOrigin(0);
			dark.alpha = 0.8;
			self.add.text(360, 400, 'GAMEOVER', {fontFamily: 'PoetsenOne', fontSize: 65, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			self.add.text(360, 480, 'SCORE: '+player_data.score, {fontFamily: 'PoetsenOne', fontSize: 45, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
			let b_restart = draw_button(360, 610, 'restart', self);
			let b_menu = draw_button(360, 700, 'menu', self);
			clear_data();
			localStorage.setItem('redfoc_onet_data', JSON.stringify(player_data));
		}
		function save_game(){
			let p = {
				arr: array,
				data: player_data,
			}
			last_array = JSON.parse(JSON.stringify(array));
			localStorage.setItem('redfoc_onet_array', JSON.stringify(p));
		}
	}
}
function clear_data(){
	localStorage.removeItem('redfoc_onet_array');
	player_data = Object.assign({}, def_player_data);
	last_array = null;
	localStorage.setItem('redfoc_onet_data', JSON.stringify(player_data));
	is_new_game = true;
	console.log("new game true");
}
function play_sound(id, scope){
	if(game_data.sound){
		scope.sound.play(id);
	}
}
function switch_audio(obj){
	if(game_data[obj.name]){
		game_data[obj.name] = false;
		obj.setTexture('btn_sound_off');
	} else {
		game_data[obj.name] = true;
		obj.setTexture('btn_sound_on');
	}
}
function check_audio(obj){
	if(game_data[obj.name]){
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
	height: 1080,
	scale: {
        mode: Phaser.Scale.FIT,
        parent: 'game_content',
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
	scene: [Boot, Load, Menu, Game],
}
var game = new Phaser.Game(config);