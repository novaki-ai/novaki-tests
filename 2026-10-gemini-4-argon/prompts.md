# The 10 prompts, word for word

Every prompt started with this line:

> Note: do not create files, run commands or use tools; reply directly.

## Test 1 · Rocket launch

````text
Write a single HTML file containing a looping animation (about 10 seconds per loop) for a 960x540 window: a small rocket on a launch pad at night. A big countdown 3, 2, 1 appears on screen; the engine ignites with flames and billowing smoke; the rocket lifts off, accelerates up through a starry sky and leaves the top of the frame; then the scene resets and the loop starts again. No external libraries, images or fonts: only HTML, CSS and JavaScript. Reply with only one ```html code block.
````

## Test 2 · Lighthouse in a storm

````text
Write a single HTML file containing a seamless looping animation for a 960x540 window: a lighthouse on a rocky cliff during a stormy night. The lighthouse beam sweeps slowly across the scene, rain falls continuously, waves crash against the rocks with spray, and a lightning flash lights up the whole sky every few seconds. No external libraries, images or fonts: only HTML, CSS and JavaScript. Reply with only one ```html code block.
````

## Test 3 · Spinning hexagon

````text
Write a single HTML file for a 960x540 window: 12 numbered balls bounce inside a large hexagon that spins slowly around its centre. Simulate gravity and friction; the balls must bounce realistically off the rotating walls and off each other, and must never leave the hexagon. No external libraries. Reply with only one ```html code block.
````

## Test 4 · Octopus on a bike

````text
Draw an SVG image of an octopus riding a bicycle. Use viewBox="0 0 800 600". Reply with only one ```svg code block.
````

## Test 5 · Snake game

````text
Write a single HTML file with a playable Snake game for a 960x540 window. Requirements: 1) the board is a 20x20 grid drawn on a <canvas>; 2) the game starts when the player presses Space; 3) arrow keys steer, and the snake cannot reverse directly into itself; 4) eating food grows the snake by 1 and adds 10 points; 5) hitting a wall or itself ends the game and shows the text 'Game Over'; 6) pressing Space after game over restarts with score 0; 7) the current score is always visible in an element with id="score"; 8) the snake moves one cell every 150 ms and starts with length 3, moving right. For automated testing, expose window.snake with state() returning {running, gameOver, score, length, head: {x, y}, food: {x, y}, dir} where dir is one of 'up', 'down', 'left', 'right', and setFood(x, y) that places the food on that grid cell. No external libraries. Reply with only one ```html code block.
````

## Test 6 · Duration parser

````text
Write a JavaScript function parseDuration(text) that returns the total number of seconds as a number. It must accept the units d, h, m and s (days, hours, minutes, seconds), with or without spaces between parts ('1h30m', '1h 30m'), decimals ('1.5h' is 5400), uppercase units ('2H'), surrounding whitespace, and a plain number meaning seconds ('90'). Each unit may appear at most once and units must be in descending order (d, h, m, s). For anything else, including empty, negative or invalid input, return null. Reply with only one ```javascript code block containing just the function.
````

## Test 7 · Calculator

````text
Write a JavaScript function evaluate(expr) that evaluates an arithmetic expression string and returns a number. It must support integers and decimals ('3.5', '.5'), the operators + - * /, and ^ for exponentiation. ^ has the highest precedence and is right-associative ('2^3^2' is 512). Unary minus and unary plus are allowed and may repeat ('--3' is 3); unary minus binds more loosely than ^, so '-2^2' is -4, while '2^-1' is 0.5. Parentheses and arbitrary whitespace are allowed. Division by zero returns null. Any invalid input returns null: empty input, unbalanced or empty parentheses, a missing operand, two numbers without an operator, implicit multiplication such as '2(3)', malformed numbers or any other character. Do not use eval, Function or any similar shortcut. Reply with only one ```javascript code block containing just the function.
````

## Test 8 · Logic puzzle

````text
Five developers, Ada, Ben, Cem, Dua and Eli, sit in seats 1 to 5 in a row, numbered left to right. Each uses exactly one tool: Claude, Codex, Gemini, Cursor or Vim (all different).
1. Ada sits next to the Vim user.
2. The Claude user sits immediately to the right of Cem.
3. Dua sits at one end of the row.
4. Ben uses neither Claude nor Codex.
5. The Gemini user sits somewhere to the left of the Cursor user.
6. Eli sits in seat 3.
7. Cem does not use Vim, and the Codex user sits in seat 1.
8. Ben sits immediately to the left of Eli.
9. Dua does not use Gemini.
10. Ada does not use Cursor.

Who uses Vim, and in which seat does the Gemini user sit? End your reply with one line exactly in this format: ANSWER: <name>, <seat number>
````

## Test 9 · Hard logic puzzle

````text
Five developers, Ada, Ben, Cem, Dua and Eli, sit in seats 1 to 5 in a row, numbered left to right. Each one uses a different AI model (Argon, Sol, Astra, Opus, Sonnet), programs in a different language (Python, Rust, Go, Java, Swift) and drinks something different (tea, coffee, cola, water, juice). 'Next to' means in an adjacent seat; 'somewhere between X and Y' means in a seat strictly between their two seats.
1. Ben sits somewhere between Cem and the Sonnet user.
2. The Go programmer sits somewhere between the Rust programmer and Eli.
3. The Astra user sits somewhere between the person who drinks water and the Sol user.
4. The person who drinks tea is not the Python programmer.
5. The Python programmer sits somewhere between Ben and the person who drinks cola.
6. The person who drinks juice sits next to the Opus user.
7. The person who drinks coffee is not the Sol user.
8. The Sol user sits next to the Java programmer.
9. The Opus user is not the person who drinks water.
10. Ada sits next to the Argon user.
11. The Python programmer is not Dua.
12. Dua is not the person who drinks tea.
13. The Sonnet user sits somewhere to the left of the Java programmer.
14. The Python programmer sits somewhere between the Argon user and Eli.
15. The person who drinks juice sits somewhere to the left of Ada.
16. Ada sits next to the Opus user.

Who programs in Rust, and in which seat is the person who drinks cola? There is exactly one solution. End your reply with one line exactly in this format: ANSWER: <name>, <seat number>
````

## Test 10 · Trick questions

````text
Answer these eight questions.
1. How many times does the letter e (upper or lower case) appear in this sentence: "Seventeen elephants never needed seven extra evenings"?
2. What day of the week is 14 March 2031?
3. A train leaves at 22:47 and the journey takes 3 hours 38 minutes. What time does it arrive, in 24-hour HH:MM format?
4. Write the word strawberry backwards, then give only its 3rd, 4th, 5th and 6th letters.
5. What is 2^20 minus 3^12?
6. An analog clock shows exactly 3:15. What is the smaller angle between the hour hand and the minute hand, in degrees?
7. How many prime numbers are there strictly between 100 and 150?
8. How many Sundays are there in February 2032?

Reply with exactly eight lines, '1: <answer>' to '8: <answer>', each containing only the short final answer and nothing else.
````
