import WindowTemplate from './WindowTemplate';
import github from '../../../assets/content/github.png';
import linkedin from '../../../assets/content/linkedin.png';
import email from '../../../assets/content/email.png';
import alarm from '../../../assets/content/alarm.png';
import happy from '../../../assets/content/happy.png';
import phone from '../../../assets/content/phone.png';

class HireMe extends WindowTemplate {
    constructor(window) {
        super(window, null, 'hireMe');
        this.github = 'https://github.com/thatsLegit';
        this.linkedin = 'https://linkedin.com/in/stepanov-ilya';
        this.email = 'iliastepanov1996@gmail.com';
        this.phone = 'tel:+33660704671';
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} .text {
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                font-size: 1rem;
                padding: 0px 20px;
            }
            #${this.id} .social-links {
                cursor: pointer;
                box-shadow: 2px 2px 3px;
                border-radius: 5px;
                margin: 0px 10px;
                font: bold 11px Arial;
                text-decoration: none;
                background-color: rgba(255, 255, 255, 0);
                color: #333333;
                padding: 2px 6px 2px 6px;
                border-top: 1px solid #cccccc;
                border-right: 1px solid #333333;
                border-bottom: 1px solid #333333;
                border-left: 1px solid #cccccc;
            }
            #hire-me-presentation {
                height: 55vh;
            }
        `;
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <div
                id="hire-me-presentation"
                class="template-inner-container flex-column justify-space-around align-center"
            >
                <div class="text">
                    <img src=${alarm} alt="alarm" />
                    <b>Currently looking for a new working experience !</b>
                </div>
                <div class="template-inner-container flex-row justify-space-center align-center">
                <button class="social-links" type="button">
                    <a
                        href=${this.github}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src=${github} alt="github" />
                    </a>
                </button>
                <button class="social-links" type="button">
                    <a
                        href=${this.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src=${linkedin} alt="linkedin" />
                    </a>
                </button>
                <button class="social-links" type="button">
                    <a
                        href="mailto:${this.email}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src=${email} alt="email" />
                    </a>
                </button>
                <button class="social-links" type="button">
                    <a
                        href="tel:${this.phone}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src=${phone} alt="phone" />
                    </a>
                </button>
            </div>
                <div class="text">
                    I am in active search of a <b>fulltime contract</b> or <b>freelance mission</b> in Paris or abroad.
                    I am willing to start working from <b>March</b>, wether it's fully remote, hybrid or on-site in Paris.
                    <br /><br />
                    Hopefully, you can find all infos you are looking for on this website. However
                    don't hesitate to contact me by mail, phone or linkedin.
                    <img src=${happy} alt="happy" />.<br /><br />
                    Native Russian and French speaker, fluent in English.
                </div>
            </div>
        `;
    }
}

export default HireMe;
