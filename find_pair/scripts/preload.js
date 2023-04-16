var dev_str = '';
class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(config.width/2, config.height/2, 'bg_menu');
		this.add.sprite(360, 392, 'game_title');
		this.add.text(360, 1200, dev_str, {fontFamily: 'vanilla', fontSize: 20, align: 'center',color: '#FFFFFF'}).setOrigin(0.5);
		let bar = this.add.rectangle(config.width/2, 900, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 900, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			bar.destroy();
			progress.destroy();
			let b_start = draw_button(360, 900, 'start', this);
			this.tweens.add({
				targets: b_start,
				alpha: 0.5,
				yoyo: true,
				duration: 300,
				loop: -1,
			});
		}, this);
		this.input.on('gameobjectdown', ()=>{
			this.scene.start('menu');
		}, this);
		//
		//load all game assets
		this.load.image('bg_game', 'img/bg_game.png');
		this.load.image('score_bar', 'img/score_bar.png');
		this.load.image('best_bar', 'img/best_bar.png');
		this.load.image('best_bar_large', 'img/best_bar_large.png');
		this.load.image('header', 'img/header.png');
		this.load.image('progress', 'img/progress.png');
		this.load.image('timer_bar', 'img/timer_bar.png');
		this.load.image('timer_icon', 'img/timer_icon.png');
		this.load.image('popup_gameover', 'img/popup_gameover.png');
		this.load.image('popup_pause', 'img/popup_pause.png');
		this.load.image('popup_completed', 'img/popup_completed.png');
		this.load.image('txt_pause', 'img/txt_pause.png');
		this.load.image('txt_gameover', 'img/txt_gameover.png');
		this.load.image('txt_completed', 'img/txt_completed.png');
		this.load.image('btn_sound_on', 'img/btn_sound_on.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_menu', 'img/btn_menu.png');
		this.load.image('btn_resume', 'img/btn_resume.png');
		this.load.image('btn_restart', 'img/btn_restart.png');
		this.load.image('btn_pause', 'img/btn_pause.png');
		this.load.image('btn_play', 'img/btn_play.png');
		this.load.image('btn_close', 'img/btn_close.png');
		this.load.image('btn_next', 'img/btn_next.png');
		this.load.spritesheet('tiles', 'img/tiles.png', {frameWidth: 128, frameHeight: 128});
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('tile', 'audio/tile.mp3');
		this.load.audio('match', 'audio/match.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
	}
	create(){
		//this.scene.start('game');
	}
}