title = "Fly Squid";
description = `
  [Hold] up
  [Release] down
`;

characters = [
  `
r  rr
 r1rrr
r  rr
`, `
g  gg
 g1ggg
g  gg
`,
];

const G = {
  WIDTH: 300,
  HEIGHT: 100,
  INIT_POS_X: 30,
  INIT_POS_Y: 80,
  SPAWN_SQUID_RATE: 60,
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
let school = [];

/**
 * @type  { Squid [] }
 */
let squids = [];

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2003,
};

let verticalAcceleration = 0;
let horizontalAcceleration = 0;
let squidSpawn = G.SPAWN_SQUID_RATE;

let lines = [];
let timer = 1000;

function update() {
  if (!ticks) {
    player = {
      pos: vec(G.INIT_POS_X, G.INIT_POS_Y),
      velocity: 0.8,
      acceleration: 0,
    };

  }
  timer--;
  if (timer <= 0) {
    timer = 1000;
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
  // console.log("Postion", player.pos);
  char("a", player.pos);



  spawnSquid();
  moveSquid();


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
    if (isOutofBounds || isCollidingWithPlayer) squids.splice(squids.indexOf(squid), 1);
    squid.pos.x -= rnd(G.PARTICLE_VELOCITY_MIN, G.PARTICLE_VELOCITY_MAX);
    color("black");
    char("b", squid.pos);
  })
}


function handleCollision() {
  const isColidingWithSquids = char("a", player.pos).isColliding.char.b;
  if (isColidingWithSquids) {
    play("powerUp");
    addScore(1);
    arc(player.pos, 6, 1);
    /**
     ** @type  { Squid }
     */
    const squid = {
      pos: (player.pos),
      velocity: player.velocity,
      acceleration: 0
    }
    school.push(squid);

  }
}
function updateSchool() {
  const angleIncrement = (2 * Math.PI) / school.length; // Angle between squids
  let currentAngle = 0;

  school.forEach((squid) => {
    // Calculate the position relative to the player based on the angle
    const offsetX = 20 * Math.cos(currentAngle); // Adjust the distance from the player
    const offsetY = 20 * Math.sin(currentAngle);

    // Set the squid's position to be around the player
    squid.pos = vec(player.pos.x + offsetX, player.pos.y + offsetY);

    // Update the angle for the next squid
    currentAngle += angleIncrement;

    // Draw the squid
    color('blue');
    char('b', squid.pos);
  });
}


