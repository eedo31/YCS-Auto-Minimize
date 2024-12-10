// ==UserScript==
// @name         YCS Auto Minimize
// @namespace    http://tampermonkey.net/
// @version      2.27
// @description  Minimizes the YCS menu to save screen real estate; auto-toggle between min/maximized states based on preference.
// @author       eedo31
// @match        https://www.youtube.com/watch?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @license      MIT
// ==/UserScript==

// v2.27 - Refactor for better performance, removed unnecessary transitions, added accessibility improvements.

// Add required styles for the YCS menu minimization
GM_addStyle(`
  #ycs_minimize_bar {
    cursor: pointer;
    padding: 5px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    background-color: transparent;
    border-radius: 8px;
    margin: 5px 0;
    width: 100%;
  }

  #ycs_minimize_bar:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  #ycs_minimize_text {
    color: #333;
  }

  #ycs_minimize_bar[aria-expanded="true"] #ycs_minimize_text {
    color: #000;
  }

  .ycs-app-main {
    transition: none;
  }
`);

// Utility function to store the state of the menu in localStorage
const storeState = (state) => localStorage.setItem('ycs_minimized', state);

// Utility function to get the state of the menu from localStorage
const getState = () => localStorage.getItem('ycs_minimized');

// Function to handle the state of the YCS menu
const handleMenuState = (ycsApp, state) => {
  const ycsMain = ycsApp.querySelector('.ycs-app-main');
  const bar = document.getElementById('ycs_minimize_bar');
  const text = document.getElementById('ycs_minimize_text');

  if (state === 'minimized') {
    ycsMain.style.display = 'none';
    bar.setAttribute('aria-expanded', 'false');
    text.textContent = 'Maximize YCS';
  } else {
    ycsMain.style.display = 'block';
    bar.setAttribute('aria-expanded', 'true');
    text.textContent = 'Minimize YCS';
  }
};

// Function to initialize the YCS minimization
const initMinimizer = () => {
  const ycsApp = document.querySelector('.ycs-app');

  if (!ycsApp) {
    setTimeout(initMinimizer, 1000);
    return;
  }

  const savedState = getState() || 'minimized';
  const bar = document.createElement('div');
  bar.id = 'ycs_minimize_bar';
  bar.setAttribute('aria-expanded', savedState === 'maximized' ? 'true' : 'false');
  
  const text = document.createElement('span');
  text.id = 'ycs_minimize_text';
  text.textContent = savedState === 'maximized' ? 'Minimize YCS' : 'Maximize YCS';

  bar.appendChild(text);
  ycsApp.insertBefore(bar, ycsApp.firstChild);

  handleMenuState(ycsApp, savedState);

  bar.addEventListener('click', () => {
    const newState = savedState === 'maximized' ? 'minimized' : 'maximized';
    storeState(newState);
    handleMenuState(ycsApp, newState);
  });
};

// Initialize the script once the page is loaded
initMinimizer();
