import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import reactLogo from '../../../assets/content/projects/react.png';
import jest from '../../../assets/content/projects/jest.png';
import ror from '../../../assets/content/projects/web/talent/rails.png';
import talent from '../../../assets/content/projects/web/talent/talent.png';

class Talent extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'talent');

        this.reactLink = 'https://reactjs.org';
        this.jestLink = 'https://jestjs.io/';
        this.rorLink = 'https://rubyonrails.org/';
        this.talentLink = 'https://www.talent.io';
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} .icons {
                margin: 25px 0 50px 0;
            }
        `;
    }

    htmlTemplate() {
        return `
            <img class="back-button" src=${back} alt="back">

            <div class="project-links-container">
                <a
                    style="text-decoration: none"
                    href=${this.talentLink}
                    target="_blank" rel="noopener noreferrer"
                >
                    <img src=${talent} width="200" height="100" alt="talent">
                </a>
            </div>

            <p class="projects-title">Talent.io software engineer</p>

            <div class="projects-container">
                <div class="template-inner-container icons">
                    <a href=${this.rorLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${ror}
                            alt="Ruby On Rails" width="100" height="100"
                        >
                    </a>
                    <a href=${this.reactLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${reactLogo}
                            alt="react" width="150" height="100"
                        >
                    </a>
                    <a href=${this.jestLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${jest}
                            alt="numpy" width="125" height="100"
                        >
                    </a>
                </div>

                <div class="project-explanation">
                    I worked at Talent.io for 6 months.<br><br>
                    During these months I had the opportunity to get to know all the composing business units of this company
                    and seize the specificities of the world of tech recruitement. This sector is evolving fast and competition is fierce.
                    This demands a high degree of agility and adaptability from the tech and product teams.<br><br>

                    <p style="text-decoration: underline;">My contribution</p>
                    I worked mainly on 2 different innovation-headed projects: the new subscription funnel (code name: Cheetah 🐆)
                    and the revamping of the recruiter side experience (code name: Kairos).<br><br>

                    The Cheetah project was born from the observation that the candidate subscription on the platform takes
                    too much time and discourages some of them. I joined the project in the middle of its completion.
                    Some of the user stories that I was involved in were:
                    <ul>
                        <li>Registration form development</li>
                        <li>Making the "additional informations funnel" fully responsive</li>
                        <li>Deployment of new features to production</li>
                        <li>Fixing minor bugs</li>
                    </ul>

                    The Cheetah project is currently on production and you have probably used it
                    if you ever subscribed as a candidate on talent.io 😜.<br><br>

                    The Kairos project was a more heavy project that last for more than a year (probably too much).<br>
                    The goal was to a) allow the candidates to be able to see and apply to recruiter's offers, which
                    was a very welcomed feature as candidates were complaining that they don't have much to do apart
                    from waiting for recruiters to apply to them. b) The other part of the project was focused on the
                    recruiter side and consisted in making the experience more user-friendly.<br><br>

                    Apart from these 2 projects I was in charge of bug mastering for a week.<br><br>

                    Also I did work on legacy parts of the app written in Ruby:
                    <ul>
                        <li>freelance invoice pdf generation</li>
                        <li>
                        Better user experience and error handling in timesheet submission for freelance workers
                        that have a contract with a recruiter
                        </li>
                        <li>Fixing minor bugs</li>
                    </ul>
                </p>
            </div>
        `;
    }

    generate() {
        super.generate(false);

        const backButton = document.querySelector(`#${this.id} .back-button`);
        backButton.addEventListener('click', () => {
            this.disable();
            this.parent.enable();
        });
    }
}

export default Talent;
