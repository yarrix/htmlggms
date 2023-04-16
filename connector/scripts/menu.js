class Menu extends Phaser.Scene {
	constructor(){
		super('menu');
	}
	create(){
		let self = this;
		this.add.sprite(360,540,'bg_menu');
		this.add.sprite(0,0,'header').setOrigin(0);
		this.add.sprite(0,config.height,'footer').setOrigin(0,1);
		this.add.sprite(230,50,'coin_bar');
		let txt_coin = this.add.text(320, 50, String(game_data.coin), {fontFamily: 'robotomono', fontSize: 31, align: 'right', color: '#fff'}).setOrigin(1,0.5);
		let b_sound = draw_button(50,50, 'sound_on', this);
		b_sound.name = 'sound';
		check_audio(b_sound);
		//
		let title = this.add.sprite(360,315,'game_title');
		let b_paly = draw_button(360, 680, 'play', this);
		//
		this.input.on('gameobjectdown', function(pointer, obj){
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
						if(obj.name === 'play'){
							self.scene.start('game');
						} else if(obj.name === 'sound'){
							switch_audio(obj);
						}
					}
				})
			}
		}, this);
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