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
`,`
r  rr
 r1rrr
r  rr
`,
];

const G = {
  WIDTH: 300,
  HEIGHT: 100,
  INIT_POS_X: 30,
  INIT_POS_Y: 80,
  SPAWN_SQUID_RATE: 60,
  PARTICLE_VELOCITY_MIN: 0.1,
  PARTICLE_VELOCITY_MAX: 3.0,
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
  
  if(input.isJustReleased){
    verticalAcceleration = -0.5 * player.velocity;
    horizontalAcceleration = 1.5 * player.velocity;
  }

  color("blue");
  box(0, 30, 600, 1);
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
}

function spawnSquid() {
  squidSpawn--;
  if(squidSpawn > 0) return;
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

function handleCollision() {
  const isColidingWithSquids = char("a", player.pos).isColliding.char.b;
  if(isColidingWithSquids){
    console.log("Touching other squids");
  }
}
function moveSquid() {
  squids.forEach((squid)=>{
    if(squid.pos.x < 0) squids.splice(squids.indexOf(squid), 1);
    squid.pos.x -= rnd(G.PARTICLE_VELOCITY_MIN, G.PARTICLE_VELOCITY_MAX);
    char("b", squid.pos);
  })
}

