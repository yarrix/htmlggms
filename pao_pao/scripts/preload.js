class Load extends Phaser.Scene {
	constructor(){
		super('load');
	}
	preload(){
		this.add.sprite(360,540,'background');
		this.add.sprite(360,320,'game_title');
		let bar = this.add.rectangle(config.width/2, 600, 600, 20);
		bar.setStrokeStyle(4, 0xffffff);
		bar.alpha = 0.7;
		let progress = this.add.rectangle(config.width/2, 600, 590, 10, 0xffffff);
		progress.alpha = 0.8;
		this.load.on('progress', (value)=>{
			progress.width = 590*value;
		});
		this.load.on('complete', ()=>{
			bar.destroy();
			progress.destroy();
			let b_start = draw_button(360, 700, 'start', this);
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
		this.load.image('shadow', 'img/shadow.png');
		this.load.image('sign', 'img/sign.png');
		this.load.image('header', 'img/header.png');
		this.load.image('footer', 'img/footer.png');
		this.load.image('btn_home', 'img/btn_home.png');
		this.load.image('btn_shuffle', 'img/btn_shuffle.png');
		this.load.image('btn_hint', 'img/btn_hint.png');
		this.load.image('btn_play', 'img/btn_play.png');
		this.load.image('btn_next', 'img/btn_next.png');
		this.load.image('btn_new', 'img/btn_new.png');
		this.load.image('btn_sound_on', 'img/btn_sound_on.png');
		this.load.image('btn_sound_off', 'img/btn_sound_off.png');
		this.load.image('btn_restart', 'img/btn_restart.png');
		this.load.image('btn_menu', 'img/btn_menu.png');
		this.load.image('btn_start', 'img/btn_start.png');
		this.load.image('circle', 'img/circle.png');
		this.load.image('arrow', 'img/arrow.png');
		this.load.image('shuffle_icon', 'img/shuffle_icon.png');
		this.load.image('hint_icon', 'img/hint_icon.png');
		this.load.image('score_bar', 'img/score_bar.png');
		this.load.spritesheet('lines', 'img/lines.png', {frameWidth: 90, frameHeight: 90});
		for(let i=1; i<=22; i++){
			this.load.image('obj'+i, 'img/obj'+i+'.png');
		}
		//Load all audio
		this.load.audio('click', 'audio/click.mp3');
		this.load.audio('connected', 'audio/connected.mp3');
		this.load.audio('itemclick', 'audio/itemclick.mp3');
		this.load.audio('gameover', 'audio/gameover.mp3');
		this.load.audio('nomatch', 'audio/nomatch.mp3');
		this.load.audio('completed', 'audio/completed.mp3');
		this.load.audio('hint', 'audio/hint.mp3');
		this.load.audio('shuffle', 'audio/shuffle.mp3');
	}
	create(){
		//this.scene.start('menu');
	}
}