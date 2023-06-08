import WindowTemplate from './WindowTemplate';
import profile from '../../../assets/content/profile.jpg';
import games from '../../../assets/content/games.png';
import auction from '../../../assets/content/auction.png';
import reading from '../../../assets/content/reading.png';
import workout from '../../../assets/content/workout.png';
import wordcloud from '../../../assets/content/wordcloud.png';
import development from '../../../assets/content/development.png';
import computer from '../../../assets/content/computer.png';
import lawBook from '../../../assets/content/law-book.png';
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
                        My name is Ilja (pronounce Ilya) and as you may have guessed, I am a computer science
                        student <img src=${happy} alt="happy" />. <br /><br />
                        I am currently involved in the M2 Innovative Information Systems in the Capitole
                        University of Toulouse, France.<br /><br />
                        I study various topics such as web development, machine/deep learning, data science, IoT
                        and more !<br /><br />
                        Apart from classes I like exploring new technologies by my own and recently I've been very
                        excited about 3d which led to this portfolio website !<br /><br />
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
                    <div class="timeline-item">
                    <p class="timeline-text">Master in Business law (<i>2017</i>)</p>
                    <img class="timeline-image" src=${auction} alt="contract" />
                </div>
                <div class="timeline-item">
                    <p class="timeline-text">Law and economics Bachelor (<i>2014</i>)</p>
                    <img class="timeline-image" src=${lawBook} alt="law-book" />
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
