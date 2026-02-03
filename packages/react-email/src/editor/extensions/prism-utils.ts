const publicURL = '/styles/prism';

export function loadPrismTheme(theme: string) {
  // Create new link element for the new theme
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${publicURL}/prism-${theme}.css`;
  link.setAttribute('data-prism-theme', ''); // Mark this link as the Prism theme

  // Append the new link element to the head
  document.head.appendChild(link);
}

export function removePrismTheme() {
  const existingTheme = document.querySelectorAll(
    'link[rel="stylesheet"][data-prism-theme]',
  );
  if (existingTheme.length > 0) {
    existingTheme.forEach((cssLinkTag) => {
      cssLinkTag.remove();
    });
  }
}

export function hasPrismThemeLoaded(theme: string) {
  const existingTheme = document.querySelector(
    `link[rel="stylesheet"][data-prism-theme][href="${publicURL}/prism-${theme}.css"]`,
  );
  return !!existingTheme;
}
