import WindowTemplate from './WindowTemplate';
import Slider from '../Slider';

import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import grinning from '../../../assets/content/grinning.png';
import xd from '../../../assets/content/xd.png';
import webglLogo from '../../../assets/content/projects/web/threejs/webgl-logo.png';
import threejsLogo from '../../../assets/content/projects/web/threejs/threejs-logo.png';
import blenderLogo from '../../../assets/content/projects/web/threejs/blender.jpg';
import globalView from '../../../assets/content/projects/web/threejs/global-view.png';
import characterSelect from '../../../assets/content/projects/web/threejs/character-select.png';
import blenderModel from '../../../assets/content/projects/web/threejs/blender-model.png';

class Portfolio extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'portfolio');

        this.githubLink = 'https://github.com/thatsLegit/threejs-portfolio';
        this.webGLLink = 'https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API';
        this.threejsLink = 'https://threejs.org';
        this.blenderLink = 'https://www.blender.org';
        this.webpackLink = 'https://webpack.js.org';
        this.simonDevYoutubeChannel = 'https://github.com/simondevyoutube';
        this.discoverThreejs = 'https://discoverthreejs.com/tips-and-tricks';
        this.threejsFundamentals = 'https://threejs.org/manual/';
        this.box3 = 'https://threejs.org/docs/#api/en/math/Box3';
        this.collisionDetection =
            'https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection';

        this.slideIds = [`${this.id}-slide-1`];
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} img {
                vertical-align: middle;
            }
            #${this.id} .slideshow-container img {
                width: 100%;
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

            <p class="projects-title">Three.js portfolio RPG style game</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.webGLLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${webglLogo}
                            alt="webgl" width="250" height="100"
                        >
                    </a>
                    <a href=${this.threejsLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${threejsLogo}
                            alt="three-js" width="200" height="100"
                        >
                    </a>
                    <a href=${this.blenderLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${blenderLogo}
                            alt="blender" width="200" height="100"
                        >
                    </a>
                </div>

                <div class="project-presentation">
                    In december 2020, I decided to make a portfolio project for several reasons:<br>
                    <ul>
                        <li>A cv is too short and doesn't tell much about the skills</li>
                        <li>As a web developer, I felt like I should probably do a website for fun to present all my work done as a student</li>
                        <li>You can do whatever you want in it</li>
                        <li style="text-decoration: line-through;">I had too much free time</p></li>
                    </ul>
                </div>

                <!-- slideshow -->
                <div id="${this.slideIds[0]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">Free camera view of the virtual floating island</div>
                        <img src=${globalView}>
                    </div>
                    <div class="fade">
                        <div class="caption">Character selection screen</div>
                        <img src=${characterSelect}>
                    </div>
                    <div class="fade">
                        <div class="caption">The flying ship model in Blender</div>
                        <img src=${blenderModel}>
                    </div>
                </div>

                <div class="project-explanation">
                    <p style="text-decoration: underline;">Why 3d ?</p><br>
                    I always had this childish dream to be able to create an open virtual world in which I could create my own rules and code whatever I wanted.
                    Also, younger I was a big fan of MMO/MMORPG games so it's probably also explaining a lot <img src=${xd} alt="xd">.<br>
                    Then, as Javascript is the language I feel the most comfortable with, I decided to give a try to Three.js.<br><br>
                    As I was a complete newbie to 3d, it was a sort of half-step out of my comfort zone.<br><br>
                    
                    <p style="text-decoration: underline;">Design/art</p><br>
                    Most of the art come from OpenGameArt, Mixamo or SketchFab. TurboSquid and Blender Swap are also nice are exchange platforms<br>
                    I used Blender to tune/reshape the models that I found on the internet to make them exploitable in Three.js.<br><br>

                    <p style="text-decoration: underline;">Development</p><br>
                    I started by browsing the Internet to find some interesting models to make the world I had in mind.<br><br>

                    One of my first decision to make was wether it should be a <b>3rd or 1st person view</b> (does the user see its character or not ?).
                    I decided to go for a 3rd person as I thought it would be more interesting to impersonate a character but it's purely a personal choice.<br>
                    Then I defined the movement and animations of the character. I found very helpful the videos and repos of <a href=${this.simonDevYoutubeChannel}>this retired game developer</a>.<br><br>

                    After that I had to "make" the environment by placing, rotating, scaling, all the models.<br>
                    There comes the second biggest challenge and probably the hardest one for me to solve in this project was <b>collision detection</b> with the environement.
                    Especially what happens when the character goes beyond the edge of the island ? <br> 
                    Well you can try and you will certainly fall and die. <br>
                    However this wasn't that obvious to code as I had to map each part of the island with planes and triangles and check the intersection of these elements with the hitbox of the character, 
                    which I defined with using <a href=${this.box3}>THREE.Box3</a> by the way.<br>
                    It internally uses an <a href=${this.collisionDetection}>AABB</a> algo to check wether an object is "touching" another object in 3d or 2d.<br><br>
                    Finally I worked on the treasure chest with its animations and the cube that let's you read those lines.<br><br> 

                    <p style="text-decoration: underline;">Production</p><br>
                    First I tried to optimize the 3d scene as much as possible by lowering texture's quality, limiting shadows, the camera frustrum, etc... <a href=$${this.discoverThreejs}>This tutorial was very useful</a>.<br>
                    To produce a production build of the app I used <a href=${this.webpackLink}>Webpack5</a>. In my configuration it bundles all the JS and minifies the CSS/HTML for better performances.<br>
                    As it's a static web page, it doesn't use any database so <b>Github Pages</b> appeared to be an easy hosting solution for this app.<br><br>

                    <p style="text-decoration: underline;">Challenges</p><br>
                    Almost every part of this project was extremely challenging as I had a very short amount of time to learn Three.js 
                    (<a href=${this.threejsFundamentals}>which I almost entirely did thanks to this amazing tutorial</a>), get in touch with 3d, Blender, animations in which I had almost zero knowledge…<br>
                    I'm glad though that I was doing well in math classes in earlier courses because 3d happens to be full of trigonometry <img src=${grinning} alt="grinning">.<br>
                    But I learnt so much from it and understood the very basics of how 3d games are made.<br><br>

                    I haven't been able to keep up with all the challenges as this app is absolutely not a fit for small devices such as mobile phones.
                    I focused only on laptop/desktop devices so responsiveness and performance related issues will probably be encountered.
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

export default Portfolio;
