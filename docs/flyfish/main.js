title = "Fly Squid";
description = `
  [Hold] up
  [Release] down
`;

characters = [
  `
b  bb
 b1bbb
b  bb
`,
  `
g  gg
 g1ggg
g  gg
`,
  `
 rrrr
rrrrrr
rrrrrr
 rrrr
`,
];

const G = {
  WIDTH: 300,
  HEIGHT: 100,
  INIT_POS_X: 30,
  INIT_POS_Y: 80,
  MAX_SCHOOL_LENGTH: 20,
  SPAWN_SQUID_RATE: 60,
  SPAWN_BARRELS_RATE: 80,
  PARTICLE_VELOCITY_MIN: 0.5,
  PARTICLE_VELOCITY_MAX: 1.0,
  STOP_POS_X: 150,
  STOP_POS_Y: 10,
};

/**
 * @typedef {{
 * pos: Vector,
 * velocity: number,
 * acceleration: number
 * }} Squid
 */

/**
 * @type  { Squid }
 */
let player;

/**
 * @type  { Squid [] }
 */
let school = new Array(G.MAX_SCHOOL_LENGTH);

/**
 * @type  { Squid [] }
 */
let squids = [];

/**
 * @typedef {{
 * pos: Vector,
 * velocity: number,
 * acceleration: number
 * }} Barrels
 */

/**
 * @type  { Barrels [] }
 */
let barrels = [];

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2003,
};

let lives = 1;
let verticalAcceleration = 0;
let horizontalAcceleration = 0;
let squidSpawn = G.SPAWN_SQUID_RATE;
let barrelSpawn = G.SPAWN_BARRELS_RATE;

let lines = [];
let timer = 1000;

function update() {
  if (!ticks) {
    player = {
      pos: vec(G.INIT_POS_X, G.INIT_POS_Y),
      velocity: 0.8,
      acceleration: 0,
    };
    lives = 1;
    school = [];
    barrels = [];
    squids = [];
    color("blue");
    char("a", player.pos);
  }
  timer--;
  if (timer <= 0) {
    timer = 1000;
  }

  if (lives <= 0) {
    end();
  }

  if (input.isJustPressed) {
    verticalAcceleration = 0.5 * player.velocity;
    horizontalAcceleration = -0.5 * player.velocity;
  }

  if (input.isJustReleased) {
    verticalAcceleration = -0.5 * player.velocity;
    horizontalAcceleration = 1.5 * player.velocity;
  }

  player.pos.x = clamp(
    player.pos.x + verticalAcceleration,
    G.INIT_POS_X,
    G.STOP_POS_X
  );

  player.pos.y = clamp(
    player.pos.y + horizontalAcceleration,
    G.STOP_POS_Y,
    G.INIT_POS_Y
  );

  color("blue");
  char("a", player.pos);

  color("black");
  spawnSquid();
  moveSquid();

  spawnBarrels();
  moveBarrels();

  handleCollision();
  updateSchool();

  color("blue");
  box(0, 30, 600, 1);
}

function spawnSquid() {
  squidSpawn--;
  if (squidSpawn > 0) return;
  const y = rnd(30, 80);
  /**
   * @type  { Squid }
   */
  const squid = {
    pos: vec(300, y),
    velocity: G.PARTICLE_VELOCITY_MIN,
    acceleration: 0,
  };
  squids.push(squid);
  squidSpawn = G.SPAWN_SQUID_RATE;
}

function moveSquid() {
  squids.forEach((squid) => {
    const isOutofBounds = squid.pos.x < 0;
    const isCollidingWithPlayer = char("b", squid.pos).isColliding.char.a;

    if (isOutofBounds || isCollidingWithPlayer)
      squids.splice(squids.indexOf(squid), 1);

    squid.pos.x -= rnd(G.PARTICLE_VELOCITY_MIN, G.PARTICLE_VELOCITY_MAX);
    color("green");
    char("b", squid.pos);

    color("black");
  });
}

function handleCollision() {
  const isColidingWithSquids = char("a", player.pos).isColliding.char.b;
  const isColidingWithBarrels = char("a", player.pos).isColliding.char.c;
  if (isColidingWithSquids) {
    play("powerUp");
    addScore(1);
    arc(player.pos, 6, 1);
    /**
     ** @type  { Squid }
     */
    const squid = {
      pos: player.pos,
      velocity: player.velocity,
      acceleration: 0,
    };
    school.push(squid);
    lives++;
  }

  if (isColidingWithBarrels) {
    lives--;
    play("explosion");
    color("red");
    particle(player.pos, 10, 2);
    if (school.length) school.shift();
  }
}
function updateSchool() {
  const angleIncrement = (2 * Math.PI) / school.length; // Angle between squids
  let currentAngle = 0;

  school.forEach((squid) => {
    const isColidingWithSquids = char("a", player.pos).isColliding.char.b;
    const isColidingWithBarrels = char("b", squid.pos).isColliding.char.c;

     if (isColidingWithSquids) {
       play("powerUp");
       addScore(1);
       arc(player.pos, 6, 1);
       /**
        ** @type  { Squid }
        */
       const squid = {
         pos: player.pos,
         velocity: player.velocity,
         acceleration: 0,
       };
       school.push(squid);
       lives++;
     }
    if (isColidingWithBarrels) {
      lives--;
      play("explosion");
      color("red");
      particle(player.pos, 10, 2);
      school.splice(squids.indexOf(squid), 1);
    }
    const offset = 2.1715 * Math.log2(100 * school.length);

    const offsetX = offset * Math.cos(currentAngle);
    const offsetY = offset * Math.sin(currentAngle);

    // Set the squid's position to be around the player
    squid.pos = vec(player.pos.x + offsetX, player.pos.y + offsetY);

    // Update the angle for the next squid
    currentAngle += angleIncrement;

    squid.pos.angle += angleIncrement;

    // Draw the squid
    color("blue");
    char("b", squid.pos);
  });
}
function spawnBarrels() {
  barrelSpawn--;
  if (barrelSpawn > 0) return;
  const y = rnd(30, 80);
  /**
   * @type  { Barrels }
   */
  const barrel = {
    pos: vec(300, y),
    velocity: G.PARTICLE_VELOCITY_MIN,
    acceleration: 0,
  };
  barrels.push(barrel);
  barrelSpawn = G.SPAWN_BARRELS_RATE;
}

function moveBarrels() {
  barrels.forEach((barrel) => {
    const isOutofBounds = barrel.pos.x < 0;
    const isCollidingWithPlayer = char("c", barrel.pos).isColliding.char.a;
    if (isOutofBounds || isCollidingWithPlayer)
      barrels.splice(barrels.indexOf(barrel), 1);
    barrel.pos.x -= 0.5;
    barrel.pos.y = 20 * cos(barrel.pos.x / 10) + 30;
    color("red");
    char("c", barrel.pos);

    color("black");
  });
}
