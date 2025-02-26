import WindowTemplate from './WindowTemplate';
import Slider from '../Slider';

import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import reactLogo from '../../../assets/content/projects/react.png';
import nodejs from '../../../assets/content/projects/nodejs.svg';
import sequelize from '../../../assets/content/projects/sequelize.png';
import screen2 from '../../../assets/content/projects/mobile/oporctunite/screen2.jpg';
import screen3 from '../../../assets/content/projects/mobile/oporctunite/screen3.jpg';
import screen1 from '../../../assets/content/projects/mobile/oporctunite/screen1.jpg';
import screen4 from '../../../assets/content/projects/mobile/oporctunite/screen4.jpg';
import drawings from '../../../assets/content/projects/mobile/oporctunite/drawings.png';
import architecture from '../../../assets/content/projects/mobile/oporctunite/architecture.jpeg';
import apiDocumentation from '../../../assets/content/projects/mobile/oporctunite/api-documentation.png';

class OporctuniteMobile extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'oporctunite-mobile');

        this.githubLink = 'https://github.com/thatsLegit/oporctunite-react-native';
        this.rnLink = 'https://reactnative.dev';
        this.nodeLink = 'https://nodejs.org';
        this.sequelizeLink = 'https://github.com/sequelize/sequelize';
        this.webSocketsLink = 'https://www.npmjs.com/package/ws';

        this.slideIds = [`${this.id}-slide-1`, `${this.id}-slide-2`];
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} img {
                vertical-align: middle;
            }
            #${this.id} .slideshow-container img {
                width:100%;
                max-height: 400px;
            }
        `;
    }

    htmlTemplate() {
        return `
            <img class="back-button" src=${back} alt="back">

            <div class="project-links-container">
                <a
                    class="github-link"
                    href=${this.githubLink}
                    target="_blank" rel="noopener noreferrer"
                >
                    <img src=${github} alt="github">
                </a>
            </div>

            <p class="projects-title">Oporctunite mobile react native app</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.rnLink} target="_blank" rel="noopener noreferrer">
                    <img 
                        src=${reactLogo}
                        alt="react" width="200" height="150"
                    >
                    </a>
                    <a href=${this.nodeLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${nodejs}
                            alt="nodejs" width="200" height="150"
                        >
                    </a>
                    <a href=${this.sequelizeLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${sequelize}
                            alt="sequelize" width="250" height="100"
                        >
                    </a>
                </div>

                <!-- slideshow 1-->
                <p class="project-presentation">
                    4 months internship following the <b>Disrupt'Campus project</b>. This time, I had to do a mobile app to allow breeders make evaluations on their cattle.
                    <br><br>
                    A prototype was delivered at the end of the internship but we didn't have the time to prepare the app for publication to the store (Apple Store and Google Play).
                </p>
                <div id="${this.slideIds[0]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Drawer navigation</div>
                        <img src=${screen2}>
                    </div>
                    <div class="fade">
                        <div class="caption">Evaluation screen</div>
                        <img src=${screen4}>
                    </div>
                    <div class="fade">
                        <div class="caption">Results vizualisation</div>
                        <img src=${screen3}>
                    </div>
                    <div class="fade">
                        <div class="caption">Advice sheets</div>
                        <img src=${screen1}>
                    </div>
                </div>
                <div class="project-explanation">
                    <p style="text-decoration: underline;">Development choices</p><br>
                    <i>Why did we need a mobile app ?</i> <br><br>
                    A mobile device/tablet is the most practical for a breeder that would need to visit his farm to realize evaluations on his cattle.<br><br>
                    Then what do we choose between a <b>PWA</b>, a fully responsive web site or a native mobile app ?<br><br>
                    At the time this project was done <b>Progressive web apps</b> lacked support and documentation to propose this project to the veterinary school.<br>
                    An app delivered on browser wouldn't have an offline mode which is very useful in farms where internet connection might sometimes be very poor.<br><br>
                    Then a native mobile app seemed like the natural solution.<br><br>
                    
                    <i>Why React native ?</i> <br><br>
                    As the PO wanted a mobile app that could be ran on <b>IOS</b> and <b>Android</b> in limited time and limited assets (2 interns basically),
                    the only viable solution appeared to be <b>React Native</b>.<br>
                    We had <b>Flutter</b> in mind also but we didn't really had time to learn the <b>Dart</b> language
                    and I already had experience in React so again React Native seemed to be the most logical solution.<br><br>
        
                    <p style="text-decoration: underline;">Organization</p><br>
                    During this project we adopted a <b>SCRUM</b> organization (Agile), and we were assisted by a <b>SCRUM master</b> (our internship superviser as well).
                </div>

                <!-- slideshow 2-->
                <div id="${this.slideIds[1]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Very low fi prototype of the app made in the early developments</div>
                        <img src=${drawings}>
                    </div>
                    <div class="fade">
                        <div class="caption">Back end simplified architecture</div>
                        <img src=${architecture}>
                    </div>
                    <div class="fade">
                        <div class="caption">DocGen api documentation</div>
                        <img src=${apiDocumentation}>
                    </div>
                </div>
                <div class="project-explanation">
                    All of these features were only possible with a solid back end <b>API</b> that we tested with <b>Postman</b>.<br>
                    For that, we used <b>NodeJs</b> coupled with <b>Mongoose ORM</b> to handle the <b>MongoDB</b> Database requests.
                    The API is <b>RESTful</b> and securized as we implemented the <b>OAuth2</b> protocol.
                    Actually it was a mix between RESTful and <b>WebSockets</b> API because we used web sockets to push notifications, mesages, help-requests instantly to concerned users.
                    We used <a href=${this.webSocketsLink}>ws</a>, a super light-weight and fast js library for web sockets connection.<br><br>
                    Along with this API, we also had a face recognition web service in <b>Flask</b> (Python) and on-board code for <b>raspberry pis</b>.<br>
                    Although, the Node API was the central node (no pun intended) between our <b>IoT devices</b>, the face reco web service and the web app.
                </div>

                <div class="project-explanation">
                    The app was served by a <b>NodeJs API</b> with <b>Sequelize ORM</b> to facilitate the queries on the SQL database.
                    The endpoints were tested using Postman.<br>
                    We had to handle the hosting of the API, which we did with a <b>Nginx</b> server and <b>PM2</b> as a process manager.
                </div>
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

        this.slideIds.forEach((slideId) => {
            const slider = new Slider(slideId);
            slider.generateDots();
        });
    }
}

export default OporctuniteMobile;
