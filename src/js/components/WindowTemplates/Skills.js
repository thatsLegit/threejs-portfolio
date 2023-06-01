import { Chart } from 'chart.js';
import WindowTemplate from './WindowTemplate';

class Skills extends WindowTemplate {
    constructor(window) {
        super(window, 'skills');
    }

    cssTemplate() {
        return `
            ${super.cssTemplate()}
            #${this.id} .chart-container {
                width: 600px;
                margin: 10px 0px 50px 0px;
            }
        `;
    }

    htmlTemplate() {
        return `
            ${super.htmlTemplate()}
            <div class="chart-container">
                <canvas id="front"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="back"></canvas>
            </div>

            <div class="chart-container">
                <canvas id="ai"></canvas>
            </div>
            <div class="chart-container">
                <canvas id="soft-others"></canvas>
            </div>
        `;
    }

    generate() {
        super.generate();

        this._createChart(
            'front',
            'Front-end development',
            ['Javascript', 'React/React Native', 'Angular', 'Bootstrap/BSstudio', 'CSS3', 'HTML5'],
            [9, 9, 6, 8, 8, 10]
        );
        this._createChart(
            'back',
            'Back-end development',
            [
                'Node.js',
                'PHP/CodeIgniter',
                'Java/Sprint-boot',
                'Python/Flask',
                'Postman',
                'SQL/NoSQL',
            ],
            [9, 8, 5, 7, 10, 9]
        );
        this._createChart(
            'ai',
            'Data science',
            [
                'Python',
                'Machine Learning',
                'Data structures',
                'Deep learning',
                'Data visualization',
            ],
            [8, 9, 8, 5, 7]
        );
        this._createChart(
            'soft-others',
            'Soft skills - others',
            [
                'Design/UI/UX',
                'MS Excel/VB',
                'Team player',
                'Git',
                'Agility',
                'DevOps/Cloud/hosting',
            ],
            [9, 8, 9, 9, 9, 7]
        );
    }

    _createChart(element = '', title = '', labels = [], data = []) {
        const ctx = document.getElementById(element).getContext('2d');
        new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [
                    {
                        backgroundColor: 'rgba(0,255,0,0.25)',
                        borderWidth: '0.1',
                        borderColor: 'black',
                        data,
                    },
                ],
            },
            // Configuration options go here
            options: {
                legend: { display: false },
                responsive: true,
                title: {
                    text: title,
                    display: true,
                    position: `bottom`,
                    fontSize: 17,
                    fontFamily: 'Courier New',
                    fontColor: 'black',
                    padding: 10,
                },
                plugins: {
                    /* ######### https://chartjs-plugin-datalabels.netlify.com/ #########*/
                    datalabels: {
                        formatter: function (value, context) {
                            return context.chart.data.labels[context.value];
                        },
                        listeners: {
                            enter: function (context) {
                                context.hovered = true;
                                return true;
                            },
                            leave: function (context) {
                                context.hovered = false;
                                return true;
                            },
                        },
                        color: function (context) {
                            return context.hovered ? 'blue' : 'gray';
                        },
                        font: {
                            weight: 'strong',
                        },
                    },
                },
                scale: {
                    angleLines: {
                        display: false,
                    },
                    pointLabels: {
                        /* https://www.chartjs.org/docs/latest/axes/radial/linear.html#point-label-options */
                        fontSize: 12,
                        fontStyle: 'bold',
                        fontColor: 'black',
                        callback: function (value, index, values) {
                            return value;
                        },
                    },
                    ticks: {
                        beginAtZero: true,
                        display: false,
                        min: 0,
                        max: 10,
                    },
                },
                tooltips: {
                    mode: 'point',
                },
            },
        });
    }
}

export default Skills;
