'use strict';

const path = require('path');

const _ = require('lodash');
const {
  Clock,
  Font,
  Keyboard,
  RenderWindow,
  Sprite,
  Text,
  Texture,
  VideoMode,
  CircleShape,
} = require('sfml.js');

const window = new RenderWindow(new VideoMode(1920, 1080), 'Doodle Game!');
window.setFramerateLimit(60);

const clock = new Clock();
const circle = new CircleShape(18);
circle.setFillColor(255, 0, 0);
circle.setPosition(10,10)
let x = 100;
let y = 100;
const h = 200;
let dy = 0;

function loop() {
    if(!window.isOpen()) return;

    clock.restart();
    window.clear();

    window.draw(circle);

    window.display();

    setImmediate(loop);
}
loop();