var bestscore = 0;
var game_settings = {
	sound: true
}

//localStorage.removeItem('rf.find_pair');
load_data();
function load_data(){
	let local_data = localStorage.getItem('rf.find_pair');
	if(local_data){ //Load existing game data
		bestscore = local_data;
	}
}
class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		var self = this;
		this.add.sprite(config.width/2, config.height/2, 'bg_game');
		let title = this.add.sprite(360, 392, 'game_title');
		this.tweens.add({
			targets: title,
			y: title.y+30,
			duration: 1300,
			ease: 'Sine.easeInOut',
			yoyo: true,
			repeat: -1,
		});
		this.add.sprite(345, 780, 'best_bar_large');
		this.add.text(400, 774, bestscore, {fontFamily: 'vanilla', fontSize: 38, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let b_play = draw_button(360, 960, 'play', this);
		this.input.on('gameobjectdown', (pointer, obj)=>{
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
						if(obj.name === 'play'){
							pre_score = 0;
							cur_level = 0;
							self.scene.start('game');
						}
					}
				}, this);
			}
		}, this);
		this.add.text(360, 1200, dev_str, {fontFamily: 'vanilla', fontSize: 20, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
	}
}