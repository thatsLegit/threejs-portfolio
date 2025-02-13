import HireMe from './WindowTemplates/HireMe';
import AboutMe from './WindowTemplates/AboutMe';
import SmallGames from './WindowTemplates/SmallGames';
import Skills from './WindowTemplates/Skills';
import Projects from './WindowTemplates/Projects';
import CoWorkers from './WindowTemplates/CoWorkers';
import Oporctunite from './WindowTemplates/Oporctunite';
import PeriodontalDiagnosis from './WindowTemplates/PeriodontalDiagnosis';
import Portfolio from './WindowTemplates/Portfolio';
import OporctuniteMobile from './WindowTemplates/OporctuniteMobile';
import TwitterScrapping from './WindowTemplates/TwitterScrapping';
import Bespoke from './WindowTemplates/Bespoke';
import Talent from './WindowTemplates/Talent';
import ChessEngine from './WindowTemplates/ChessEngine';

class Window {
    constructor(element) {
        this.templates = {};
        this.currentTemplate = null;
        this.element = element;
        this.closeListenerCB = this.closeListenerCB.bind(this);
    }

    addTemplate(template) {
        this.templates[template.id] = template;
    }

    injectAllTemplates() {
        Object.values(this.templates).forEach((template) => template.generate());
    }

    open(templateId) {
        const template = this.templates[templateId];
        this.element.style.display = 'block';
        template.enable();
        this.currentTemplate = template;
        document.addEventListener('keydown', this.closeListenerCB);
    }

    close() {
        this.element.style.display = 'none';
        this.currentTemplate.disable();
        this.currentTemplate = null;
    }

    closeListenerCB(e) {
        if (e.key.toString() !== 'Escape') return;
        this.close();
        document.removeEventListener('keydown', this.closeListenerCB);
    }
}

class CubeWindow extends Window {
    constructor() {
        super(document.getElementById('cube-window'));
        this._init();
    }

    _init() {
        this.addTemplate(new HireMe(this));
        this.addTemplate(new AboutMe(this));
        this.addTemplate(new SmallGames(this));
        this.addTemplate(new Skills(this));
        const projectsTemplate = new Projects(this);
        // nesting projects template with these templates is only for the go back button
        this.addTemplate(projectsTemplate);
        this.addTemplate(new CoWorkers(this, projectsTemplate));
        this.addTemplate(new Oporctunite(this, projectsTemplate));
        this.addTemplate(new PeriodontalDiagnosis(this, projectsTemplate));
        this.addTemplate(new Portfolio(this, projectsTemplate));
        this.addTemplate(new OporctuniteMobile(this, projectsTemplate));
        this.addTemplate(new TwitterScrapping(this, projectsTemplate));
        this.addTemplate(new Bespoke(this, projectsTemplate));
        this.addTemplate(new Talent(this, projectsTemplate));
        this.addTemplate(new ChessEngine(this, projectsTemplate));

        this.injectAllTemplates();
    }
}

export const cubeWindowSingleton = new CubeWindow();
