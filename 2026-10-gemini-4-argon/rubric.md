# Visual rubric and judge prompt

Each judge received this prompt with an image of 8 frames (one image for the SVG), labelled only with an anonymous code:

```text
You are a strict, fair judge of short code-generated animations. The attached image shows 8 frames of one animation, sampled at the times written on each frame (a single still image for drawings). Task given to the author: see rubric. <RUBRIC> Judge only what you can see in the frames. Reply with only one JSON object: {"score": <integer 0-10>, "notes": "<one short sentence>"}
```

## Rocket

Rocket launch animation, score out of 10: countdown 3-2-1 clearly visible (1); engine ignition with flames and smoke (2); liftoff, accelerating climb, rocket leaves the top of the frame (2); scene resets and loops (1); night sky, stars and composition at 960x540 (1); overall visual quality: lighting, detail, polish (3).

## Lighthouse

Stormy lighthouse animation, score out of 10: the lighthouse beam visibly sweeps across the scene (2); continuous rain (1); waves crashing against rocks with spray (2); lightning flash lighting the sky (2); composition at 960x540 (1); overall visual quality (2).

## Hexagon

Bouncing balls in a spinning hexagon, score out of 10: a large hexagon is visible and visibly rotating between frames (2); 12 numbered balls (1); gravity: balls fall and pile up or bounce at the bottom (2); no ball ever outside the hexagon (2); balls do not overlap each other (1); overall quality (2).

## Octopus

SVG drawing of an octopus riding a bicycle, score out of 10: the octopus is recognisable, with a head, eyes and tentacles (3); the bicycle is correct, with two wheels, a frame, handlebars and pedals (3); the octopus is plausibly riding it, sitting on the saddle with tentacles on handlebars or pedals (2); overall drawing quality and charm (2).
