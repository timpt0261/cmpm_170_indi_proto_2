title = "Fly Squid";
// note changing the description changes the sfx
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
  WIDTH: 100,
  HEIGHT: 300,
  PARTICLE_SPEED_MIN: 0.5,
  PARTICLE_SPEED_MAX: 1.0,
  STOP_HEIGHT: 40,
};

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Fish
  */

/**
* @type  { Fish }
*/
let player;


/**
* @type  { Fish [] }
*/
let fish;



options = {
  viewSize:{x:G.HEIGHT, y:G.WIDTH},
  // theme: "pixel",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2003
};


let horizontalVelocity = 0;
let verticalVelocity = 0;


let lines = [];
let timer = 60;

// Example usage: restart the game when a key is pressed
// if (input.isJustPressed) {
//   initializeGame();
// }

function update() {
  if (!ticks) {
    player = {
      pos: vec(G.HEIGHT* 0.1, G.WIDTH * 0.5),
      speed: G.PARTICLE_SPEED_MIN
    };
  }

  char("a", player.pos);
  // handleCollsion();
}

function handleCollsion() {

}
