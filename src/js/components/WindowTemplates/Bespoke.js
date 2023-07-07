import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import reactLogo from '../../../assets/content/projects/react.png';
import graphql from '../../../assets/content/projects/graphql.png';
import apollo from '../../../assets/content/projects/apollo.png';
import jest from '../../../assets/content/projects/jest.png';
import nodejs from '../../../assets/content/projects/nodejs.svg';
import screen1 from '../../../assets/content/projects/mobile/bespoke/screen1.png';
import screen2 from '../../../assets/content/projects/mobile/bespoke/screen2.png';
import screen3 from '../../../assets/content/projects/mobile/bespoke/screen3.png';
import screen4 from '../../../assets/content/projects/mobile/bespoke/screen4.png';
import screen5 from '../../../assets/content/projects/mobile/bespoke/screen5.png';
import screen6 from '../../../assets/content/projects/mobile/bespoke/screen6.png';
import screen7 from '../../../assets/content/projects/mobile/bespoke/screen7.png';
import screen8 from '../../../assets/content/projects/mobile/bespoke/screen8.png';
import screen9 from '../../../assets/content/projects/mobile/bespoke/screen9.png';
import screen10 from '../../../assets/content/projects/mobile/bespoke/screen10.png';
import screen11 from '../../../assets/content/projects/mobile/bespoke/screen11.png';
import screen12 from '../../../assets/content/projects/mobile/bespoke/screen12.png';
import dior from '../../../assets/content/projects/mobile/bespoke/dior.jpg';
import rzf from '../../../assets/content/projects/mobile/bespoke/rzf.jpg';
import video from '../../../assets/content/projects/mobile/bespoke/bespoke_app.mp4';

class Bespoke extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'bespoke');

        this.rnLink = 'https://reactnative.dev';
        this.diorLink = 'https://www.dior.com';
        this.rzfLink = 'https://www.razorfish.fr';
        this.nodeLink = 'https://nodejs.org';
        this.jestLink = 'https://jestjs.io/';
        this.graphqlLink = 'https://graphql.org/';
        this.apolloLink = 'https://www.apollographql.com/';

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

            <p class="projects-title">Bespoke mobile app</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.diorLink} target="_blank" rel="noopener noreferrer">
                    <img
                        src=${dior}
                        alt="Dior" width="200" height="150"
                    >
                    </a>
                    <a href=${this.rzfLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${rzf}
                            alt="Razorfish" width="200" height="150"
                        >
                    </a>
                </div>

                <!-- slideshow 1-->
                <p class="project-presentation">
                    First contractual work experience, at the Razorfish's agency (a Publicis entity), following a 6 months internship on the same project.<br><br>
                    Bespoke was a very enriching experience, both in terms of human interactions/team spirit and technical skills.
                    I was the only junior developer in the team so I had the opportunity to grow a lot among more experienced developers.<br><br>
                    I worked on the project since its very beginning and until its completion, so had the opportunity to assist the technical/architectural
                    discussions and be a leading actor in the development choices.
                </p>

                    <div id="${this.id}-slide-1" class="slideshow-container">
                        <div class="fade">
                            <div class="caption">User story</div>
                            <img src=${screen6}>
                        </div>
                        <div class="fade">
                            <div class="caption">User story</div>
                            <img src=${screen7}>
                        </div>
                        <div class="fade">
                            <div class="caption">User story</div>
                            <img src=${screen8}>
                        </div>
                        <div class="fade">
                            <div class="caption">User story</div>
                            <img src=${screen9}>
                        </div>
                        <div class="fade">
                            <div class="caption">User story</div>
                            <img src=${screen10}>
                        </div>
                    </div>
                    <div class="project-explanation">
                        <p style="text-decoration: underline;">The app</p><br>

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
                                alt="nodejs" width="150" height="150"
                            >
                        </a>
                        <a href=${this.jestLink} target="_blank" rel="noopener noreferrer">
                            <img
                                src=${jest}
                                alt="jest" width="150" height="150"
                            >
                        </a>
                        <a href=${this.graphqlLink} target="_blank" rel="noopener noreferrer">
                            <img
                                src=${graphql}
                                alt="graphql" width="125" height="100"
                            >
                        </a>
                        <a href=${this.apolloLink} target="_blank" rel="noopener noreferrer">
                            <img
                                src=${apollo}
                                alt="apollo" width="125" height="100"
                            >
                        </a>
                    </div>

                    The proposed solution consisted in developing a react native app destined for tablets primarily.<br><br>
                    However, one of my most important contributions was to make to whole app's design code applicable to any device size.<br>
                    The client was satisfied to have the app available on any kind of device even though it was not a
                    requirement.<br>
                    I participated in the development of almost every part of the app and for some of them, my participation was exclusive, for instance, the sur mesure form (see in the slideshow below).
                </div>

                <!-- slideshow 2-->
                <div id="${this.id}-slide-2" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">The login screen</div>
                        <img src=${screen1}>
                    </div>
                    <div class="fade">
                        <div class="caption">The menu</div>
                        <img src=${screen2}>
                    </div>
                    <div class="fade">
                        <div class="caption">The 3d player</div>
                        <img src=${screen3}>
                    </div>
                    <div class="fade">
                        <div class="caption">The sur mesure form</div>
                        <img src=${screen4}>
                    </div>
                    <div class="fade">
                        <div class="caption">The sur mesure form</div>
                        <img src=${screen5}>
                    </div>
                </div>

                <div class="project-explanation">
                    Another challenging aspect of the project was on the back end side, especially in integrating our services with all the different parts of the Dior's existing legacy apps and services.<br><br>
                    One specific part on which I worked a lot was the "send to Dior Star" functionality.<br>
                    Dior Star was the app for making online orders in the stores.<br>
                    My goal was to make it possible to send a specific product configuration (via the 3d player or sur mesure form) to the order-making application.<br>
                    This implied the creation of a Multi Factor Auth (MFA) service (see slideshow below).
                </div>

                <!-- slideshow 3-->
                <div id="${this.id}-slide-3" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">The Back End for Front End</div>
                        <img src=${screen11}>
                    </div>
                    <div class="fade">
                        <div class="caption">Environments</div>
                        <img src=${screen12}>
                    </div>
                </div>

                <div class="project-explanation">
                    Below you can enjoy a demo video of the final app (at least at the moment I left the project) !
                    
                    <video width="720" height="500" controls style="margin: 50px auto">
                        <source src=${video} type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
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

export default Bespoke;
