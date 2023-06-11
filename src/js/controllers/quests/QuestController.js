import commonEmitter from '../../helpers/miscellaneous/commonEmitter';

const TREASURE_QUEST_CHECKMARK = document
    .querySelector('#treasure-quest > div')
    .querySelector('div')
    .querySelector('svg');
const MYSTERY_BOX_QUEST_CHECKMARK = document
    .querySelector('#mystery-box-quest > div')
    .querySelector('div')
    .querySelector('svg');
const TREASURE_BOX_QUEST_CHECKMARK = document
    .querySelector('#treasure-box-quest > div')
    .querySelector('div')
    .querySelector('svg');
const PRO_QUEST_CHECKMARK = document
    .querySelector('#pro-quest > div')
    .querySelector('div')
    .querySelector('svg');

const ALERT = document.querySelector('#alert');
ALERT.style.display = 'none';
const ALERT_TEXT = document.querySelector('#alert .alert-text');

export const FIND_TREASURE = 'find treasure';
export const OPEN_CUBE = 'open cube';
export const FIRST_FACE = 'first face';
export const DISCOVER_ALL_FACES = 'discover all faces';

// Holds event listeners for each quest, waiting to be emitted when completed

class QuestController {
    constructor() {
        this._quests = {};
        this._init();
        this._initEvents();
    }

    _init() {
        this._addQuest({
            name: FIND_TREASURE,
            text: 'Find the treasure chest',
            elem: TREASURE_QUEST_CHECKMARK,
            effect() {
                ALERT.style.display = 'block';
                ALERT_TEXT.textContent = 'Press Spacebar to use the cube.';
                setTimeout(cleanup.bind(this), 5000);

                function cleanup() {
                    ALERT.style.display = 'none';
                    this._complete(FIND_TREASURE);
                }
            },
        });
        this._addQuest({
            name: OPEN_CUBE,
            text: 'Open the mystery box',
            elem: MYSTERY_BOX_QUEST_CHECKMARK,
            effect() {
                ALERT.style.display = 'block';
                ALERT_TEXT.textContent = 'Double click on the faces of the cube to display';
                setTimeout(cleanup.bind(this), 5000);

                function cleanup() {
                    ALERT.style.display = 'none';
                    this._complete(OPEN_CUBE);
                }
            },
        });
        this._addQuest({
            name: FIRST_FACE,
            text: 'Browse at least one face of the cube',
            elem: TREASURE_BOX_QUEST_CHECKMARK,
            effect() {
                this._complete(FIRST_FACE);
            },
        });
        this._addQuest({
            name: DISCOVER_ALL_FACES,
            text: 'Discover all faces of the cube',
            elem: PRO_QUEST_CHECKMARK,
            effect() {
                this._complete(DISCOVER_ALL_FACES);
            },
        });
    }

    _initEvents() {
        commonEmitter.on(FIND_TREASURE, this._quests[FIND_TREASURE].effect);
        commonEmitter.on(OPEN_CUBE, this._quests[OPEN_CUBE].effect);
        commonEmitter.on(FIRST_FACE, this._quests[FIRST_FACE].effect);
        commonEmitter.on(DISCOVER_ALL_FACES, this._quests[DISCOVER_ALL_FACES].effect);
    }

    _addQuest(quest) {
        quest.effect = quest.effect.bind(this);
        this._quests[quest.name] = quest;
    }

    _complete(questName) {
        this._quests[questName].elem.style.display = 'block';
    }
}

export default QuestController;
