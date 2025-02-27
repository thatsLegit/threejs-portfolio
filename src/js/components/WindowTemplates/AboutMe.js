import WindowTemplate from './WindowTemplate';
import profile from '../../../assets/content/profile.jpg';
import games from '../../../assets/content/games.png';
import reading from '../../../assets/content/reading.png';
import workout from '../../../assets/content/workout.png';
import wordcloud from '../../../assets/content/wordcloud.png';
import development from '../../../assets/content/development.png';
import computer from '../../../assets/content/computer.png';
import happy from '../../../assets/content/happy.png';

class AboutMe extends WindowTemplate {
    constructor(window) {
        super(window, null, 'aboutMe');
    }

    cssTemplate() {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap');

            ${super.cssTemplate()}

            #${this.id} .photo {
                margin: 0px;
                width: 160px;
                height: 160px;
                background: white url(${profile}) no-repeat;
                background-size: cover;
                border-radius: 50%;
            }
            #map {
                width: 200px;
                height: 150px;
                margin: 2em 0;
            }
            #${this.id} .hobbies {
                width: 100%;
                border-radius: 2px;
                padding: 5px 0px;
                box-shadow: 1px 1px 3px;
            }
            #${this.id} .hobbies img {
                width: 100px;
                height: 100px;
            }
            #${this.id} .hobbies p {
                font-size: large;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
            }

            #about-me-presentation {
                width: 80%;
                margin-top: 1rem;
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                font-size: 1rem;
            }
            #${this.id} .wordcloud {
                display: block;
                height: 250px;
                margin: 1rem;
            }

            #about-me-timeline {
                padding: 10px;
            }
            #${this.id} .timeline-item {
                margin: 0px 5px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                width: 140px;
                height: 150px;
                box-shadow: 2px 2px 5px;
                border: solid 1px black;
                border-radius: 5px;
                background-color: rgba(255, 255, 255, 0.78);
            }
            #${this.id} .timeline-text {
                padding: 5px;
                font-weight: bold;
                font-size: 1em;
                margin-bottom: 5px;
            }
            #${this.id} .timeline-image {
                padding-bottom: 10px;
            }
        `;
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <div
                class="template-inner-container flex-row justify-space-around align-space-around"
            >
                <div class="flex-column align-center" style="flex: 1">
                    <div class="photo"></div>
                    <div id="map"></div>
                    <div class="hobbies">
                        <div class="flex-column align-center">
                            <img src=${games} alt="games" />
                            <figcaption>Video Games</figcaption>
                            <img src=${reading} alt="reading" />
                            <figcaption>Reading</figcaption>
                            <img src=${workout} alt="workout" />
                            <figcaption>Workout</figcaption>
                        </div>
                    </div>
                </div>

                <div class="flex-column align-center" style="flex: 2">
                    <div id="about-me-presentation">
                        Hey!<br /><br />
                        My name is Ilja (pronounce Ilya) and as you may have guessed, I am a software developer 
                        <img src=${happy} alt="happy" />. <br /><br />
                        For the past 4 years of my professional experience, I focused mainly on the font end development
                        using React, React Native and Swift UI. <br /><br />
                        Even though all my experiences where full stack, the back end languages where not my primary focus.
                        So, I am currently looking for new challenges and opportunities in the software development field
                        as a Typescript full stack developer. <br /><br />
                        In my free time, I like exploring new technologies and reading materials about software design 
                        and architecture. <br /><br />
                    </div>

                    <img class="wordcloud" src=${wordcloud} />
                </div>
            </div>

            <div
                id="about-me-timeline"
                class="template-inner-container flex-row justify-start align-start"
            >
                <div class="timeline-item">
                    <p class="timeline-text">Master in computer science (<i>2019 - now</i>)</p>
                    <img class="timeline-image" src=${development} alt="development" />
                </div>
                <div class="timeline-item">
                    <p class="timeline-text">Bachelor (3rd y.) in computer science (<i>2018</i>)</p>
                    <img class="timeline-image" src=${computer} alt="computer" />
                </div>
            </div>
        `;
    }

    generate() {
        super.generate();

        L.mapquest.key = 'Rjr7pyBKSmiRPzexekrtYsIl2n4oTffI';

        const map = L.mapquest.map('map', {
            center: [43.6068, 1.4371],
            layers: L.mapquest.tileLayer('map'),
            zoom: 12,
        });

        L.marker([43.6068, 1.4371], {
            icon: L.mapquest.icons.marker(),
            draggable: false,
        })
            .bindPopup('UT1')
            .addTo(map);
    }
}

export default AboutMe;
