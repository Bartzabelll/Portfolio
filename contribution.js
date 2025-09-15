class GitHubContributionMap {
    constructor() {
        this.contributionData = {};
        this.currentTheme = 'github';
        this.animationsEnabled = true;
        this.cellSize = 30;
        
        this.init();
    }
    
    init() {
        // Apply initial theme
        document.body.classList.add(`theme-${this.currentTheme}`);
        
        // Generate the contribution grid
        this.generateGrid();
        
        // Set up event listeners
        this.setupEventListeners();
        // <img src="https://ghchart.rshah.org/Bartzabell?timestamp=20250605" alt="GitHub chart" class="w-full"></img>
        // Load real GitHub data instead of sample data
        this.loadGitHubData('Bartzabell?timestamp=20250605');
    }
    
    generateGrid() {
        const grid = document.getElementById('contribution-grid');
        grid.innerHTML = '';
        
        // Create 371 days (53 weeks * 7 days + 2 extra days)
        const totalDays = 371;
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - totalDays + 1);
        
        for (let i = 0; i < totalDays; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'day level-0';
            
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const dateString = this.formatDate(currentDate);
            dayElement.dataset.date = dateString;
            dayElement.dataset.contributions = '0';
            
            // Add click event
            dayElement.addEventListener('click', (e) => this.handleDayClick(e));
            
            // Add hover events for tooltip
            dayElement.addEventListener('mouseenter', (e) => this.showTooltip(e));
            dayElement.addEventListener('mouseleave', (e) => this.hideTooltip(e));
            
            grid.appendChild(dayElement);
            
            // Animate day appearance if animations are enabled
            if (this.animationsEnabled) {
                setTimeout(() => {
                    dayElement.classList.add('animate');
                }, i * 2);
            }
        }
    }
    
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    
    getContributionLevel(count) {
        if (count === 0) return 0;
        if (count <= 3) return 1;
        if (count <= 6) return 2;
        if (count <= 9) return 3;
        return 4;
    }
    
    generateSampleData() {
        const days = document.querySelectorAll('.day');
        let totalContributions = 0;
        
        days.forEach(day => {
            // Generate random contribution count (weighted towards lower numbers)
            const random = Math.random();
            let contributions = 0;
            
            if (random > 0.7) contributions = Math.floor(Math.random() * 15) + 1;
            else if (random > 0.5) contributions = Math.floor(Math.random() * 5) + 1;
            else if (random > 0.3) contributions = Math.floor(Math.random() * 3) + 1;
            
            this.setDayContribution(day, contributions);
            totalContributions += contributions;
        });
        
        document.getElementById('total-contributions').textContent = totalContributions;
    }
    
    setDayContribution(dayElement, count) {
        const level = this.getContributionLevel(count);
        
        // Remove existing level classes
        dayElement.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
        dayElement.classList.add(`level-${level}`);
        dayElement.dataset.contributions = count;
        
        this.contributionData[dayElement.dataset.date] = count;
    }
    
    handleDayClick(event) {
        const day = event.target;
        const currentCount = parseInt(day.dataset.contributions);
        const newCount = (currentCount + 1) % 16; // Cycle through 0-15
        
        this.setDayContribution(day, newCount);
        this.updateStats();
        
        // Add click animation
        if (this.animationsEnabled) {
            day.style.transform = 'scale(1.5)';
            setTimeout(() => {
                day.style.transform = '';
            }, 200);
        }
    }
    
    showTooltip(event) {
        const day = event.target;
        const date = new Date(day.dataset.date);
        const contributions = day.dataset.contributions;
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = `${contributions} contributions on ${formattedDate}`;
        
        day.appendChild(tooltip);
        
        // Position tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
    }
    
    hideTooltip(event) {
        const tooltip = event.target.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    updateStats() {
        const days = document.querySelectorAll('.day');
        const contributions = Array.from(days).map(day => parseInt(day.dataset.contributions));
        
        // Total contributions
        const total = contributions.reduce((sum, count) => sum + count, 0);
        document.getElementById('total-contributions').textContent = total;
        
        // Longest streak
        const longestStreak = this.calculateLongestStreak(contributions);
        document.getElementById('longest-streak').textContent = `${longestStreak} days`;
        
        // Current streak (from the end)
        const currentStreak = this.calculateCurrentStreak(contributions);
        document.getElementById('current-streak').textContent = `${currentStreak} days`;
        
        // Best day
        const bestDay = Math.max(...contributions);
        document.getElementById('best-day').textContent = `${bestDay} contributions`;
        
        // Average per day
        const average = (total / contributions.length).toFixed(1);
        document.getElementById('average-day').textContent = average;
    }
    
    calculateLongestStreak(contributions) {
        let longest = 0;
        let current = 0;
        
        contributions.forEach(count => {
            if (count > 0) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
        });
        
        return longest;
    }
    
    calculateCurrentStreak(contributions) {
        let streak = 0;
        
        for (let i = contributions.length - 1; i >= 0; i--) {
            if (contributions[i] > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    changeTheme(theme) {
        document.body.classList.remove(`theme-${this.currentTheme}`);
        this.currentTheme = theme;
        document.body.classList.add(`theme-${this.currentTheme}`);
    }
    
    toggleAnimations(enabled) {
        this.animationsEnabled = enabled;
        document.body.style.setProperty('--animation-duration', enabled ? '0.2s' : '0s');
    }
    
    changeCellSize(size) {
        this.cellSize = size;
        const days = document.querySelectorAll('.day');
        days.forEach(day => {
            day.style.width = `${size}px`;
            day.style.height = `${size}px`;
        });
    }
    
    setupEventListeners() {
        // Theme selector
        const themeSelect = document.getElementById('theme-select');
        themeSelect.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
        
        // Animation toggle
        const animationToggle = document.getElementById('animation-toggle');
        animationToggle.addEventListener('change', (e) => {
            this.toggleAnimations(e.target.checked);
        });
        
        // Size slider
        const sizeSlider = document.getElementById('size-slider');
        sizeSlider.addEventListener('input', (e) => {
            this.changeCellSize(parseInt(e.target.value));
        });
        
        // Generate data button - now for manual/demo use only
        const generateButton = document.getElementById('generate-data');
        generateButton.textContent = 'Generate Demo Data';
        generateButton.addEventListener('click', () => {
            this.generateSampleData();
            this.updateStats();
            
            // Add button feedback
            generateButton.textContent = 'Demo Generated!';
            generateButton.style.background = '#28a745';
            setTimeout(() => {
                generateButton.textContent = 'Generate Demo Data';
                generateButton.style.background = '';
            }, 1000);
        });
        
        // Add button to reload real GitHub data
        const reloadButton = document.createElement('button');
        reloadButton.textContent = 'Reload GitHub Data';
        reloadButton.style.marginLeft = '10px';
        reloadButton.addEventListener('click', () => {
            this.loadGitHubData('Bartzabell?timestamp=20250605');
        });
        generateButton.after(reloadButton);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'g':
                        e.preventDefault();
                        this.generateSampleData();
                        this.updateStats();
                        break;
                    case 't':
                        e.preventDefault();
                        const themes = ['github', 'ocean', 'sunset', 'forest', 'neon'];
                        const currentIndex = themes.indexOf(this.currentTheme);
                        const nextTheme = themes[(currentIndex + 1) % themes.length];
                        this.changeTheme(nextTheme);
                        themeSelect.value = nextTheme;
                        break;
                }
            }
        });
    }
    
    // Method to load real GitHub data
    async loadGitHubData(username) {
        try {
            console.log(`Loading real contribution data for ${username}...`);
            
            // Show loading state
            document.getElementById('total-contributions').textContent = 'Loading...';
            
            // Fetch contribution data from GitHub
            const contributionData = await this.fetchGitHubContributions(username);
            
            if (contributionData) {
                this.applyContributionData(contributionData);
                console.log('Successfully loaded GitHub contribution data');
            } else {
                throw new Error('Failed to fetch contribution data');
            }
            
        } catch (error) {
            console.error('Error loading GitHub data:', error);
            console.log('Falling back to manual data entry mode...');
            
            // Clear all contributions and let user manually add data
            this.clearAllContributions();
            document.getElementById('total-contributions').textContent = '0';
            
            // Show message to user
            this.showDataLoadError();
        }
        
        this.updateStats();
    }
    
    async fetchGitHubContributions(username) {
        try {
            // Method 1: Try to scrape GitHub profile page
            const profileUrl = `https://github.com/${username}`;
            console.log(`Attempting to fetch data from: ${profileUrl}`);
            
            // Since we can't directly scrape due to CORS, we'll use a different approach
            // Try GitHub API for user events (limited data)
            const apiUrl = `https://api.github.com/users/${username}/events/public`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`GitHub API responded with status: ${response.status}`);
            }
            
            const events = await response.json();
            return this.processGitHubEvents(events);
            
        } catch (error) {
            console.error('GitHub API fetch failed:', error);
            
            // Try alternative method - GitHub contributions API (unofficial)
            try {
                const contribUrl = `https://github-contributions-api.jogruber.de/v4/${username}`;
                const response = await fetch(contribUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    return this.processContributionAPIData(data);
                }
            } catch (altError) {
                console.error('Alternative API also failed:', altError);
            }
            
            return null;
        }
    }
    
    processGitHubEvents(events) {
        const contributionMap = {};
        const today = new Date();
        
        // Initialize last 365 days with 0 contributions
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = this.formatDate(date);
            contributionMap[dateString] = 0;
        }
        
        // Process events and count contributions per day
        events.forEach(event => {
            const eventDate = new Date(event.created_at);
            const dateString = this.formatDate(eventDate);
            
            // Only count events from the last year
            const daysDiff = Math.floor((today - eventDate) / (1000 * 60 * 60 * 24));
            if (daysDiff <= 365 && contributionMap.hasOwnProperty(dateString)) {
                // Count different types of events as contributions
                if (['PushEvent', 'CreateEvent', 'PullRequestEvent', 'IssuesEvent'].includes(event.type)) {
                    contributionMap[dateString]++;
                }
            }
        });
        
        return contributionMap;
    }
    
    processContributionAPIData(data) {
        const contributionMap = {};
        
        if (data.contributions) {
            data.contributions.forEach(contribution => {
                contributionMap[contribution.date] = contribution.count;
            });
        }
        
        return contributionMap;
    }
    
    applyContributionData(contributionData) {
        const days = document.querySelectorAll('.day');
        let totalContributions = 0;
        
        days.forEach(day => {
            const date = day.dataset.date;
            const count = contributionData[date] || 0;
            this.setDayContribution(day, count);
            totalContributions += count;
        });
        
        document.getElementById('total-contributions').textContent = totalContributions;
        console.log(`Applied ${totalContributions} total contributions to the grid`);
    }
    
    clearAllContributions() {
        const days = document.querySelectorAll('.day');
        days.forEach(day => {
            this.setDayContribution(day, 0);
        });
        this.contributionData = {};
    }
    
    showDataLoadError() {
        // Create an info message for the user
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h4>⚠️ Unable to load GitHub data automatically</h4>
            <p>Due to browser security restrictions, we cannot directly fetch your GitHub contribution data.</p>
            <p><strong>Options to get your real data:</strong></p>
            <ul style="text-align: left; max-width: 500px; margin: 10px auto;">
                <li>Click individual days to manually set your contributions</li>
                <li>Use the "Generate Sample Data" button for demo purposes</li>
                <li>Export/import feature to save your manual entries</li>
                <li>Use browser extensions that can bypass CORS restrictions</li>
            </ul>
            <button onclick="this.parentElement.remove()" style="margin-top: 10px; padding: 5px 15px; background: #856404; color: white; border: none; border-radius: 4px; cursor: pointer;">Got it!</button>
        `;
        
        const container = document.querySelector('.container');
        const header = container.querySelector('header');
        header.after(errorDiv);
    }
    
    // Export data as JSON
    exportData() {
        const data = {
            username: 'Bartzabell',
            contributions: this.contributionData,
            theme: this.currentTheme,
            generatedAt: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'github-contributions.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Import data from JSON
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.contributionData = data.contributions;
            
            // Apply contributions to grid
            const days = document.querySelectorAll('.day');
            days.forEach(day => {
                const date = day.dataset.date;
                const count = this.contributionData[date] || 0;
                this.setDayContribution(day, count);
            });
            
            this.updateStats();
        } catch (error) {
            console.error('Error importing data:', error);
        }
    }
}

// Initialize the contribution map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contributionMap = new GitHubContributionMap();
    
    // Add some additional interactive features
    addInteractiveFeatures();
});

function addInteractiveFeatures() {
    // Add export/import buttons dynamically
    const controls = document.querySelector('.controls');
    
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Data';
    exportBtn.addEventListener('click', () => {
        window.contributionMap.exportData();
    });
    
    const importDiv = document.createElement('div');
    importDiv.className = 'control-group';
    importDiv.innerHTML = `
        <label for="import-file">Import Data:</label>
        <input type="file" id="import-file" accept=".json">
    `;
    
    const importFile = importDiv.querySelector('#import-file');
    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                window.contributionMap.importData(e.target.result);
            };
            reader.readAsText(file);
        }
    });
    
    controls.appendChild(exportBtn);
    controls.appendChild(importDiv);
    
    // Add keyboard shortcuts info
    const shortcutsInfo = document.createElement('div');
    shortcutsInfo.innerHTML = `
        <small style="color: #6a737d; margin-top: 15px; display: block;">
            <strong>Shortcuts:</strong> Ctrl+G (Generate), Ctrl+T (Change Theme), Click any day to edit
        </small>
    `;
    controls.appendChild(shortcutsInfo);
}

// Utility function to generate realistic contribution patterns
function generateRealisticData() {
    const patterns = {
        weekdays: 0.7, // Higher activity on weekdays
        weekends: 0.3, // Lower activity on weekends
        streaks: 0.6,  // Probability of continuing a streak
        breaks: 0.2    // Probability of taking breaks
    };
    
    const days = document.querySelectorAll('.day');
    let totalContributions = 0;
    let isInStreak = false;
    let streakLength = 0;
    
    days.forEach((day, index) => {
        const date = new Date(day.dataset.date);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let baseChance = isWeekend ? patterns.weekends : patterns.weekdays;
        
        // Adjust for streaks
        if (isInStreak) {
            baseChance *= patterns.streaks;
            streakLength++;
            if (Math.random() < patterns.breaks || streakLength > 14) {
                isInStreak = false;
                streakLength = 0;
            }
        } else if (Math.random() < 0.3) {
            isInStreak = true;
            baseChance *= 1.5;
        }
        
        // Generate contributions
        let contributions = 0;
        if (Math.random() < baseChance) {
            contributions = Math.floor(Math.random() * 12) + 1;
            // Add occasional high-activity days
            if (Math.random() < 0.1) {
                contributions += Math.floor(Math.random() * 20);
            }
        }
        
        window.contributionMap.setDayContribution(day, contributions);
        totalContributions += contributions;
    });
    
    document.getElementById('total-contributions').textContent = totalContributions;
    window.contributionMap.updateStats();
}

// Add seasonal patterns
function addSeasonalPatterns() {
    const days = document.querySelectorAll('.day');
    
    days.forEach(day => {
        const date = new Date(day.dataset.date);
        const month = date.getMonth();
        const currentContributions = parseInt(day.dataset.contributions);
        
        // Summer months (June-August) - slightly higher activity
        if (month >= 5 && month <= 7) {
            if (Math.random() < 0.3 && currentContributions > 0) {
                const bonus = Math.floor(Math.random() * 3) + 1;
                window.contributionMap.setDayContribution(day, currentContributions + bonus);
            }
        }
        
        // Holiday periods - lower activity
        if ((month === 11 && date.getDate() > 20) || 
            (month === 0 && date.getDate() < 7)) {
            if (Math.random() < 0.4) {
                window.contributionMap.setDayContribution(day, Math.floor(currentContributions * 0.5));
            }
        }
    });
}

const toggleBtn = document.getElementById("themeToggle");
    const defaultTheme = document.getElementById("defaultTheme");
    const halloweenTheme = document.getElementById("halloweenTheme");
    const defaultBox = document.getElementById("defaultBox");
    const halloweenBox = document.getElementById("halloweenBox");
    const body = document.getElementById("body");

    let isHalloween = true; // default

    toggleBtn.addEventListener("click", () => {
        isHalloween = !isHalloween;

        if (isHalloween) {
            halloweenTheme.classList.remove("hidden");
            defaultTheme.classList.add("hidden");
            halloweenBox.classList.remove("hidden");
            defaultBox.classList.add("hidden");
            body.style.backgroundImage = "url('img/jd-bg-halloween.png')";
            toggleBtn.textContent = "🎃"; // Halloween icon
        } else {
            defaultTheme.classList.remove("hidden");
            halloweenTheme.classList.add("hidden");
            defaultBox.classList.remove("hidden");
            halloweenBox.classList.add("hidden");
            body.style.backgroundImage = "url('img/jd-bg.png')";
            toggleBtn.textContent = "🌙"; // Default icon
        }
    });

// Theme presets with custom color schemes
const customThemes = {
    'cherry-blossom': {
        '--level-0': '#ffeef7',
        '--level-1': '#ffb3d9',
        '--level-2': '#ff80c0',
        '--level-3': '#ff4da6',
        '--level-4': '#e6005c'
    },
    'arctic': {
        '--level-0': '#f0f8ff',
        '--level-1': '#b3d9ff',
        '--level-2': '#66c2ff',
        '--level-3': '#1a8cff',
        '--level-4': '#0066cc'
    },
    'volcanic': {
        '--level-0': '#2d1b14',
        '--level-1': '#5c2e1f',
        '--level-2': '#8b442a',
        '--level-3': '#ba5a35',
        '--level-4': '#ff6b35'
    }
};

// Apply custom theme
function applyCustomTheme(themeName, colors) {
    const root = document.documentElement;
    Object.entries(colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
}

// Advanced data manipulation functions
function createDataPattern(pattern) {
    const days = document.querySelectorAll('.day');
    
    switch(pattern) {
        case 'mountain':
            // Create mountain-like pattern
            days.forEach((day, index) => {
                const cycle = Math.sin((index / days.length) * Math.PI * 4) * 10 + 5;
                const contributions = Math.max(0, Math.floor(cycle));
                window.contributionMap.setDayContribution(day, contributions);
            });
            break;
            
        case 'waves':
            // Create wave pattern
            days.forEach((day, index) => {
                const wave = Math.sin((index / 30) * Math.PI) * 8 + 3;
                const contributions = Math.max(0, Math.floor(wave));
                window.contributionMap.setDayContribution(day, contributions);
            });
            break;
            
        case 'random-high':
            // High activity random pattern
            days.forEach(day => {
                const contributions = Math.floor(Math.random() * 20);
                window.contributionMap.setDayContribution(day, contributions);
            });
            break;
            
        case 'sparse':
            // Sparse activity pattern
            days.forEach(day => {
                const contributions = Math.random() < 0.2 ? Math.floor(Math.random() * 5) + 1 : 0;
                window.contributionMap.setDayContribution(day, contributions);
            });
            break;
    }
    
    window.contributionMap.updateStats();
}

// Add pattern selector to the interface
function addPatternSelector() {
    const controls = document.querySelector('.controls');
    
    const patternDiv = document.createElement('div');
    patternDiv.className = 'control-group';
    patternDiv.innerHTML = `
        <label for="pattern-select">Pattern:</label>
        <select id="pattern-select">
            <option value="">Select Pattern</option>
            <option value="realistic">Realistic</option>
            <option value="mountain">Mountain</option>
            <option value="waves">Waves</option>
            <option value="random-high">High Activity</option>
            <option value="sparse">Sparse</option>
        </select>
    `;
    
    const patternSelect = patternDiv.querySelector('#pattern-select');
    patternSelect.addEventListener('change', (e) => {
        if (e.target.value === 'realistic') {
            generateRealisticData();
            addSeasonalPatterns();
        } else if (e.target.value) {
            createDataPattern(e.target.value);
        }
    });
    
    controls.appendChild(patternDiv);
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add pattern selector after a short delay
    setTimeout(() => {
        addPatternSelector();
    }, 100);
    
    // Add right-click context menu for individual days
    document.addEventListener('contextmenu', (e) => {
        if (e.target.classList.contains('day')) {
            e.preventDefault();
            showDayContextMenu(e);
        }
    });
});

// Context menu for individual days
function showDayContextMenu(event) {
    const day = event.target;
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) existingMenu.remove();
    
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: fixed;
        background: white;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        padding: 8px 0;
        z-index: 1000;
        font-size: 14px;
        min-width: 150px;
    `;
    
    const menuItems = [
        { text: 'Set to 0', action: () => window.contributionMap.setDayContribution(day, 0) },
        { text: 'Set to 5', action: () => window.contributionMap.setDayContribution(day, 5) },
        { text: 'Set to 10', action: () => window.contributionMap.setDayContribution(day, 10) },
        { text: 'Set to 15', action: () => window.contributionMap.setDayContribution(day, 15) },
        { text: 'Random', action: () => window.contributionMap.setDayContribution(day, Math.floor(Math.random() * 20)) }
    ];
    
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.style.cssText = `
            padding: 8px 16px;
            cursor: pointer;
            transition: background 0.1s;
        `;
        menuItem.addEventListener('mouseenter', () => {
            menuItem.style.background = '#f6f8fa';
        });
        menuItem.addEventListener('mouseleave', () => {
            menuItem.style.background = 'transparent';
        });
        menuItem.addEventListener('click', () => {
            item.action();
            window.contributionMap.updateStats();
            menu.remove();
        });
        menu.appendChild(menuItem);
    });
    
    menu.style.left = `${event.clientX}px`;
    menu.style.top = `${event.clientY}px`;
    
    document.body.appendChild(menu);
    
    // Remove menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', () => {
            menu.remove();
        }, { once: true });
    }, 10);
}

const image = document.getElementById('profileImage');
    const images = ['img/me.png', 'img/biker-me.png'];
    let index = 0;

    setInterval(() => {
        index = (index + 1) % images.length;
        image.src = images[index];
    }, 3000);

    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const carousel = document.getElementById('carousel');
    const totalSlides = slides.length;

    // Initialize the carousel
    function initCarousel() {
        updateCarousel();
        updateDots();
    }

    // Update carousel position
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Update dot indicators
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('bg-gray-600', index === currentSlide);
            dot.classList.toggle('bg-gray-400', index !== currentSlide);
        });
    }

    // Show specific slide
    function showSlide(index) {
        currentSlide = index;
        updateCarousel();
        updateDots();
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
        updateDots();
    }

    // Previous slide
    function previousSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
        updateDots();
    }
document.addEventListener('DOMContentLoaded', initCarousel);