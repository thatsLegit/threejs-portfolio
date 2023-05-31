// loading all assets to dist when webpacking
// Remember to add an asset extension here everytime you add it to webpack config
// if an asset is not imported in any js file, it won't be shipped to bundle.js
require.context('../assets', true, /\.(glb|gltf|fbx|bmp|png|jpg|jpeg|bin)$/);

import '../index.css';

import CharacterSelection from 'components/CharacterSelectionScene';
import CustomAssetLoader from './helpers/miscellaneous/CustomAssetLoader';
import Game from 'components/Game';

const LOADING_ELEMENT = document.querySelector('#loading');

const SETTINGS = document.querySelector('#settings-container');
const GRAPHICS_FORM = document.querySelector('#graphics');
const KEYBOARD_FORM = document.querySelector('#keyboard');
const SUBMIT_SETTINGS = document.querySelector('#submit-settings');

const FORWARD = document.querySelector('#controls-container #forward');
const BACKWARD = document.querySelector('#controls-container #backward');
const LEFT = document.querySelector('#controls-container #left');
const RIGHT = document.querySelector('#controls-container #right');

const CHARACTER_SELECTION_SUBMIT_BUTTON = document.querySelector(
    '#character-selection > .validate-button'
);

const AZERTY_CONTROLS = ['D', 'Q', 'Z', 'S'];
const QWERTY_CONTROLS = ['D', 'A', 'W', 'S'];
let CHAR_NAME = '';

const assetLoader = new CustomAssetLoader();

LOADING_ELEMENT.style.display = 'flex';

assetLoader
    .loadBgTexture()
    .then(() => assetLoader.loadCubeTexture())
    .then(() => assetLoader.loadEnvModels())
    .then(() => assetLoader.loadCharacterModel())
    // launch character selection scene
    .then(
        () =>
            new Promise((resolve, _) => {
                LOADING_ELEMENT.style.display = 'none';
                const chSelection = new CharacterSelection(assetLoader);
                chSelection.launchScene();

                CHARACTER_SELECTION_SUBMIT_BUTTON.addEventListener('click', () => {
                    if (!chSelection.selection) return window.alert('Please select a character !');
                    CHAR_NAME = chSelection.selection;
                    chSelection.removeScene();
                    LOADING_ELEMENT.style.display = 'flex';
                    resolve();
                });
            })
    )
    .then(() => assetLoader.loadCharacterAnimations(CHAR_NAME))
    // display settings screen
    .then(() => {
        LOADING_ELEMENT.remove();
        SETTINGS.style.display = 'flex';

        SUBMIT_SETTINGS.addEventListener('click', () => {
            let graphics_input = GRAPHICS_FORM.elements;
            let keyboard_input = KEYBOARD_FORM.elements;

            for (let i = 0; i < graphics_input.length; i++) {
                if (graphics_input[i].nodeName == 'INPUT' && graphics_input[i].checked) {
                    graphics_input = graphics_input[i].value;
                    break;
                }
            }
            for (let i = 0; i < keyboard_input.length; i++) {
                if (keyboard_input[i].nodeName == 'INPUT' && keyboard_input[i].checked) {
                    keyboard_input = keyboard_input[i].value;
                    break;
                }
            }

            if (keyboard_input == 'azerty') {
                [RIGHT.innerHTML, LEFT.innerHTML, FORWARD.innerHTML, BACKWARD.innerHTML] =
                    AZERTY_CONTROLS;
            } else {
                [RIGHT.innerHTML, LEFT.innerHTML, FORWARD.innerHTML, BACKWARD.innerHTML] =
                    QWERTY_CONTROLS;
            }

            SETTINGS.remove();

            new Game(assetLoader, CHAR_NAME, graphics_input, keyboard_input).launchScene();
        });
    });
