import WindowTemplate from './WindowTemplate';
import Slider from '../Slider';

import back from '../../../assets/content/back.png';
import home from '../../../assets/content/projects/mobile/unlockt/home.png';
import homeLink from '../../../assets/content/projects/mobile/unlockt/home_link.png';
import homeGenerate from '../../../assets/content/projects/mobile/unlockt/home_generate.png';
import media from '../../../assets/content/projects/mobile/unlockt/media.png';
import link from '../../../assets/content/projects/mobile/unlockt/link.png';
import wallet from '../../../assets/content/projects/mobile/unlockt/wallet.png';
import logo from '../../../assets/content/projects/mobile/unlockt/logo.png';
import appStore from '../../../assets/content/projects/mobile/unlockt/app_store.png';
import googlePlay from '../../../assets/content/projects/mobile/unlockt/google_play.png';
import amplitude from '../../../assets/content/projects/mobile/unlockt/amplitude.png';
import adjust from '../../../assets/content/projects/mobile/unlockt/adjust.png';
import sentry from '../../../assets/content/projects/mobile/unlockt/sentry.png';
import instana from '../../../assets/content/projects/mobile/unlockt/instana.png';
import customerIO from '../../../assets/content/projects/mobile/unlockt/customerio.png';
import sellersPage from '../../../assets/content/projects/mobile/unlockt/sellers_page.png';
import sellersCollection from '../../../assets/content/projects/mobile/unlockt/sellers_collection.png';

class Unlockt extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'unlockt');

        this.landingPage = 'https://unlockt.me';
        this.appStore = 'https://apps.apple.com/us/app/unlockt-sell-your-files/id1632025425';
        this.googlePlay = 'https://play.google.com/store/apps/details?id=com.behindtheapp.unlockt';

        this.slideIds = [`${this.id}-slide-1`, `${this.id}-slide-2`];
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

            <p class="projects-title">Unlockt.me mobile app</p>

            <div class="projects-container">
                <div class="template-inner-container flex-row justify-space-around align-center">
                    <a href=${this.landingPage} target="_blank" rel="noopener noreferrer">
                    <img
                        src=${logo}
                        alt="Unlockt.me" width="50" height="50"
                    >
                    </a>
                    <a href=${this.appStore} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${appStore}
                            alt="App Store" width="150" height="50"
                        >
                    </a>
                    <a href=${this.googlePlay} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${googlePlay}
                            alt="Google Play" width="150" height="50"
                        >
                    </a>
                </div>

                <!-- slideshow 1-->
                <p class="project-presentation">
                    Unlockt.me is the brand new solution for all your media sharing. It provides you with the safest and easiest way to sell your photos and videos with anyone using a simple link.<br><br>

                    Using Unlockt.me is very simple. Just follow these steps:<br><br>

                    1. Import your files to unlockt.me<br>
                    2. Set any price you want to charge for your content<br>
                    3. Generate a downloading link<br>
                    4. Send the link to the person you want to share your photo or video with<br><br>

                    As soon as the person pays the price set by you, the funds will be directly transferred into your bank account. The app is not only for content creators who want to monetize their work - it can be used by anyone!<br><br>

                    For example:<br><br>

                    • Are you a freelancer? Get paid directly when clients download your deliverables<br>
                    • Are you a student? Share your study notes and lesson sheets with classmates for a fee<br>
                    • Do you have a fanbase? Let fans pay to access snippets of your new music or videos<br><br>

                    File transfer made easy with Unlockt.me<br><br>

                    <a href="https://unlockt.me/terms-of-service/application" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                    <a href="https://unlockt.me/privacy-policy/application" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </p>

                    <div id="${this.slideIds[0]}" class="slideshow-container">
                        <div class="fade">
                            <div class="caption">Main page</div>
                            <img src=${home}>
                        </div>
                        <div class="fade">
                            <div class="caption">Choose a file</div>
                            <img src=${homeLink}>
                        </div>
                        <div class="fade">
                            <div class="caption">Upload it</div>
                            <img src=${homeGenerate}>
                        </div>
                        <div class="fade">
                            <div class="caption">Share it</div>
                            <img src=${media}>
                        </div>
                        <div class="fade">
                            <div class="caption">List all your files</div>
                            <img src=${link}>
                        </div>
                        <div class="fade">
                            <div class="caption">Withdraw your funds $$$</div>
                            <img src=${wallet}>
                        </div>
                    </div>
                    <div class="project-explanation">
                        <div class="template-inner-container flex-row justify-space-around align-center">
                        <img
                            src=${amplitude}
                            alt="amplitude" width="200" height="150"
                        >
                            <img
                                src=${adjust}
                                alt="adjust" width="150" height="150"
                            >
                            <img
                                src=${sentry}
                                alt="sentry" width="150" height="150"
                            >
                            <img
                                src=${instana}
                                alt="instana" width="125" height="100"
                            >
                            <img
                                src=${customerIO}
                                alt="customerIO" width="125" height="100"
                            >
                        </a>
                    </div>

                    <p style="margin-top: 12px;">
                        We built it with bare React Native 0.73 workflow. The choice of React Native was made for for having
                        ease in adding native modules and because some of our libraries were not yet available for Expo. Maybe
                        that have changed since then.<br><br>
                        
                        As for the app's state management, we used micro-frontends architecture with react-query for data
                        fetching and zustand for the local state.<br><br>
                        
                        React Native reanimated was used for the animations.<br><br>

                        A challenging part of the project was to make decisions around the app's features based on user's data.
                        In order to do so, we used different tools to track user's behavior and preferences:<br><br>

                        <ul>
                            <li>
                                <strong>Google Analytics</strong> For the web part
                            </li>
                            <li>
                                <strong>Amplitude</strong> to track user's behavior on the app
                            </li>
                            <li>
                                <strong>Adjust</strong> to detect the source of the traffic
                            </li>
                        </ul><br>

                        Some other tools were used to detect errors and crashes (crashlytics):<br><br>

                        <ul>
                            <li>
                                <strong>Sentry</strong> in the mobile app
                            </li>
                            <li>
                                <strong>Instana</strong> More for the backend part
                            </li>
                        </ul><br>

                        Finally, we used Stripe for the payment processing, and Firebase sdk coupled with CustomerIO 
                        for the push notifications to both Android and iOS.
                    </p>
                </div>

                <!-- slideshow 2-->
                <div id="${this.slideIds[1]}" class="slideshow-container">
                    <div class="fade">
                        <div class="caption">The page to buy content</div>
                        <img src=${sellersPage}>
                    </div>
                    <div class="fade">
                        <div class="caption">The page to see the collection of a seller</div>
                        <img src=${sellersCollection}>
                    </div>
                </div>

                <div class="project-explanation">
                    We had a conversion rate of approximately 2% on this page. This means that only 2% of the users 
                    who visited the page bought content. It was critical to improve this rate.

                    We improved it with testing different versions of this page with A/B testing.

                    We then decided to focus on the "collection" feature, which is a page that displays all the content 
                    shared by a specific user.
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

export default Unlockt;
