class Boot extends Phaser.Scene {
	constructor(){
		super('boot');
	}
	preload(){
		this.load.image('bg_menu', 'img/bg_menu.png');
		this.load.image('game_title', 'img/game_title.png');
		this.load.image('header', 'img/header.png');
		this.load.image('footer', 'img/footer.png');
		this.load.image('btn_start', 'img/btn_start.png');
	}
	create(){
		this.scale.stopListeners();
		this.scene.start('preload');
	}
}