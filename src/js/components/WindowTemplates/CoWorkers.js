import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import reactLogo from '../../../assets/content/projects/mobile/react-logo.png';
import nodejs from '../../../assets/content/projects/mobile/nodejs.png';
import mongoose from '../../../assets/content/projects/web/co-workers/mongoose.png';
import landing from '../../../assets/content/projects/web/co-workers/landing.png';
import home from '../../../assets/content/projects/web/co-workers/home.png';
import rooms from '../../../assets/content/projects/web/co-workers/rooms.png';
import video from '../../../assets/content/projects/web/co-workers/video.mp4';
import architecture from '../../../assets/content/projects/web/co-workers/architecture.png';
import postman from '../../../assets/content/projects/web/co-workers/cw-postman.png';
import facerec from '../../../assets/content/projects/web/co-workers/cw-facerec.png';
import rfid from '../../../assets/content/projects/web/co-workers/cw-rfid.png';

// structure: project presentation (?), slideshow, dots, project explanation (?)

class CoWorkers extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'co-workers');

        this.githubLink = 'https://github.com/go-roots';

        // Currently displayed image of each slideshow
        this.slides = {
            [`${this.id}-slide-1`]: 0,
            [`${this.id}-slide-2`]: 0,
            [`${this.id}-slide-3`]: 0,
        };
    }

    showSlides(slideIndex, slideId) {
        const slideElements = document.querySelectorAll(`#${slideId} > div`);
        const elemLength = slideElements.length;

        if (slideIndex >= elemLength) this.slides[slideId] = 0; // When next the last elem go back to first elem
        if (slideIndex < 0) this.slides[slideId] = elemLength - 1; // When prev the first elem go back to last elem

        for (let i = 0; i < elemLength; i++) {
            if (i === this.slides[slideId]) slideElements[i].style.display = 'block';
            else slideElements[i].style.display = 'none';
        }
    }

    updateSlides(increment, slideId) {
        this.showSlides((this.slides[slideId] += increment), slideId);
    }

    setSlides(index, slideId) {
        this.showSlides((this.slides[slideId] = index), slideId);
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} {
                display: none;
            }
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

            <div class="github-link-container">
                <a
                    class="github-link"
                    href=${this.githubLink}
                    target="_blank" rel="noopener noreferrer"
                >
                    <img src=${github} alt="github">
                </a>
            </div>

            <p class="projects-title">Co-workers: Web and IoT project (student project)</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                        <img
                            src=${reactLogo}
                            alt="webgl" width="200" height="150"
                        >
                    </a>
                    <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${nodejs}
                            alt="disrupt-campus" width="200" height="150"
                        >
                    </a>
                    <a href="https://mongoosejs.com" target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${mongoose}
                            alt="disrupt-campus" width="200" height="100"
                        >
                    </a>
                </div>

                <!-- slideshow 1-->
                <p class="project-presentation">
                    Co-Workers is the result of three weeks of collaborative work.<br>
                    We were asked to improve co-working spaces and our decision was to focus on social networking in order to encourage interactions between users.<br><br>
                    The App includes a help-from-peers system, events, profiles and the possibility to redeem point you gained by being social.
                </p>
                <div id="${this.id}-slide-1" class="slideshow-container">
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
                <div id="${this.id}-slide-2" class="slideshow-container">
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
                <div id="${this.id}-slide-3" class="slideshow-container">
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

        for (let slideId in this.slides) {
            this.showSlides(0, slideId); // Set initial image in each container
            const slideShow = document.querySelector(`#${slideId}`);

            const prev = document.createElement('a');
            prev.className = 'prev';
            prev.innerHTML = '&#10094';
            prev.addEventListener('click', () => this.updateSlides(-1, slideId));

            const next = document.createElement('a');
            next.className = 'next';
            next.innerHTML = '&#10095';
            next.addEventListener('click', () => this.updateSlides(1, slideId));

            slideShow.insertAdjacentElement('beforeend', prev);
            slideShow.insertAdjacentElement('beforeend', next);

            const dotContainer = document.createElement('div');
            dotContainer.className = 'dot-container';
            slideShow.insertAdjacentElement('afterend', dotContainer);

            const images = document.querySelectorAll(`#${slideId} > div`);

            for (let i = 0; i < images.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot';
                dot.addEventListener('click', () => this.setSlides(i, slideId));
                dotContainer.insertAdjacentElement('beforeend', dot);
            }
        }
    }
}

export default CoWorkers;
