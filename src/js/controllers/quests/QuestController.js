const treasureQuest = document
    .querySelector('#treasure-quest > div')
    .querySelector('div')
    .querySelector('svg');
const mysteryBoxQuest = document
    .querySelector('#mystery-box-quest > div')
    .querySelector('div')
    .querySelector('svg');
const treasureBoxQuest = document
    .querySelector('#treasure-box-quest > div')
    .querySelector('div')
    .querySelector('svg');
const proQuest = document
    .querySelector('#pro-quest > div')
    .querySelector('div')
    .querySelector('svg');

const alert = document.querySelector('#alert');
alert.style.display = 'none';
const alertText = document.querySelector('#alert-text');

class QuestController {
    constructor(params) {
        this._params = params; //env, character
        this._quests = {};
        this._alertOpacity = 0;
        this._Init();
    }
    _Init() {
        this._AddQuest({
            name: 'treasure-quest',
            text: 'Find the treasure chest',
            elem: treasureQuest,
            condition() {
                return (
                    this._params.environment._treasure.position.distanceToSquared(
                        this._params.character.Position
                    ) < 3000
                );
            },
            effect(t, questName) {
                alertText.style.color =
                    'rgba(255,255,255,' + 0.5 * (1 + Math.cos(this._alertOpacity));
                if (this._alertOpacity == 0) {
                    alert.style.display = 'block';
                    alertText.textContent = 'Press Spacebar to use the cube.';
                    setTimeout(cleanup.bind(this), 7000);
                }
                function cleanup() {
                    alert.style.display = 'none';
                    this._alertOpacity = 0;
                    this._Complete.call(this, questName);
                }
                this._alertOpacity = t / 400; //frame-rate independant
            },
        });
        this._AddQuest({
            name: 'mystery-box-quest',
            text: 'Open the mystery box',
            elem: mysteryBoxQuest,
            condition() {
                return this._params.magicCube?._opened;
            },
            effect(t, questName) {
                alertText.style.color =
                    'rgba(255,255,255,' + 0.5 * (1 + Math.cos(this._alertOpacity));
                if (this._alertOpacity == 0) {
                    alert.style.display = 'block';
                    alertText.textContent = 'Double click on the faces of the cube to display';
                    setTimeout(cleanup.bind(this), 7000);
                }
                function cleanup() {
                    alert.style.display = 'none';
                    this._Complete.call(this, questName);
                }
                this._alertOpacity = t / 400; //frame-rate independant
            },
        });
        this._AddQuest({
            name: 'treasure-box-quest',
            text: 'Browse at least one face of the cube',
            elem: treasureBoxQuest,
            condition() {
                return this._params.magicCube?._visited?.size;
            },
            effect(t, questName) {
                this._Complete.call(this, questName);
            },
        });
        this._AddQuest({
            name: 'pro-quest',
            text: 'Discover all faces of the cube',
            elem: proQuest,
            condition() {
                return this._params.magicCube?._visited?.size == 6;
            },
            effect(t, questName) {
                this._Complete.call(this, questName);
            },
        });
    }

    _AddQuest(quest) {
        this._quests = { ...this._quests, [quest.name]: quest };
    }

    _Complete(questName) {
        this._quests[questName].elem.style.display = 'block';
        delete this._quests[questName];
    }

    _Update(t) {
        for (const questName in this._quests) {
            if (this._quests[questName].condition.call(this)) {
                this._quests[questName].effect.call(this, t, questName);
            }
        }
    }
}

export default QuestController;
