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
    const astronaut = document.createElement('img');
    astronaut.src = 'img/astronaut.svg';
    astronaut.classList.add('floating');
    document.body.appendChild(astronaut);

    let posX = Math.random() * window.innerWidth;
    let posY = Math.random() * window.innerHeight;
    let deltaX = (Math.random() - 0.5) * 2;
    let deltaY = (Math.random() - 0.5) * 2;
    let floating = true; 
    let animationInterval;

    function animate() {
        if (floating) { 
            posX += deltaX;
            posY += deltaY;

            if (posX < 0 || posX > window.innerWidth - 100) {
                deltaX = -deltaX;
            }
            if (posY < 0 || posY > window.innerHeight - 100) {
                deltaY = -deltaY;
            }
        }
        astronaut.style.left = `${posX}px`;
        astronaut.style.top = `${posY}px`;

        requestAnimationFrame(animate);
    }

    // Function to smoothly move astronaut toward the button over 3 seconds
    function moveToButton(button) {
        const buttonRect = button.getBoundingClientRect();
        const targetX = buttonRect.left + buttonRect.width / 2 - 50;
        const targetY = buttonRect.top + buttonRect.height / 2 - 50;

        const steps = 180; // Total steps for a 3-second animation (60 FPS * 3 seconds)
        let currentStep = 0;

        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            if (currentStep >= steps || floating) {
                clearInterval(animationInterval);
                return;
            }

            // Calculate incremental movement
            posX += (targetX - posX) / (steps - currentStep);
            posY += (targetY - posY) / (steps - currentStep);

            astronaut.style.left = `${posX}px`;
            astronaut.style.top = `${posY}px`;

            currentStep++;
        }, 1000 / 60); // Run at 60 FPS
    }

    // Event listeners on the button
    const button = document.querySelector('button');

    button.addEventListener('mouseenter', () => {
        floating = false; 
        moveToButton(button); 
        button.classList.add('expand');
    });

    button.addEventListener('mouseleave', () => {
        floating = true; 
        button.classList.remove('expand');
    });

    animate();

    const cursor = document.getElementById('cursor');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.pageX}px`;
        cursor.style.top = `${e.pageY}px`;
    });

    const container = document.querySelector('.container');

    container.addEventListener('mouseover', () => {
        cursor.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        cursor.style.transform = 'scale(1.5)';
    });

    container.addEventListener('mouseout', () => {
        cursor.style.backgroundColor = 'rgba(0, 123, 255, 0.7)';
        cursor.style.transform = 'scale(1)';
    });

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