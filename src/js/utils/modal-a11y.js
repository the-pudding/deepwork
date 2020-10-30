/**
 * Improves keyboard accessibility of modal windows
 * Finds unique values in an array of values
 * @param {array} arr - sequence of strings, numbers, booleans
 * @returns {array} array of unique values
 *
 * @example
 * import modalSetup from './utils/modal-a11y';
 */

const hamburgerSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
const xSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function handleOpenClose($modalEl, $toggleEl, hamburger) {
  // see if menu is already opened
  const opened = $modalEl.classed('is-visible');

  // update the aria attribute and the actual class of the nav
  $toggleEl.attr('aria-expanded', !opened);
  $modalEl.classed('is-active', !opened);
  $modalEl.classed('is-visible', !opened);

  // if the hamburger argument is set to true, switch between hamburger & x icon
  if (hamburger === true) {
    if (opened) {
      $toggleEl.html(() => hamburgerSVG);
    } else $toggleEl.html(() => xSVG);
  }
}

export default function setup(
  $openEl,
  $closeEl,
  $containerEl,
  $modalEl,
  focusable,
  hamburger
) {
  // find first and last focusable elements in the modal
  const $focusableInModal = $containerEl.selectAll(focusable).nodes();
  const $firstFocus = $focusableInModal[0];
  const $lastFocus = $focusableInModal[$focusableInModal.length - 1];

  // if you click on the element that triggers the modal to open
  // open (or close) the modal
  $openEl.on('click', () => handleOpenClose($modalEl, $openEl, hamburger));
  $closeEl.on('click', () => handleOpenClose($modalEl, $closeEl, hamburger));

  // listen for escape key press on the modal element
  $containerEl.on('keydown', event => {
    const pressed = event.code;
    const opened = $modalEl.classed('is-visible');
    if (pressed === 'Escape' && opened === true) {
      // close menu
      $openEl.attr('aria-expanded', false);
      // switch focus back to element that opened the modal
      $openEl.node().focus();
      $modalEl.classed('is-active', false);
      $modalEl.classed('is-visible', false);

      if (hamburger === true) {
        $openEl.html(() => hamburgerSVG);
      }
    }
  });

  // if focused on first focusable element when menu is open
  // and moving up, go to last focusable element
  // if on last focusable element and tab is pressed, go back to first
  d3.select($firstFocus).on('keydown', event => {
    const opened = $modalEl.classed('is-visible');
    if (opened) {
      const pressed = event.code;
      const shift = event.shiftKey;

      if (pressed === 'Tab' && shift === true) {
        // prevent default behavior
        event.preventDefault();

        // focus on the last element
        $lastFocus.focus();
      }
    }
  });

  d3.select($lastFocus).on('keydown', event => {
    const opened = $modalEl.classed('is-visible');
    if (opened) {
      const pressed = event.code;
      const shift = event.shiftKey;

      // if tab is pressed on last element, go back to first
      if (pressed === 'Tab' && shift === false) {
        // prevent default behavior
        event.preventDefault();

        // focus on the first element
        $firstFocus.focus();
      }
    }
  });
}
