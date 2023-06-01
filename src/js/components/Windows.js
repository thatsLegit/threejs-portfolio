import HireMe from './WindowTemplates/HireMe';
import AboutMe from './WindowTemplates/AboutMe';
import SmallGames from './WindowTemplates/SmallGames';
import Skills from './WindowTemplates/Skills';

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
        if (e.key.toString() === 'Escape') this.close();
        document.removeEventListener('keydown', this.closeListenerCB);
    }
}

class CubeWindow extends Window {
    constructor() {
        super(document.getElementById('cube-window'));
        this._init();
    }

    _init() {
        // this.addTemplate(new HireMe(this));
        // this.addTemplate(new AboutMe(this));
        // this.addTemplate(new SmallGames(this));
        this.addTemplate(new Skills(this));

        this.injectAllTemplates();
    }
}

export const cubeWindowSingleton = new CubeWindow();
