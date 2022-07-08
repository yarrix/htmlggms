var last_array = 0;
var best_score = 0;
var game_data = {
	sound: true,
}
var player_data = {
	drop_mode: 0,
	hint_left: 5,
	shuffle_left: 5,
	score: 0,
}
var def_player_data = {
	drop_mode: 0,
	hint_left: 5,
	shuffle_left: 5,
	score: 0,
}
//localStorage.removeItem('redfoc_onet_array');
load_data();
function load_data(){
	let local_data = localStorage.getItem('redfoc_onet_best');
	if(local_data){ //Load existing game data
		best_score = local_data;
	}
	let local_data2 = localStorage.getItem('redfoc_onet_data');
	if(local_data2){ //Load existing game data
		player_data = JSON.parse(local_data2);
	}
	let local_data3 = localStorage.getItem('redfoc_onet_array');
	if(local_data3){ //Load existing game data
		let p = JSON.parse(local_data3);
		last_array = p.arr;
		player_data = p.data;
	}
}
class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		var self = this;
		this.add.sprite(0,0,'background').setOrigin(0);
		this.add.sprite(0,0,'header').setOrigin(0);
		this.add.sprite(0,config.height,'footer').setOrigin(0,1);
		let title = this.add.sprite(360, 320, 'game_title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.text(360, 600, 'BEST SCORE:', {fontFamily: 'PoetsenOne', fontSize: 35, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		this.add.text(360, 650, String(best_score), {fontFamily: 'PoetsenOne', fontSize: 30, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let b_play = draw_button(360, 740, 'play', this);
		let b_new = draw_button(360, 840, 'new', this);
		if(!last_array){
			b_new.alpha = 0.5;
		}
		this.input.on('gameobjectdown', (pointer, obj)=>{
			if(obj.button && obj.alpha === 1){
				play_sound('click', this);
				this.tweens.add({
					targets: obj,
					scaleX: 0.9,
					scaleY: 0.9,
					yoyo: true,
					ease: 'Linear',
					duration: 100,
					onComplete: function(){
						if(obj.name === 'play'){
							//player_data.drop_mode = 0;
							//player_data.score = 0;
							self.scene.start('game');
						} else if(obj.name === 'new'){
							clear_data();
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
	}
}