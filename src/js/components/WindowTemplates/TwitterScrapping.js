import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';

class TwitterScrapping extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'twitter-scrapping');

        this.githubLink = 'https://github.com/thatsLegit/twitter';
    }

    // DONT FORGET TO REMOVE display: none;
    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} {
                display: none;
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

            <p class="projects-title">ReTweet prediction using Twitter api and Python (masters project)</p>

            <div class="projects-container">
                <div class="project-explanation">
                    Small but very interesting project with using the Twitter developer api to search twitts about a certain topic, using weka to predict retwitts, first ML algo experience. <br>
                    It's not a very popular software as most people mostly think of python libraries for ML but this software is actually pretty good for learning, testing ML algos on a set of data. <br>
                    It's mostly used by Academics as it's maintained by professors from a Uni in NZ…<br><br>

                    The main python file will download a stream of twitts relative to a certain topic by looking into the entered keyword.<br>
                    This generates a .arff file which we can then use in Weka.<br><br>

                    Attributes that predict the RT:
                    <ul>
                        <li>Number_of_followers</li>
                        <li>Number_of_friend</li>
                        <li>Total_of_tweets</li>
                        <li>Contain_Picture</li>
                        <li>Contain_hashtag</li>
                        <li>langage</li>
                        <li>verified_account</li>
                    </ul>>

                    The number of followers and number of friends appeared to be the most discriminant attributes describing wether a twitt will be retweeted or not.
                </p>
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
    }
}

export default TwitterScrapping;
