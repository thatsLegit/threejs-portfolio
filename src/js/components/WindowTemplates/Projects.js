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

import noImage from '../../../assets/content/projects/ai/no-image.jpeg';

class Projects extends WindowTemplate {
    constructor(window) {
        super(window, 'projects');

        this.sections = [
            {
                id: 'web',
                title: 'Web development',
                slideshows: [
                    {
                        id: `${this.id}-slide-2`,
                        images: [cwLanding, home, rooms],
                        linksTo: './projects/co-workers.html',
                        tooltipText: 'Co-workers: web and IoT',
                    },
                    {
                        id: `${this.id}-slide-3`,
                        images: [porcLanding, graphs, search, fiches],
                        linksTo: './projects/oporctunite.html',
                        tooltipText: "Oporctunite: disrupt'Campus collaborative project",
                    },
                    {
                        id: `${this.id}-slide-4`,
                        images: [characterSelect, globalView],
                        linksTo: './projects/portfolio.html',
                        tooltipText: 'Portfolio project with Three.js',
                    },
                ],
            },
            {
                id: 'mobile',
                title: 'Mobile Development',
                slideshows: [
                    {
                        id: `${this.id}-slide-5`,
                        images: [screen2, screen4, screen3, screen1],
                        linksTo: './projects/react-native.html',
                        tooltipText: 'React native mobile app',
                    },
                ],
            },
            {
                id: 'ai',
                title: 'AI',
                slideshows: [
                    {
                        id: `${this.id}-slide-6`,
                        images: [noImage],
                        linksTo: './projects/periodontal-diagnosis.html',
                        tooltipText: 'Machine Learning collaborative project',
                    },
                    {
                        id: `${this.id}-slide-7`,
                        images: [noImage],
                        linksTo: './projects/twitter-scrapping.html',
                        tooltipText: 'Twitter scrapping',
                    },
                ],
            },
        ];

        // Currently displayed index+1 of each slideshow
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

        if (slideIndex > elemLength) this.slides[slideId] = 0; // Wfhen next the last elem go back to first elem
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
                margin: 15px auto;
            }
            #${this.id} section {
                width: 25%
            }
            #${this.id} .heading {
                padding: 1em 1em 3em 1em; 
                font-weight: bold;
            }
            #${this.id} #web img {
                width: 200px;
                height: 150px;
            }
            #${this.id} .title {
                text-align: center;
                position: relative;
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
                <div onclick="window.location.href = ${slideshow.linksTo}">
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
        }
    }
}

export default Projects;
