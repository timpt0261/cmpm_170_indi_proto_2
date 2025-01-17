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
  `
bbbbb
`,
];

const G = {
  WIDTH: 300,
  HEIGHT: 100,
  INIT_POS_X: 30,
  INIT_POS_Y: 80,
  MAX_SCHOOL_LENGTH: 10,
  SPAWN_WATER_RATE: 10,
  SPAWN_SQUID_RATE: 60,
  SPAWN_BARRELS_RATE: 60, // 30 to 60
  PARTICLE_VELOCITY_MIN: 0.5,
  PARTICLE_VELOCITY_MAX: 1.0,
  STOP_POS_X: 150,
  STOP_POS_Y: 10,
};

let lives = 1;
let verticalAcceleration = 0;
let horizontalAcceleration = 0;
let squidSpawn = G.SPAWN_SQUID_RATE;

// barrel var
let speed = G.PARTICLE_VELOCITY_MIN;
const amplitude = 15; // 15 to 50
const frequency = 20;
let yOffset = 30;

/**
 * @typedef {{
 * pos: Vector,
 * velocity: number,
 * acceleration: number
 * }} GameObject
 */
/**
 * @typedef {{
 * charcter : string,
 * color:string,
 * spawnRate: number,
 * objects: GameObject[],
 * spawn: () => void,
 * move: () => void
 * }} factory
 */

/**
 * @typedef {{
 * speed:number,
 * amplitude : number,
 * frequnecy: number, 
 * offset:number,
 * calc:()=>number
 * }} GraphParms
 */


class Factory {
  character;
  color;
  init_rate;
  rate;
  objects;
  constructor(character, color, rate) {
    this.character = character;
    this.color = color;
    this.init_rate = rate;
    this.rate = rate;
    this.objects = new Array();
  }

  spawn(vec) {
    this.rate--;
    if (this.rate > 0) return;
    /**
     * @type  { GameObject }
     */
    const object = {
      pos: vec,
      velocity: G.PARTICLE_VELOCITY_MIN,
      acceleration: 0,
    };
    this.objects.push(object);
    this.rate = clamp(this.init_rate - (difficulty * 1e-4), 30, this.init_rate );
  }

  move(speed, amplitude, frequency, yOffset) {
    speed = clamp(
      speed + difficulty * 1e-4,
      G.PARTICLE_VELOCITY_MIN,
      G.PARTICLE_VELOCITY_MIN
    );

    this.objects.forEach((object) => {
      const isOutofBounds = object.pos.x < 0;
      const isCollidingWithPlayer = char(this.character, object.pos).isColliding
        .char.a;

      if (isOutofBounds || isCollidingWithPlayer)
        this.objects.splice(this.objects.indexOf(object), 1);

      object.pos.x -= speed;
      object.pos.y = amplitude * cos(object.pos.x / frequency) + yOffset;

      color(this.color);
      char(this.character, object.pos);

      color("black");
    });
  }
}

class Squid extends Factory {
  constructor(character, color, rate) {
    super(character, color, rate);
  }

  spawn(vec) {
    super.spawn(vec);
  }

  move() {
    this.objects.forEach((squid) => {
      const isOutofBounds = squid.pos.x < 0;
      const isCollidingWithPlayer = char("b", squid.pos).isColliding.char.a;

      if (isOutofBounds || isCollidingWithPlayer)
        this.objects.splice(this.objects.indexOf(squid), 1);

      squid.pos.x -= rnd(G.PARTICLE_VELOCITY_MIN, G.PARTICLE_VELOCITY_MAX);
      color("green");
      char("b", squid.pos);

      color("black");
    });
  }
}

class Barrels extends Factory {
  constructor(character, color, rate) {
    super(character, color, rate);
  }

  spawn(vec) {
    super.spawn(vec);
  }

  move(speed, amplitude, frequency, yOffset) {
    super.move(speed, amplitude, frequency, yOffset);
  }
}

class Water extends Factory {
  constructor(character, color, rate) {
    super(character, color, rate);
  }

  spawn(vec) {
    super.spawn(vec);
  }

  move(speed, amplitude, frequency, yOffset) {
    speed = clamp(
      speed + difficulty * 1e-4,
      G.PARTICLE_VELOCITY_MIN,
      G.PARTICLE_VELOCITY_MIN
    );

    this.objects.forEach((object) => {
      const isOutofBounds = object.pos.x < 0;
      const isCollidingWithPlayer = char(this.character, object.pos).isColliding
        .char.a;

      if (isOutofBounds)
        this.objects.splice(this.objects.indexOf(object), 1);
      if(isCollidingWithPlayer){
        play("jump");
        color("blue");
        particle(object.pos, 5, .5,40);
      }
      object.pos.x -= speed;
      object.pos.y = amplitude * cos(object.pos.x / frequency) + yOffset;

      color(this.color);
      char(this.character, object.pos);

      color("black");
    });
  }
}

class School extends Factory {
  constructor(character, color) {
    super(character, color, null);
  }

  spawn(vec) {
    if (this.objects.length > G.MAX_SCHOOL_LENGTH) return;
    /**
     * @type  { GameObject }
     */
    const object = {
      pos: vec,
      velocity: G.PARTICLE_VELOCITY_MIN,
      acceleration: 0,
    };
    this.objects.push(object);
  }

  move() {
    const angleIncrement = (2 * Math.PI) / school.objects.length; // Angle between squids
    let currentAngle = 0;

    this.objects.forEach((squid) => {
      const isColidingWithBarrels = char(this.character, squid.pos).isColliding
        .char.c;

      if (isColidingWithBarrels) {
        lives--;
        play("explosion");
        color("red");
        particle(player.pos, 10, 2);
        school.objects.splice(squids.objects.indexOf(squid), 1);
      }
      const offset = 2.1715 * Math.log(100 * school.objects.length);

      const offsetX = offset * Math.cos(currentAngle);
      const offsetY = offset * Math.sin(currentAngle);

      // Set the squid's position to be around the player
      squid.pos = vec(player.pos.x + offsetX, player.pos.y + offsetY);

      // Update the angle for the next squid
      currentAngle += angleIncrement;

      // Draw the squid
      color("blue");
      char("b", squid.pos);
    });
  }
}

/**
 * @type  { GameObject }
 */
let player;

let school = new School("b", "blue");

let squids = new Squid("b", "green", G.SPAWN_SQUID_RATE);

let barrels = new Barrels("c", "red", G.SPAWN_BARRELS_RATE);

let water = new Water("d", "blue", G.SPAWN_WATER_RATE);

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  theme:"crt",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2003,
};

let timer = 1000;
function update() {
  if (!ticks) {
    player = {
      pos: vec(G.INIT_POS_X, G.INIT_POS_Y),
      velocity: 0.8,
      acceleration: 0,
    };
    lives = 1;

    school = new School("b", "blue");
    squids = new Squid("b", "green", G.SPAWN_SQUID_RATE);
    barrels = new Barrels("c", "red", G.SPAWN_BARRELS_RATE);
    water = new Water("d", "blue", G.SPAWN_WATER_RATE);

    times(G.WIDTH, (index) => {
      /**
       * @type  { GameObject }
       */
      const object = {
        pos: vec( index * 10),
        velocity: G.PARTICLE_VELOCITY_MIN,
        acceleration: 0,
      };
      water.objects.push(object);
    });

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

  squids.spawn(vec(300, rnd(35, 80))); // Outputs: Spawn method in Squid class
  squids.move();

  barrels.spawn(vec(320, rnd(30, 50))); 
  barrels.move(speed, amplitude, frequency, yOffset); 

  water.spawn(vec(320, 30)); // Outputs: Spawn method in Barrels class
  water.move(speed, amplitude, frequency, yOffset); // Outputs: Move method in Barrels class

  handleCollision();

  school.move(); // Outputs: Move method in Factory class
}

function handleCollision() {
  const isColidingWithSquids = char("a", player.pos).isColliding.char.b;

  if (isColidingWithSquids) {
    play("powerUp");
    addScore(1);
    text("+1", player.pos.x + 3, player.pos.y)
    arc(player.pos, 6, 1);
    school.spawn(player.pos);
    if(school.objects.length <= G.MAX_SCHOOL_LENGTH)
      lives++;
  }

  const isColidingWithBarrels = char("a", player.pos).isColliding.char.c;
  if (isColidingWithBarrels) {
    lives--;
    play("explosion");
    color("red");
    particle(player.pos, 10, 2);
    if (school.objects.length) school.objects.shift();
  }
}
