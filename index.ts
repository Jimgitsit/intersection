/**
 * Traffic intersection simulation exercise submission.
 *
 * @author Jim McGowen <jim.mcgowen462@gmail.com>
 */

import { inspect } from 'util';
import * as readline from 'readline';

const YELLOW_TIME_SECONDS = 5;
const LEFT_TURN_SECONDS = 10;

/**
 * State of the intersection
 */
enum State {
  NSStraight = 'NSStraight',
  NSLeft = 'NSLeft',
  EWStraight = 'EWStraight',
  EWLeft = 'EWLeft'
}

/*
 * Traffic light condition
 */
enum Light {
  Red = 'red',
  Green = 'green',
  Yellow = 'yellow',
  Orange = 'orange'
}

/*
 * Lane of traffic
 */
enum Lane {
  Left = 'l',
  Straight1 = 's1',
  Straight2 = 's2',
  Right = 'r'
}

/**
 * Represents the state of a single direction of traffic at an intersection.
 * (a 4-way intersection has 4 directions)
 */
class Direction {
  mainLight: Light;
  leftLight: Light;
  // For future multi-car support
  // this.lanes = {
  //   left: {carCount: 0},
  //   straight1: {carCount: 0},
  //   straight2: {carCount: 0},
  //   right: {carCount: 0}
  // }
  
  constructor() {
    // Default is red lights and no cars
    this.mainLight = Light.Red;
    this.leftLight = Light.Red;
  }
}

/**
 * Represents a 4-way intersection with traffic lights.
 *
 * The four possible states of the intersection are represented in the State enum.
 */
class Intersection {
  state: State;
  directions = {
    N: new Direction(),
    S: new Direction(),
    E: new Direction(),
    W: new Direction()
  }
  
  constructor() {
    // Default state is North-South straight with flashing orange left turn lights
    this.state = State.NSStraight;
    
    this.directions.N.mainLight = Light.Green;
    this.directions.N.leftLight = Light.Orange;
    
    this.directions.S.mainLight = Light.Green;
    this.directions.S.leftLight = Light.Orange;
  }
  
  carArrived(direction: string, lane: Lane, callback: () => void) {
    direction = direction.toUpperCase();
    
    if (!['N', 'S', 'E', 'W'].includes(direction)) {
      console.error('Invalid direction. Valid directions are N, S, E, W.');
      return;
    }
    
    if (!Object.values(Lane).includes(lane)) {
      console.error('Invalid lane. Valid lanes are l, s1, s2, r.');
      return;
    }
    
    // Change the state of the intersection based on this arrival event
    if ((direction === 'N' || direction === 'S') && this.state === State.EWStraight) {
      // Right turns never change the state of the intersection
      if (lane !== Lane.Right) {
        // Set yellow lights for North-South
        this.directions.E.mainLight = Light.Yellow;
        this.directions.W.mainLight = Light.Yellow;
        this.directions.E.leftLight = Light.Yellow;
        this.directions.W.leftLight = Light.Yellow;
        
        console.log('Temporary state of intersection: ', inspect(this, {depth: null, colors: true}));
        
        // Wait then change N-S to red and E-W to green
        setTimeout(() => {
          this.directions.E.mainLight = Light.Red;
          this.directions.W.mainLight = Light.Red;
          this.directions.E.leftLight = Light.Red;
          this.directions.W.leftLight = Light.Red;
          
          if (lane === Lane.Straight1 || lane === Lane.Straight2) {
            this.directions.N.mainLight = Light.Green;
            this.directions.S.mainLight = Light.Green;
            this.directions.N.leftLight = Light.Orange;
            this.directions.S.leftLight = Light.Orange;
            
            this.state = State.NSStraight;
            
            callback();
          } else { // Left lane
            this.directions.N.leftLight = Light.Green;
            this.directions.S.leftLight = Light.Green;
            
            this.state = State.NSLeft;
            
            console.log('Temporary state of intersection: ', inspect(this, {depth: null, colors: true}));
            
            setTimeout(() => {
              this.directions.N.mainLight = Light.Green;
              this.directions.S.mainLight = Light.Green;
              this.directions.N.leftLight = Light.Orange;
              this.directions.S.leftLight = Light.Orange;
              
              this.state = State.NSStraight;
              
              callback();
            }, LEFT_TURN_SECONDS * 1000);
          }
        }, YELLOW_TIME_SECONDS * 1000);
      } else {
        callback();
      }
    } else if ((direction === 'E' || direction === 'W') && this.state === State.NSStraight) {
      // Right turns never change the state of the intersection
      if (lane !== Lane.Right) {
        // Set yellow lights for North-South
        this.directions.N.mainLight = Light.Yellow;
        this.directions.S.mainLight = Light.Yellow;
        this.directions.N.leftLight = Light.Yellow;
        this.directions.S.leftLight = Light.Yellow;
        
        console.log('Temporary state of intersection: ', inspect(this, {depth: null, colors: true}));
        
        // Wait then change N-S to red and E-W to green
        setTimeout(() => {
          this.directions.N.mainLight = Light.Red;
          this.directions.S.mainLight = Light.Red;
          this.directions.N.leftLight = Light.Red;
          this.directions.S.leftLight = Light.Red;
          
          if (lane === Lane.Straight1 || lane === Lane.Straight2) {
            this.directions.E.mainLight = Light.Green;
            this.directions.W.mainLight = Light.Green;
            this.directions.E.leftLight = Light.Orange;
            this.directions.W.leftLight = Light.Orange;
            
            this.state = State.EWStraight;
            
            callback();
          } else { // Left lane
            this.directions.E.leftLight = Light.Green;
            this.directions.W.leftLight = Light.Green;
            
            this.state = State.EWLeft;
            
            console.log('Temporary state of intersection: ', inspect(this, {depth: null, colors: true}));
            
            setTimeout(() => {
              this.directions.E.leftLight = Light.Yellow;
              this.directions.W.leftLight = Light.Yellow;
              
              console.log('Temporary state of intersection: ', inspect(this, {depth: null, colors: true}));
              
              setTimeout(() => {
                this.directions.E.mainLight = Light.Green;
                this.directions.W.mainLight = Light.Green;
                this.directions.E.leftLight = Light.Orange;
                this.directions.W.leftLight = Light.Orange;
                
                this.state = State.EWStraight;
                
                callback();
              }, YELLOW_TIME_SECONDS * 1000);
            }, LEFT_TURN_SECONDS * 1000);
          }
        }, YELLOW_TIME_SECONDS * 1000);
      }
    } else {
      callback();
    }
  }
}

const intersection = new Intersection();
console.log('Initial state of intersection: ', inspect(intersection, {depth: null, colors: true}));

const getInput = () => {
  const inputInterface = readline.createInterface({input: process.stdin, output: process.stdout});
  inputInterface.question('Enter car arrival (from direction,lane): ', input => {
    input = input.trim();
    const [direction, lane] = input.split(':');
    
    console.log(`Car arrived from the ${direction.toUpperCase()} direction in the ${lane} lane.`);
    
    intersection.carArrived(direction, <Lane>lane, () => {
      inputInterface.close();
      console.log('New state of intersection: ', inspect(intersection, {depth: null, colors: true}));
      getInput();
    });
  });
}

getInput();
