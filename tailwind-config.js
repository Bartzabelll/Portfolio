tailwind.config = {
    theme: {
        extend: {
            height: {
                '128': '30rem', 
                '144': '36rem',
            },
            fontFamily: {
                'arial': ['Arial', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
                'engravers': ['"Engravers MT"', 'sans-serif'], 
                'pixel': ['pixel', 'sans-serif'],
                'square': ['square', 'sans-serif'],
                'lora' : ['Lora', 'serif'],
            },
            screens: {
                'mobile-custom': '375px',
            },
        }
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const dotGrid = document.querySelector('.dot-grid');
    const pillowShape = document.querySelector('.pillow-shape');

    pillowShape.addEventListener('click', () => {
        // Generate random x and y offsets
        const randomX = (Math.random() - 0.5) * 100; // Adjust the multiplier for distance
        const randomY = (Math.random() - 0.5) * 100; // Adjust the multiplier for distance
        
        // Set CSS variables for dodge animation
        pillowShape.style.setProperty('--x1', `${randomX}px`);
        pillowShape.style.setProperty('--y1', `${randomY}px`);
        
        const randomX2 = (Math.random() - 0.5) * 100;
        const randomY2 = (Math.random() - 0.5) * 100;
        
        pillowShape.style.setProperty('--x2', `${randomX2}px`);
        pillowShape.style.setProperty('--y2', `${randomY2}px`);
        
        const randomX3 = (Math.random() - 0.5) * 100;
        const randomY3 = (Math.random() - 0.5) * 100;
        
        pillowShape.style.setProperty('--x10', `${randomX3}px`);
        pillowShape.style.setProperty('--y3', `${randomY3}px`);
    
        // Trigger the dodge animation
        pillowShape.style.animation = 'dodge 0.5s forwards';
    
        // Reset the animation after it finishes to allow re-triggering
        pillowShape.addEventListener('animationend', () => {
            pillowShape.style.animation = ''; // Reset the animation
        }, { once: true });
    });

    for (let i = 0; i < 100; i++) { 
        const dot = document.createElement('div'); 
        dotGrid.appendChild(dot); 
    }
    var options1 = {
        chart: {
            type: 'radar',
            height: '500',
            toolbar: {
                show: false
            }
        },
        series: [{
            name: 'Skill Level',
            data: [80, 60, 90, 70, 90, 70, 90, 90]
        }],
        plotOptions: {
            radar: {
                polygons: {
                    strokeColor: '#e9e9e9',
                    fill: {
                        colors: ['rgba(255, 238, 12, 0.5)', 'rgba(255, 246, 149, 0.5)']
                    }
                }
            }
        },        
        yaxis: {
            show: false,
        },
        xaxis: {
            labels: {
                show: true 
            },
            categories: ['PHP', 'Design', 'Database', 'Project Management', 'Version Control', 'UI/UX', 'SEO/AI', 'Development'] 
        },
        fill: {
            opacity: 0.3
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['#1853e7']
        },
        markers: {
            size: 4,
            colors: ['#1853e7'],
            strokeColor: '#1853e7',
            strokeWidth: 2
        },
        colors: ['#1853e7'],
        tooltip: {
            enabled: true,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {
                const labels = ['PHP/HTML', 'CSS/TAILWIND CSS/JS', 'Database(MySQL, SQLSRV, SQLITE)', 'Project Management', 'Version Control', 'UI/UX', 'SEO/AI', 'Collaborative/Team Development'];
                const skillLevel = series[seriesIndex][dataPointIndex];
                const skillName = labels[dataPointIndex];
                return `<div style="padding: 5px; color: #fff; background: #333; border-radius: 5px;">
                            <strong>${skillName}</strong>: ${skillLevel}%
                        </div>`;
            }
        }
    };
    
    var chart1 = new ApexCharts(document.querySelector("#skillProficiencyChart"), options1);
    chart1.render();
                                   

    var options2 = {
        chart: {
            type: 'bar',
            height: 250,
            toolbar: {
                show: false
            }
        },
        series: [{
            name: 'Knowledge Level',
            data: [80, 75, 60, 70, 65]
        }],
        xaxis: {
            categories: ['Programming & Development', 'Database', 'Design', 'Collaboration', 'Website Deployment'],
            labels: {
                show: false
            }
        },
        colors: ['#ffeb0c', '#ffd700', '#fffacd', '#f0e68c', '#ffe135'],
        plotOptions: {
            bar: {
            distributed: true,
            endingShape: 'rounded'
            }
        },
        title: {
            text: 'Practical Knowledge Levels',
            align: 'center',
            style: {
                color: '#ffeb0c',
            }
        },
        legend: {
            show: true,
            position: 'top',
            labels: {
                colors: '#ffeb0c', 
            },
        },
        tooltip: {
            y: {
                formatter: function(val, { seriesIndex, dataPointIndex, w }) {
                    return w.globals.labels[dataPointIndex] + ": " + val + "%";
                }
            }
        }
    };

    var chart2 = new ApexCharts(document.querySelector("#knowledgeLevelsChart"), options2);
    chart2.render();            

    var options3 = {
        chart: {
            type: 'pie',
            height: '250'
        },
        series: [40, 30, 15, 15],
        labels: ['Programming', 'Database Management', 'Design', 'Deployment & Collaboration'],
        colors: ['#ffeb0c', '#ffcc00', '#e5b000', '#b59400', '#6d4f00'],
        title: {
            text: 'Experience Distribution',
            align: 'center',
            style: {
                color: '#ffeb0c',
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            labels: {
                colors: '#ffeb0c', 
            },
        },
    };
    var chart3 = new ApexCharts(document.querySelector("#experienceDistributionChart"), options3);
    chart3.render();
});