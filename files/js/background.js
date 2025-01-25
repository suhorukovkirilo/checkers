const dropsCount = 50;
const rainContainer = document.querySelector('.rain');

for (let i = 1; i <= dropsCount; i++) {
  const drop = document.createElement('div');
  drop.className = 'drops';

  const xa = Math.random(); // Random position (0 to 1)
  const ya = Math.random(); // Random position (0 to 1)
  const rainDelay = (Math.random() * 2.5) + 1; // Random delay (1 to 3.5 seconds)
  const rainStretch = (Math.random() * 0.5) + 1.0; // Random stretch factor (1 to 1.5)
  const rainWidth = Math.random() * 10 + 5; // Random width (5px to 15px)
  const rainHeight = rainWidth * rainStretch;

  drop.style.left = `${xa * 100}vw`;
  drop.style.top = `$0vh`;
  drop.style.width = `${rainWidth}px`;
  drop.style.height = `${rainHeight}px`;
  drop.style.backgroundPosition = `${xa * 100}% ${ya * 100}%`;
  drop.style.animation = `${rainDelay}s rainingAnim 3s ease-in infinite`;

  rainContainer.appendChild(drop);
}
