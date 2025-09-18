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
    
    setDayContribution(dayElement, count) {
        const level = this.getContributionLevel(count);
        
        // Remove existing level classes
        dayElement.classList.remove('level-0', 'level-1', 'level-2', 'level-3', 'level-4');
        dayElement.classList.add(`level-${level}`);
        dayElement.dataset.contributions = count;
        
        this.contributionData[dayElement.dataset.date] = count;
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
    //auto close commit details
    hideTooltip(event) {
        const tooltip = event.target.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    setupEventListeners() {
        document.getElementById('theme-select');
        document.getElementById('animation-toggle');
        document.getElementById('size-slider');
        document.getElementById('generate-data');
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
            const contribUrl = `https://github-contributions-api.jogruber.de/v4/${username}`;
            const response = await fetch(contribUrl);
            
            if (response.ok) {
                const data = await response.json();
                return this.processContributionAPIData(data);
            }
        } catch (altError) {
            console.error('API failed:', altError);
        }
        return null;
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
}

// Initialize the contribution map when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.contributionMap = new GitHubContributionMap();
});

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