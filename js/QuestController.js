const treasureQuest = document.querySelector("#treasure-quest > div").querySelector("div").querySelector("svg");
const mysteryBoxQuest = document.querySelector("#mystery-box-quest > div").querySelector("div").querySelector("svg");
const treasureBoxQuest = document.querySelector("#treasure-box-quest > div").querySelector("div").querySelector("svg");
const proQuest = document.querySelector("#pro-quest > div").querySelector("div").querySelector("svg");

const caption = document.querySelector('#caption');
caption.style.display = 'none';
const captionText = document.querySelector('#caption-text');


class QuestController {
    constructor(params){
        this._params = params; //env, character
        this._quests = {};
        this._captionOpacity = 0;
        this._Init();
    }
    _Init() {
        this._AddQuest({
            name: 'treasure-quest', 
            text: 'Find the treasure chest',
            elem: treasureQuest,
            condition() {
                return this._params.environment._treasure.position.distanceToSquared(this._params.character.Position) < 3000;
            },
            effect(t, questName) {
                captionText.style.color = 'rgba(255,255,255,' + Math.cos(this._captionOpacity);
                if(this._captionOpacity == 0) {
                    caption.style.display = 'block';
                    captionText.textContent = 'Press Spacebar to use the cube.';
                    setTimeout(cleanup.bind(this), 6000);
                }
                function cleanup() {
                    caption.style.display = 'none';
                    this._Complete.call(this, questName);
                }
                this._captionOpacity = t / 400; //frame-rate independant
            }
        });
        this._AddQuest({
            name: 'mystery-box-quest', 
            text: 'Open the mystery box',
            elem: mysteryBoxQuest,
            condition() {
                return this._params.magicCube?._opened;
            },
            effect(t, questName) {
                this._Complete.call(this, questName);
            }
        });
        this._AddQuest({
            name: 'treasure-box-quest', 
            text: 'Browse at least one face of the cube',
            elem: treasureBoxQuest,
            condition() {return 1===0},
            effect() {}
        });
        this._AddQuest({
            name: 'pro-quest', 
            text: 'Discover all faces of the cube',
            elem: proQuest,
            condition() {return 1===0},
            effect() {}
        });
    }

    _AddQuest(quest) {
        this._quests = {...this._quests, [quest.name]: quest};
    }

    _Complete(questName) {
        this._quests[questName].elem.style.display = 'block';
        delete this._quests[questName];
    }

    _Update(t) {
        for (const questName in this._quests) {
           if(this._quests[questName].condition.call(this)) {
                this._quests[questName].effect.call(this, t, questName);
           }
        }
    }
}

export default QuestController;