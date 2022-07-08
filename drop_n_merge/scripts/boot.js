class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		//load some initial sprites
		this.load.image('bg_menu', 'img/bg_menu.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('btn_start', 'img/btn_start.png');
	}
	create(){
		this.scale.stopListeners();
		this.scene.start('load');
	}
}