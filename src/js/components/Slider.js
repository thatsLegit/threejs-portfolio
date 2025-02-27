class Slider {
    constructor(identifier) {
        this.container = document.querySelector(`#${identifier}`);
        this.slides = document.querySelectorAll(`#${identifier} > div`);
        this.slidesNumber = this.slides.length;
        this.currentSlide = 0;

        this._init();
    }

    _init() {
        this.selectSlide(this.currentSlide);
        if (this.slidesNumber > 1) {
            this.generatePrevNextButtons();
        }
    }

    selectSlide(slideIndex) {
        if (slideIndex >= this.slidesNumber) {
            this.currentSlide = 0;
        } else if (slideIndex < 0) {
            this.currentSlide = this.slidesNumber - 1;
        } else {
            this.currentSlide = slideIndex;
        }

        this.slides.forEach((slide) => {
            slide.style.display = 'none';
        });

        this.slides[this.currentSlide].style.display = 'block';
    }

    generatePrevNextButtons() {
        const prev = document.createElement('a');

        prev.className = 'prev';
        prev.innerHTML = '&#10094';
        prev.addEventListener('click', () => {
            this.selectSlide(this.currentSlide - 1);
        });

        const next = document.createElement('a');

        next.className = 'next';
        next.innerHTML = '&#10095';
        next.addEventListener('click', () => {
            this.selectSlide(this.currentSlide + 1);
        });

        this.container.insertAdjacentElement('beforeend', prev);
        this.container.insertAdjacentElement('beforeend', next);
    }

    generateDots() {
        const dotContainer = document.createElement('div');

        dotContainer.className = 'dot-container';

        this.container.insertAdjacentElement('afterend', dotContainer);

        for (let i = 0; i < this.slidesNumber; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.addEventListener('click', () => {
                this.selectSlide(i);
            });
            dotContainer.insertAdjacentElement('beforeend', dot);
        }
    }
}

export default Slider;
