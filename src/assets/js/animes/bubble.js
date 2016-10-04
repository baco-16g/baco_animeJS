/**---------------------------------
* package import
---------------------------------**/
import anime from 'animejs';

/**---------------------------------
* setting
---------------------------------**/
const container = document.querySelector('.l-container');
const colorSet = ['#ec000b', '#00a1d7'];
const MAX_BALL_COUNT = 64;

/**---------------------------------
* create element
---------------------------------**/
const ballBox = document.createElement('div');
ballBox.className = 'p-ball';
container.appendChild(ballBox);

for (let i = 0; i < MAX_BALL_COUNT; i++) {
	const ball = document.createElement('div');
	ball.className = `p-ball__item p-ball__item--${i}`;
	ball.style.backgroundColor = colorSet[0];
	ballBox.appendChild(ball);
}

/**---------------------------------
* setting element
---------------------------------**/

/**---------------------------------
* setting animate
---------------------------------**/

anime({
	targets: '.p-ball__item',
	borderRadius: {
		value: '24rem',
		delay: (element, index) => 100 * index,
		duration: 5000,
		easing: 'easeInQuart',
	},
	scale: {
		value: 0,
		delay: (element, index) => 100 * index,
		duration: 7000,
		easing: 'easeInOutExpo',
	},
	translateY: {
		value: (element, index) => anime.random(-300, -100),
		delay: (element, index) => 100 * index,
		duration: 7000,
		easing: 'easeInOutExpo',
	},
	direction: 'normal',
	loop: true,
});
