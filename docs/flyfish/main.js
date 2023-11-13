title = "Fly Fish";

description = `  
`;

characters = [
'rrr'
];

options = {
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2002,
};

const G = {
	WIDTH: 100,
	HEIGHT: 150,
}

let horizontalVelocity = 0;
let verticalLevel = 0;
let pin;
let player;
let obstacles;
let counter = 0;
let rot = 0;
let turnSpeed = 0.01


function update() {
  if (!ticks) {
  }

  player = {
    pos:vec(G.WIDTH, G.HEIGHT),
    angle:0,
  }
  player.pos = vec(G.WIDTH * 0.5 + horizontalVelocity, (G.HEIGHT - 60) + verticalLevel);
  char("a", player.pos, {rotation: rot});
}
