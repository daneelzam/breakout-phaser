// инициализация игры, передаем размеры холста (при масштабировании будет
// сохраняться соотношение сторон), дом элемент, который будет рендерить файзерб
// id canvas (если он есть), три функции для работы игры
const game = new Phaser.Game(480, 480, Phaser.CANVAS, null, {
  preload, create, update,
});
// переменные мяча и ракетки
let ball;
let paddle;
let bricks;// массив кирпичиков
let newBrick;// один кирпич
let brickInfo;// инфо о кирпичах
let scoreText;
let score = 0;
let lives = 3;
let livesText;
let lifeLostText;
const textStyle = { font: '18px Arial', fill: '#0095DD' };

// функция иницилизирующая кирпичи
function initBricks() {
  // описание кирпичей
  brickInfo = {
    width: 50, // ширина
    height: 20, // высота
    count: {
      row: 3, // кол-во строк
      col: 7, // кол-во столбцов
    },
    offset: {
      top: 50, // отступ сверху
      left: 60, // отсутп слева
    },
    padding: 10, // отсути между
  };
  bricks = game.add.group(); // инициализация кирпичей в игре
  for (let c = 0; c < brickInfo.count.col; c += 1) { // цикл по столбцам
    for (let r = 0; r < brickInfo.count.row; r += 1) { // цикл по строкам
      // расчет стартовой позиции в зависимости от столбца и строки
      const brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
      const brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
      // создание нового спрайта кирпича
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      // добавление нашего спрайти в физику игры
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      // кирпичь не сбивается шариком
      newBrick.body.immovable = true;
      // смещение центра кирпича
      newBrick.anchor.set(0.5);
      // добавление кирпича в коллекцию кирпичей
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
  ball.events.onOutOfBounds.add(ballLeaveScreen, this);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);// добавляем в физику мира ракетку
  paddle.body.immovable = true;// делаем ракетку несбиваемой
  initBricks();// отрисовка кирпичей
  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  livesText = game.add.text(game.world.width - 35, 20, `Lives: ${lives}`, textStyle);
  livesText.anchor.set(1, 0);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
  livesText.anchor.set(0.5);
  lifeLostText.visible = false;
}
// вызывается на каждом кадре
function update() {
  game.physics.arcade.collide(ball, paddle);// отслеживает столкновение шарика и ракетки
  game.physics.arcade.collide(ball, bricks, ballHitBrick);// отслеживает столкновение мячива и
  // кирпичика и при каждом столкновении вызывает функцию
  paddle.x = game.input.x || game.world.width * 0.5;// смещает позицию ракетки в соответствии
  // с позицией курсора или ставит по центру, если позиция курсора не определена
}

// функция которая вызывается при столкновении мячика и кирпичика, которая уничтожает кирпич
function ballHitBrick(ball, brick) {
  brick.kill();
  score += 1;
  scoreText.setText(`Points: ${score}`);

  let countAlive = 0;

  for (let i = 0; i < bricks.children.length; i += 1) {
    if (bricks.children[i].alive == true) {
      countAlive += 1;
    }
  }
  if (countAlive === 0) {
    alert('You won the game, congratulations!');
    document.location.reload();
  }
}

// слушатель события, что мяч вышел за границы мира
function ballLeaveScreen() {
  lives -= 1;
  livesText.setText(`Lives: ${lives}`);
  if (lives) {
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(() => {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert('Game over!');// если мяч вылетел, то Game Over
    document.location.reload();// и перезагрузка страницы
  }
}
