import WindowTemplate from './WindowTemplate';
import alarm from '../../../assets/content/alarm.png';

class MiniGames extends WindowTemplate {
    constructor(window) {
        super(window, null, 'miniGames');
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} .text {
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                font-size: 1rem;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            #${this.id} .content {
                width: 600px;
            }
        `;
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <div class="content">
                <div class="text">
                    <img src=${alarm} alt="alarm" />
                    <b>Ongoing development</b>
                </div>
            </div>
        `;
    }
}

export default MiniGames;
