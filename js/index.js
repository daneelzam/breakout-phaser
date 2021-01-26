const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload, create, update,
});
let ball;
// предзагрузка ресурсов игры
function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
  game.load.image('ball', 'img/ball.png');
}
// вызывается только один раз, когда всё загружено и готово
function create() {
  ball = game.add.sprite(50, 100, 'ball');
}
// вызывается на каждом кадре
function update() {

}

