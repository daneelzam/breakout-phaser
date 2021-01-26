// инициализация игры, передаем размеры холста (при масштабировании будет
// сохраняться соотношение сторон), дом элемент, который будет рендерить файзерб
// id canvas (если он есть), три функции для работы игры
const game = new Phaser.Game(480, 480, Phaser.CANVAS, null, {
  preload, create, update,
});
// переменные мяча и ракетки
let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;

function initBricks(params) {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 3,
      col: 7,
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10,
  };
  bricks = game.add.group();
  for (let c = 0; c < brickInfo.count.col; c += 1) {
    for (let r = 0; r < brickInfo.count.row; r += 1) {
      let brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      let brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

// предзагрузка ресурсов игры
function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;// масштабирование игры до
  // размера экрана с сохранением пропорций
  game.scale.pageAlignHorizontally = true;// выравнивание по горизонтали
  game.scale.pageAlignVertically = true;// выравнивание по вертикали
  game.stage.backgroundColor = '#eee';// цвет фона
  game.load.image('ball', 'img/ball.png');// загрузка спрайта мяча
  game.load.image('paddle', 'img/paddle.png');// загруза спрайта ракетки
  game.load.image('brick', 'img/brick.png');
}
// вызывается только один раз, когда всё загружено и готово
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);// подключение физики типа АРКАДА
  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');// добавление спрайта на холст
  // указание его начальных координат и имени
  ball.anchor.set(0.5);// смежение центра объекта в центр спрайта (по умолчанию левый край)
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  game.physics.enable(ball, Phaser.Physics.ARCADE);// включение в физику игры мячика
  ball.body.collideWorldBounds = true;// включение границ холста для мячика, чтобы не вылетал
  ball.body.bounce.set(1);// заставляет мяч отскакивать от стен
  ball.body.velocity.set(150, -150);// начальное направление движения мяча
  game.physics.arcade.checkCollision.down = false; // отключение границ для низа
  ball.checkWorldBounds = true;// слежение, что мячик внутри границ
  ball.events.onOutOfBounds.add(() => { // слушатель события, что мяч вышел за границы мира
    alert('Game over!');// если мяч вылетел, то Game Over
    document.location.reload();// и перезагрузка страницы
  }, this);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);// добавляем в физику мира ракетку
  paddle.body.immovable = true;// делаем ракетку несбиваемой
  initBricks();
}
// вызывается на каждом кадре
function update() {
  game.physics.arcade.collide(ball, paddle);// отслеживает столкновение шарика и ракетки
  game.physics.arcade.collide(ball, bricks, ballHitBrick);
  paddle.x = game.input.x || game.world.width * 0.5;// смещает позицию ракетки в соответствии
  // с позицией курсора или ставит по центру, если позиция курсора не определена
}

function ballHitBrick(ball, brick) {
  brick.kill();
}
