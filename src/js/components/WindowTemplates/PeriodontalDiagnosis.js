import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import scikitLearn from '../../../assets/content/projects/ai/scikit-learn.png';
import matplotlib from '../../../assets/content/projects/ai/matplotlib.png';
import numpy from '../../../assets/content/projects/ai/numpy.png';

class CoWorkers extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'periodontal-diagnosis');

        this.githubLink = 'https://github.com/thatsLegit/dental-diagnosis';
        this.scikitLearnLink = 'https://scikit-learn.org';
        this.matplotlibLink = 'https://matplotlib.org';
        this.numpyLink = 'https://numpy.org';
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

            <p class="projects-title">Dental diagnosis with Machine Learning (masters project)</p>

            <div class="projects-container">
                <div class="template-inner-container">
                    <a href=${this.scikitLearnLink} target="_blank" rel="noopener noreferrer">
                    <img
                        src=${scikitLearn}
                        alt="scikit-learn" width="200" height="100"
                    >
                    </a>
                    <a href=${this.matplotlibLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${matplotlib}
                            alt="matplotlib" width="100" height="100"
                        >
                    </a>
                    <a href=${this.numpyLink} target="_blank" rel="noopener noreferrer">
                        <img 
                            src=${numpy}
                            alt="numpy" width="200" height="100"
                        >
                    </a>
                </div>

                <p class="project-explanation">
                    The purpose of this project was to apply different techniques of machine learning on a realworld dataset.<br><br>
                    The studied dataset contained different features of patients from the Centre Hopitalier Universitaire (CHU) of Toulouse, and had the purpose of defining if the patients were at risk of having a disease on their tooth supporting tissues. Unfortunately we had this dataset only temporarily and had to delete it after the project was over because of privacy concerns.<br><br>
                    The machine learning techniques applied were: SVM, KNN and Random Forest.<br>
                    After preprocessing the data and tuning the models to obtain the best results for the available data, the most accurate algorithm was a linear SVM model, with a 100% accuracy.<br><br>
                    These results were very encouraging and we could easily imagine such a model sort of back-checking doctors in their diagnosis or alert them when a diagnosis seems very unusual.<br>
                    The most challenging part of the project was, as very often in ML projects, the preparation of the data. We had to test different solutions on how to deal with missing data (deleting the whole row, interpolate a value, consider null values as 'real' data by transforming them into a category 'undefined'…).
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

export default CoWorkers;
