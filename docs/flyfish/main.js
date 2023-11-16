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
];

const G = {
  WIDTH: 300,
  HEIGHT: 100,
  INIT_POS_X: 30,
  INIT_POS_Y: 50,
  PARTICLE_VELOCITY_MIN: 0.5,
  PARTICLE_SPEED_MAX: 1.0,
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
let squids;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2003,
};

let verticalAcceleration = 0;
let horizontalAcceleration = 0;

let lines = [];
let timer = 1000;

function update() {
  if (!ticks) {
    player = {
      pos: vec(G.INIT_POS_X, G.INIT_POS_Y),
      velocity: G.PARTICLE_VELOCITY_MIN,
      acceleration: 0,
    };
  }
  timer--;
  if (timer <= 0) {
    timer = 1000;
  }
  // if (timer % 100 === 0) spawnSquid();
  
  

  console.log("timer", timer);
  if (input.isPressed) {
    verticalAcceleration = 0.5 * player.velocity;
    horizontalAcceleration = -0.5 * player.velocity;
  } else {
    
    verticalAcceleration = -0.5 * player.velocity;
    horizontalAcceleration = player.pos.y > 15 ? 1.5 * player.velocity : - 1.5 * player.velocity;
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
  console.log("Postion", player.pos);
  char("a", player.pos);


  // if(squids.length > 0 ){
  //    squids.forEach((squid) => {
  //      char("a", squid.pos);
  //    });

  // }
 
  handleCollision();
}

function spawnSquid() {
  const x = rnd(G.INIT_POS_X + 50, G.STOP_POS_X);
  const y = rnd(G.STOP_POS_Y, G.INIT_POS_Y);
  const amount = rnd(1, 3);
  const displace = { x, y };
  for (let i = 0; i <= amount; i++) {
    displace.x += rnd(-1, 1);
    displace.y += rnd(-1, 1);
    /**
     * @type  { Squid }
     */
    const squid = {
      pos: vec(displace),
      velocity: G.PARTICLE_SPEED_MAX,
      acceleration: 0,
    };
    squids.push(squid);
  }
}

function handleCollision() {
  // Add collision handling logic here
}
