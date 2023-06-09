import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import oporctuniteLogo from '../../../assets/content/projects/web/oporctunite/logo-oporctunite.png';
import envtLogo from '../../../assets/content/projects/web/oporctunite/logo-envt.png';
import disruptCampusLogo from '../../../assets/content/projects/web/oporctunite/logo-disrupt-campus.png';
import landingPage from '../../../assets/content/projects/web/oporctunite/landing-page.png';
import graphs from '../../../assets/content/projects/web/oporctunite/graphs.png';
import fiches from '../../../assets/content/projects/web/oporctunite/fiches.png';
import search from '../../../assets/content/projects/web/oporctunite/search.png';
import adobeMockups from '../../../assets/content/projects/web/oporctunite/adobe-mockups.png';

class CoWorkers extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'oporctunite');

        this.githubLink = 'https://github.com/thatsLegit/oporctunite-web';
        this.envtLink = 'https://oporctunite.envt.fr';
        this.webSiteLink = 'https://oporctunite.envt.fr';
        this.disruptCampusLink = 'https://www.disruptcampus-toulouse.fr';

        this.slide = 0;
        this.slideId = `${this.id}-slide`;
    }

    showSlides(slideIndex) {
        const slideElements = document.querySelectorAll(`#${this.slideId} > div`);
        const elemLength = slideElements.length;

        if (slideIndex >= elemLength) this.slide = 0; // When next the last elem go back to first elem
        if (slideIndex < 0) this.slide = elemLength - 1; // When prev the first elem go back to last elem

        for (let i = 0; i < elemLength; i++) {
            if (i === this.slide) slideElements[i].style.display = 'block';
            else slideElements[i].style.display = 'none';
        }
    }

    updateSlides(increment) {
        this.showSlides((this.slide += increment));
    }

    setSlides(index) {
        this.showSlides((this.slide = index));
    }

    // DONT FORGET TO REMOVE display: none;
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

            <div class="project-links-container">
                <a
                    class="github-link"
                    href=${this.githubLink}
                    target="_blank" rel="noopener noreferrer"
                >
                    <img src=${github} alt="github">
                </a>
                <a href=${this.envtLink} target="_blank" rel="noopener noreferrer">
                    <img
                        src=${oporctuniteLogo}
                        alt="oporctunite"
                        height="64"
                        width="64"
                    >
                </a>
            </div>

            <p class="projects-title">Oporctunite voluntary project (Disrupt'Campus)</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.githubLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${envtLogo}
                            alt="envt" width="250" height="100"
                        >
                    </a>
                    <a href=${this.disruptCampusLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${disruptCampusLogo}
                            alt="disrupt-campus" width="150" height="100"
                        >
                    </a>
                </div>

                <p class="project-presentation">
                    <a href=${this.envtLink} target="_blank" rel="noopener noreferrer">Oporctunite</a>
                    project was the result of the collaboration of Law, Psychology and Computer science students during the 2019-2020 edition of
                    <a href=${this.disruptCampusLink} target="_blank" rel="noopener noreferrer">Disrupt'Campus Toulouse</a>.<br><br>

                    Our team had to work on creating an app as a Proof-of-Concept for a Veterinarian School
                    <a href=${this.envtLink} target="_blank" rel="noopener noreferrer">(ENVT)</a>. <br>
                    The main idea was to allow sow breeders to evaluate their cattle with a series of tests and that would give them an idea of what could be improved as well as how they compete to other breeders.<br>
                    The app was also designed to veterinarians as they can also create accounts, follow farms and check their results to allow a better follow-up.<br><br>

                    Disrupt'Campus Toulouse eventually taught us the concepts of <b>Design Thinking</b> and the <b>Art of Pitching</b> by inviting specialists in that field.
                </p>

                <!-- slideshow -->
                <div id=${this.slideId} class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Landing page</div>
                        <img src=${landingPage}>
                    </div>
                    <div class="fade">
                        <div class="caption">Graphs displaying breeders results to evaluations</div>
                        <img src=${graphs}>
                    </div>
                    <div class="fade">
                        <div class="caption">Advice sheets recommended based on results obtained on evaluations</div>
                        <img src=${fiches}>
                    </div>
                    <div class="fade">
                        <div class="caption">Breeders browsing for veterinarians</div>
                        <img src=${search}>
                    </div>
                    <div class="fade">
                        <div class="caption">High fidelity prototypes designed on AdobeXD</div>
                        <img src=${adobeMockups}>
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

        this.showSlides(0, this.slideId); // Set initial image
        const slideShow = document.querySelector(`#${this.slideId}`);

        const prev = document.createElement('a');
        prev.className = 'prev';
        prev.innerHTML = '&#10094';
        prev.addEventListener('click', () => this.updateSlides(-1));

        const next = document.createElement('a');
        next.className = 'next';
        next.innerHTML = '&#10095';
        next.addEventListener('click', () => this.updateSlides(1));

        slideShow.insertAdjacentElement('beforeend', prev);
        slideShow.insertAdjacentElement('beforeend', next);

        const dotContainer = document.createElement('div');
        dotContainer.className = 'dot-container';
        slideShow.insertAdjacentElement('afterend', dotContainer);

        const images = document.querySelectorAll(`#${this.slideId} > div`);

        for (let i = 0; i < images.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => this.setSlides(i));
            dotContainer.insertAdjacentElement('beforeend', dot);
        }
    }
}

export default CoWorkers;
