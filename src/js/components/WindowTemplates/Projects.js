import WindowTemplate from './WindowTemplate';
import Slider from '../Slider';

import cwLanding from '../../../assets/content/projects/web/co-workers/landing.png';
import home from '../../../assets/content/projects/web/co-workers/home.png';
import rooms from '../../../assets/content/projects/web/co-workers/rooms.png';
import porcLanding from '../../../assets/content/projects/web/oporctunite/landing-page.png';
import graphs from '../../../assets/content/projects/web/oporctunite/graphs.png';
import search from '../../../assets/content/projects/web/oporctunite/search.png';
import fiches from '../../../assets/content/projects/web/oporctunite/fiches.png';
import talent from '../../../assets/content/projects/web/talent/talent.png';

import characterSelect from '../../../assets/content/projects/web/threejs/character-select.png';
import globalView from '../../../assets/content/projects/web/threejs/global-view.png';

import oporctunite1 from '../../../assets/content/projects/mobile/oporctunite/screen1.jpg';
import oporctunite2 from '../../../assets/content/projects/mobile/oporctunite/screen2.jpg';
import oporctunite3 from '../../../assets/content/projects/mobile/oporctunite/screen3.jpg';
import oporctunite4 from '../../../assets/content/projects/mobile/oporctunite/screen4.jpg';

import bespoke1 from '../../../assets/content/projects/mobile/bespoke/screen1.png';
import bespoke2 from '../../../assets/content/projects/mobile/bespoke/screen2.png';
import bespoke3 from '../../../assets/content/projects/mobile/bespoke/screen3.png';
import bespoke4 from '../../../assets/content/projects/mobile/bespoke/screen4.png';
import bespoke5 from '../../../assets/content/projects/mobile/bespoke/screen5.png';

import unlockt1 from '../../../assets/content/projects/mobile/unlockt/home.png';
import unlockt2 from '../../../assets/content/projects/mobile/unlockt/media.png';
import unlockt3 from '../../../assets/content/projects/mobile/unlockt/link.png';
import unlockt4 from '../../../assets/content/projects/mobile/unlockt/wallet.png';

import twitterLogo from '../../../assets/content/projects/ai/twitter-logo.svg';
import noImage from '../../../assets/content/projects/no-image.jpeg';
import chess from '../../../assets/content/projects/ai/chess.png';

class Projects extends WindowTemplate {
    constructor(window) {
        super(window, null, 'projects');

        this.sections = [
            {
                id: 'web',
                title: 'Web development',
            },
            {
                id: 'mobile',
                title: 'Mobile Development',
            },
            {
                id: 'ai',
                title: 'AI',
            },
        ];

        this.projects = [
            {
                sectionId: 'web',
                id: `${this.id}-talent`,
                images: [talent],
                linksTo: 'talent',
                tooltipText: 'Talent.io recruitment platform',
            },
            {
                sectionId: 'web',
                id: `${this.id}-portfolio`,
                images: [characterSelect, globalView],
                linksTo: 'portfolio',
                tooltipText: 'Portfolio project with Three.js',
            },
            {
                sectionId: 'web',
                id: `${this.id}-oporctunite`,
                images: [porcLanding, graphs, search, fiches],
                linksTo: 'oporctunite',
                tooltipText: "Oporctunite: disrupt'Campus collaborative project",
            },
            {
                sectionId: 'web',
                id: `${this.id}-co-workers`,
                images: [cwLanding, home, rooms],
                linksTo: 'co-workers',
                tooltipText: 'Co-workers: web and IoT',
            },
            {
                sectionId: 'mobile',
                id: `${this.id}-unlockt`,
                images: [unlockt1, unlockt2, unlockt3, unlockt4],
                linksTo: 'unlockt',
                tooltipText: 'Unlockt.me: media sharing mobile app',
            },
            {
                sectionId: 'mobile',
                id: `${this.id}-bespoke`,
                images: [bespoke1, bespoke2, bespoke3, bespoke4, bespoke5],
                linksTo: 'bespoke',
                tooltipText: "Dior's Bespoke tablet app",
            },
            {
                sectionId: 'mobile',
                id: `${this.id}-oporctunite-mobile`,
                images: [oporctunite2, oporctunite4, oporctunite3, oporctunite1],
                linksTo: 'oporctunite-mobile',
                tooltipText: 'React native mobile app',
            },
            {
                sectionId: 'ai',
                id: `${this.id}-chess-engine`,
                images: [chess],
                linksTo: 'chess-engine',
                tooltipText: 'Expert Chess Engine',
            },
            {
                sectionId: 'ai',
                id: `${this.id}-periodontal-diagnosis`,
                images: [noImage],
                linksTo: 'periodontal-diagnosis',
                tooltipText: 'Machine Learning collaborative project',
            },
            {
                sectionId: 'ai',
                id: `${this.id}-twitter-scrapping`,
                images: [twitterLogo],
                linksTo: 'twitter-scrapping',
                tooltipText: 'Twitter scrapping',
            },
        ];
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
                padding: 1em; 
                font-weight: bold;
            }
            #${this.id} .projects-title {
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
                color: red;
                font-weight: bold;
                font-size: 12px;
                transition: 0.6s ease;
                border-radius: 0 3px 3px 0;
                user-select: none;
            }
        `;
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <p class="heading">
                Here are some of my projects ! You can click on the images to know more
                about the project.
            </p>
            <div class="flex-row justify-space-around">
                ${this.sectionsTemplate()}
            </div>
        `;
    }

    sectionsTemplate() {
        return this.sections
            .map((section) => {
                const projects = this.projects.filter(
                    (project) => project.sectionId === section.id
                );

                return `
                    <section id=${section.id}>
                        <p class="projects-title">${section.title}</p>
                        ${this.projectsTemplate(projects)}
                    </section>
                `;
            })
            .join('');
    }

    projectsTemplate(projects) {
        return projects
            .map((project) => {
                return `
                    <div id=${project.id} class="slideshow-container">
                        ${this.projectImageTemplate(project)}
                    </div>
                `;
            })
            .join('');
    }

    projectImageTemplate(project) {
        return project.images
            .map((image) => {
                return `
                    <div onclick="
                            document.querySelector('#${this.id}').style.display = 'none'; 
                            document.querySelector('#${project.linksTo}').style.display = 'block'
                        "
                    >
                        <div class="tooltip">
                            <img src=${image} />
                            <span class="tooltiptext">${project.tooltipText}</span>
                        </div>
                    </div>
                `;
            })
            .join('');
    }

    generate() {
        super.generate();

        this.projects.forEach((project) => {
            new Slider(project.id);
        });
    }
}

export default Projects;
