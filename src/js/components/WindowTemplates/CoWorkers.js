import WindowTemplate from './WindowTemplate';
import Slider from '../Slider';

import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import reactLogo from '../../../assets/content/projects/react.png';
import nodejs from '../../../assets/content/projects/nodejs.svg';
import mongoose from '../../../assets/content/projects/mongoose.png';
import landing from '../../../assets/content/projects/web/co-workers/landing.png';
import home from '../../../assets/content/projects/web/co-workers/home.png';
import rooms from '../../../assets/content/projects/web/co-workers/rooms.png';
import video from '../../../assets/content/projects/web/co-workers/video.mp4';
import architecture from '../../../assets/content/projects/web/co-workers/architecture.png';
import postman from '../../../assets/content/projects/web/co-workers/cw-postman.png';
import facerec from '../../../assets/content/projects/web/co-workers/cw-facerec.png';
import rfid from '../../../assets/content/projects/web/co-workers/cw-rfid.png';

class CoWorkers extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'co-workers');

        this.githubLink = 'https://github.com/go-roots';
        this.reactLink = 'https://reactjs.org';
        this.nodeLink = 'https://nodejs.org';
        this.mongooseLink = 'https://mongoosejs.com';

        this.slideIds = [`${this.id}-slide-1`, `${this.id}-slide-2`, `${this.id}-slide-3`];
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

            <p class="projects-title">Co-workers: Web and IoT project (masters project)</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.reactLink} target="_blank" rel="noopener noreferrer">
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
                    <a href=${this.mongooseLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${mongoose}
                            alt="mongoose" width="200" height="100"
                        >
                    </a>
                </div>

                <!-- slideshow 1-->
                <p class="project-presentation">
                    Co-Workers is the result of three weeks of collaborative work.<br>
                    We were asked to improve co-working spaces and our decision was to focus on social networking in order to encourage interactions between users.<br><br>
                    The App includes a help-from-peers system, events, profiles and the possibility to redeem point you gained by being social.
                </p>
                <div id="${this.slideIds[0]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Presentation video clip</div>
                        <video controls>
                            <source src=${video} type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="fade">
                        <div class="caption">Landing page</div>
                        <img src=${landing}>
                    </div>
                    <div class="fade">
                        <div class="caption">Home page</div>
                        <img src=${home}>
                    </div>
                    <div class="fade">
                        <div class="caption">Rooms browsing</div>
                        <img src=${rooms}>
                    </div>
                </div>
                <div class="project-explanation">
                    <p style="text-decoration: underline;">Work done</p><br>
                    We started by developping the html/css theme with <b>Bootstrap Studio</b> which I found to be very nice if you like using <b>Bootstrap</b> for your projects.<br>
                    It's indeed a sort of <b>WYSIWYG</b> software focus on the <b>Bootstrap CSS framework</b> and it really allowed us to have something to deliver very quickly.<br><br>
                    Then we just had to transform the theme into react components and create a <b>Redux</b> store for app level state management.<br><br>

                    <p style="text-decoration: underline;">Features</p><br>
                    One of the main feature of the app is the <a href="#${this.id}-slide-1">interactive, real-time, responsive map</a> which displays position of present users inside the co-working space.<br>
                    This map was an essential feature of our app and it provided data about each user in the co-working space: their activity, the room they are in, their mood, etc…<br><br>
                    We also developed a very complete <a href="#${this.id}-slide-1">filtering system</a> for viewing only specific types of users. A user could for instance see only the available lawyers or computer scientists in their friend list ! 
                    To encourage interactions between co-workers we also had a "help request" button that would immediately send a notif to all concerned users.<br><br>
                    Users have <a href="#${this.id}-slide-1">recommendations</a> based on their profile and the rooms busyness.<br><br>
                    By helping others a user can receive points to redeem and also have their skills recommended on LinkedIn.
                </div>
        
                <!-- slideshow 2-->
                <div id="${this.slideIds[1]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Architecture</div>
                        <img src=${architecture}>
                    </div>
                    <div class="fade">
                        <div class="caption">DocGen api documentation</div>
                        <img src=${postman}>
                    </div>
                </div>
                <div class="project-explanation">
                    All of these features were only possible with a solid back end <b>API</b> that we tested with <b>Postman</b>.<br>
                    For that, we used <b>NodeJs</b> coupled with <b>Mongoose ORM</b> to handle the <b>MongoDB</b> Database requests.
                    The API is <b>RESTful</b> and securized as we implemented the <b>OAuth2</b> protocol. 
                    Actually it was a mix between RESTful and <b>WebSockets</b> API because we used web sockets to push notifications, mesages, help-requests instantly to concerned users.
                    We used <a href="https://www.npmjs.com/package/ws">ws</a>, a super light-weight and fast js library for web sockets connection.<br><br>
                    Along with this API, we also had a face recognition web service in <b>Flask</b> (Python) and on-board code for <b>raspberry pis</b>.<br>
                    Although, the Node API was the central node (no pun intended) between our <b>IoT devices</b>, the face reco web service and the web app.
                </div>

                <!-- slideshow 3-->
                <div id="${this.slideIds[2]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Our implementation of face recognition</div>
                        <img src=${facerec}>
                    </div>
                    <div class="fade">
                        <div class="caption">rfid payments with raspberry pi</div>
                        <img src=${rfid}>
                    </div>
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

export default CoWorkers;
