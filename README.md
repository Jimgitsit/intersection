This is a traffic intersection simulation.

## Design Thoughts

I decided the best approach would be to model the intersection and then identify all possible states. Then I'll have the state of the intersection change appropriately in the event a car arrives at the intersection.

## Usage

Start with:
```sh
npm run start
```
You will be prompted for a 'car arrival' event. It should be in the form
```shell
Enter car arrival (from direction,lane): <direction>:<lane>
```
where `<direction>` is the direction the car approaches from and is one of `N`, `S`, `E`, or `W` and `<lane>` is the lane is it in; `L` for the left lane, `S1` for the straight 1 lane, `S2` for the straight 2 lane, or `R` for the right lane.


For example:
```shell
Enter car arrival (from direction,lane): W:L
```
Means that a car is arriving from the west and is in the left lane.
Enter car arrival (from direction,lane): w:l

## Implementation Notes

Input is CLI based. Output is in JSON and represents the current state of the intersection. The idea being this will eventually be a REST API that can be consumed by a front-end UI.

Each event will output the current state of the intersection and it's lights. An event might trigger a delayed reaction and multiple states. For example changing lights from green to yellow to red involves two delays and state changes.

The state of the intersection only changes in response to an arriving car. A timer that cycles between the NSStraight and EWStraight states would probably be a good addition.

I did not account for multiple cars arriving at the same time. This would an essential feature for a real-world intersection simulation.

I did not account for pedestrians or walk buttons (spent all my time getting the basic model up and running).

This is "proof of concept" quality code. The code can certainly be optimized and could use some more validation. Automated tests would be good too.
