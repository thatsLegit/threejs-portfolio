import WindowTemplate from './WindowTemplate';

import cwLanding from '../../../assets/content/projects/web/co-workers/landing.png';
import home from '../../../assets/content/projects/web/co-workers/home.png';
import rooms from '../../../assets/content/projects/web/co-workers/rooms.png';
import porcLanding from '../../../assets/content/projects/web/oporctunite/landing-page.png';
import graphs from '../../../assets/content/projects/web/oporctunite/graphs.png';
import search from '../../../assets/content/projects/web/oporctunite/search.png';
import fiches from '../../../assets/content/projects/web/oporctunite/fiches.png';

import characterSelect from '../../../assets/content/projects/web/threejs/character-select.png';
import globalView from '../../../assets/content/projects/web/threejs/global-view.png';

import screen1 from '../../../assets/content/projects/mobile/screen1.jpg';
import screen2 from '../../../assets/content/projects/mobile/screen2.jpg';
import screen3 from '../../../assets/content/projects/mobile/screen3.jpg';
import screen4 from '../../../assets/content/projects/mobile/screen4.jpg';

import twitterLogo from '../../../assets/content/projects/ai/twitter-logo.svg';
import noImage from '../../../assets/content/projects/ai/no-image.jpeg';

/* 
section
    title
    slideshow-container
        image1
        image2
        image3
        ...
        prev + next buttons
*/

class Projects extends WindowTemplate {
    constructor(window) {
        super(window, null, 'projects');

        // sections gather multiple projects within a common category
        // one slide represents one project
        // meaning that every image of the slide opens the same template
        this.sections = [
            {
                id: 'web',
                title: 'Web development',
                slideshows: [
                    {
                        id: `${this.id}-slide-1`,
                        images: [cwLanding, home, rooms],
                        linksTo: 'co-workers',
                        tooltipText: 'Co-workers: web and IoT',
                    },
                    {
                        id: `${this.id}-slide-2`,
                        images: [porcLanding, graphs, search, fiches],
                        linksTo: 'oporctunite',
                        tooltipText: "Oporctunite: disrupt'Campus collaborative project",
                    },
                    {
                        id: `${this.id}-slide-3`,
                        images: [characterSelect, globalView],
                        linksTo: 'portfolio',
                        tooltipText: 'Portfolio project with Three.js',
                    },
                ],
            },
            {
                id: 'mobile',
                title: 'Mobile Development',
                slideshows: [
                    {
                        id: `${this.id}-slide-4`,
                        images: [screen2, screen4, screen3, screen1],
                        linksTo: 'oporctunite-mobile',
                        tooltipText: 'React native mobile app',
                    },
                ],
            },
            {
                id: 'ai',
                title: 'AI',
                slideshows: [
                    {
                        id: `${this.id}-slide-5`,
                        images: [noImage],
                        linksTo: 'periodontal-diagnosis',
                        tooltipText: 'Machine Learning collaborative project',
                    },
                    {
                        id: `${this.id}-slide-6`,
                        images: [twitterLogo],
                        linksTo: 'twitter-scrapping',
                        tooltipText: 'Twitter scrapping',
                    },
                ],
            },
        ];

        // Currently displayed image of each slideshow
        this.slides = {
            [`${this.id}-slide-1`]: 0,
            [`${this.id}-slide-2`]: 0,
            [`${this.id}-slide-3`]: 0,
            [`${this.id}-slide-4`]: 0,
            [`${this.id}-slide-5`]: 0,
            [`${this.id}-slide-6`]: 0,
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

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} p {
                font-family: 'Courier New', Courier, monospace;
                font-size: large;
            }
            #${this.id} img {
                cursor: pointer;
            }
            #${this.id} section {
                width: 33%
            }
            #${this.id} .heading {
                padding: 1em 1em 3em 1em; 
                font-weight: bold;
            }
            #${this.id} .title {
                text-align: center;
                position: relative;
            }
            /* Next & previous buttons */
            #${this.id} .slideshow-container .prev,
            #${this.id} .slideshow-container .next {
                cursor: pointer;
                position: absolute;
                top: 40%;
                width: auto;
                padding: 12px;
                color: white;
                font-weight: bold;
                font-size: 12px;
                transition: 0.6s ease;
                border-radius: 0 3px 3px 0;
                user-select: none;
            }
        `;
    }

    sectionsTemplate() {
        return this.sections
            .map((section) => {
                return `
                    <section id=${section.id}>
                        <p class="title">${section.title}</p>
                        ${this.slideShowsTemplate(section.slideshows)}
                    </section>
                `;
            })
            .join('');
    }

    slideShowsTemplate(slideshows) {
        return slideshows
            .map((slideshow) => {
                return `
                    <div id=${slideshow.id} class="slideshow-container">
                        ${this.slideShowImagesTemplate(slideshow)}
                    </div>
                `;
            })
            .join('');
    }

    slideShowImagesTemplate(slideshow) {
        return slideshow.images
            .map((image) => {
                return `
                    <div onclick="
                            document.querySelector('#${this.id}').style.display = 'none'; 
                            document.querySelector('#${slideshow.linksTo}').style.display = 'block'
                        "
                    >
                        <div class="tooltip">
                            <img src=${image} />
                            <span class="tooltiptext">${slideshow.tooltipText}</span>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <p class="heading">
                Here are some of my projects ! You can click on the images to know more
                about the project.
            </p>
            <br>
            <div class="flex-row justify-space-around">
                ${this.sectionsTemplate()}
            </div>
        `;
    }

    generate() {
        super.generate();

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
        }
    }
}

export default Projects;
