const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
  preload, create, update,
});

// предзагрузка ресурсов игры
function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#eee';
}
// вызывается только один раз, когда всё загружено и готово
function create() {

}
// вызывается на каждом кадре
function update() {

}
