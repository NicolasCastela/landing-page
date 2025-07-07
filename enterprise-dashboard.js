// Enterprise Dashboard - Professional Business Intelligence
class EnterpriseDashboard {
    constructor() {
        this.data = {
            revenue: 0,
            users: 0,
            conversion: 0,
            satisfaction: 0,
            revenueHistory: [],
            activities: [],
            products: []
        };
        
        this.init();
    }

    init() {
        this.generateInitialData();
        this.startDataUpdates();
        this.renderDashboard();
        this.setupNotifications();
        
        console.log('Enterprise Dashboard initialized');
    }

    generateInitialData() {
        // Generate realistic business data
        this.data.revenue = 2847650;
        this.data.users = 12847;
        this.data.conversion = 3.24;
        this.data.satisfaction = 4.7;
        
        // Generate revenue history for chart
        for (let i = 0; i < 12; i++) {
            this.data.revenueHistory.push({
                month: i,
                value: 200000 + Math.random() * 300000
            });
        }
        
        // Generate product data
        this.data.products = [
            {
                name: 'Enterprise Analytics Suite',
                revenue: 1250000,
                units: 847,
                growth: 23.5,
                status: 'success'
            },
            {
                name: 'AI-Powered CRM',
                revenue: 980000,
                units: 1203,
                growth: 18.2,
                status: 'success'
            },
            {
                name: 'Business Intelligence Pro',
                revenue: 756000,
                units: 634,
                growth: 12.8,
                status: 'warning'
            },
            {
                name: 'Data Visualization Tools',
                revenue: 543000,
                units: 892,
                growth: -2.1,
                status: 'error'
            },
            {
                name: 'Automated Reporting',
                revenue: 432000,
                units: 567,
                growth: 8.9,
                status: 'success'
            }
        ];
        
        // Generate activities
        this.data.activities = [
            {
                title: 'New enterprise client onboarded',
                time: '2 minutes ago',
                type: 'success',
                icon: '🏢'
            },
            {
                title: 'Monthly report generated',
                time: '15 minutes ago',
                type: 'info',
                icon: '📊'
            },
            {
                title: 'System backup completed',
                time: '1 hour ago',
                type: 'success',
                icon: '💾'
            },
            {
                title: 'Performance optimization applied',
                time: '2 hours ago',
                type: 'info',
                icon: '⚡'
            }
        ];
    }

    startDataUpdates() {
        // Update metrics every 5 seconds
        setInterval(() => {
            this.updateMetrics();
            this.renderMetrics();
        }, 5000);
        
        // Add new activities periodically
        setInterval(() => {
            this.addNewActivity();
        }, 15000);
        
        // Show notifications
        setInterval(() => {
            this.showRandomNotification();
        }, 20000);
    }

    updateMetrics() {
        // Simulate realistic business growth
        this.data.revenue += Math.random() * 5000 + 1000;
        this.data.users += Math.floor(Math.random() * 10) + 2;
        this.data.conversion += (Math.random() - 0.5) * 0.1;
        this.data.satisfaction += (Math.random() - 0.5) * 0.05;
        
        // Keep values within realistic bounds
        this.data.conversion = Math.max(1.5, Math.min(5.0, this.data.conversion));
        this.data.satisfaction = Math.max(3.5, Math.min(5.0, this.data.satisfaction));
    }

    renderDashboard() {
        this.renderMetrics();
        this.renderChart();
        this.renderActivities();
        this.renderProductsTable();
    }

    renderMetrics() {
        document.getElementById('totalRevenue').textContent = this.formatCurrency(this.data.revenue);
        document.getElementById('activeUsers').textContent = this.formatNumber(this.data.users);
        document.getElementById('conversionRate').textContent = this.data.conversion.toFixed(2) + '%';
        document.getElementById('satisfaction').textContent = this.data.satisfaction.toFixed(1) + '/5';
        
        // Update change indicators
        document.getElementById('revenueChange').textContent = '+12.5%';
        document.getElementById('usersChange').textContent = '+8.3%';
        document.getElementById('conversionChange').textContent = '+5.7%';
        document.getElementById('satisfactionChange').textContent = '+2.1%';
    }

    renderChart() {
        const chartContainer = document.getElementById('revenueChart');
        chartContainer.innerHTML = '';
        
        this.data.revenueHistory.forEach((item, index) => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = (item.value / 500000) * 160 + 20; // Scale to chart height
            bar.style.setProperty('--height', height + 'px');
            bar.style.height = height + 'px';
            chartContainer.appendChild(bar);
        });
    }

    renderActivities() {
        const container = document.getElementById('activityFeed');
        container.innerHTML = '';
        
        this.data.activities.slice(0, 6).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            
            const iconColor = activity.type === 'success' ? '#10b981' : 
                             activity.type === 'warning' ? '#f59e0b' : '#6366f1';
            
            item.innerHTML = `
                <div class="activity-icon" style="background: ${iconColor}20; color: ${iconColor};">
                    ${activity.icon}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    renderProductsTable() {
        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = '';
        
        this.data.products.forEach(product => {
            const row = document.createElement('tr');
            
            const statusClass = product.status === 'success' ? 'status-success' :
                               product.status === 'warning' ? 'status-warning' : 'status-error';
            
            const statusText = product.status === 'success' ? 'Active' :
                              product.status === 'warning' ? 'Review' : 'Issues';
            
            const growthColor = product.growth > 0 ? '#059669' : '#dc2626';
            const growthIcon = product.growth > 0 ? '↗' : '↘';
            
            row.innerHTML = `
                <td style="font-weight: 500;">${product.name}</td>
                <td>${this.formatCurrency(product.revenue)}</td>
                <td>${this.formatNumber(product.units)}</td>
                <td style="color: ${growthColor};">
                    <span>${growthIcon}</span> ${Math.abs(product.growth).toFixed(1)}%
                </td>
                <td>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </td>
                <td>
                    <button class="action-button primary">View Details</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    addNewActivity() {
        const newActivities = [
            {
                title: 'Data backup completed successfully',
                time: 'Just now',
                type: 'success',
                icon: '✅'
            },
            {
                title: 'New user registration spike detected',
                time: 'Just now',
                type: 'info',
                icon: '📈'
            },
            {
                title: 'System performance optimized',
                time: 'Just now',
                type: 'success',
                icon: '⚡'
            },
            {
                title: 'Monthly analytics report ready',
                time: 'Just now',
                type: 'info',
                icon: '📊'
            }
        ];
        
        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
        this.data.activities.unshift(randomActivity);
        
        // Keep only last 10 activities
        this.data.activities = this.data.activities.slice(0, 10);
        
        this.renderActivities();
    }

    setupNotifications() {
        // Show welcome notification after 2 seconds
        setTimeout(() => {
            this.showNotification('Welcome to GUNIC Enterprise', 'Dashboard loaded successfully with real-time data.');
        }, 2000);
    }

    showRandomNotification() {
        const notifications = [
            {
                title: 'Performance Alert',
                message: 'System performance is optimal. All services running smoothly.'
            },
            {
                title: 'Revenue Update',
                message: 'Monthly revenue target exceeded by 15%. Great performance!'
            },
            {
                title: 'User Engagement',
                message: 'User engagement increased by 23% this week.'
            },
            {
                title: 'System Health',
                message: 'All systems operational. Uptime: 99.9%'
            },
            {
                title: 'Data Insights',
                message: 'New business insights available in your analytics dashboard.'
            }
        ];
        
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        this.showNotification(notification.title, notification.message);
    }

    showNotification(title, message) {
        const notification = document.getElementById('notification');
        const titleElement = notification.querySelector('.notification-title');
        const messageElement = document.getElementById('notificationMessage');
        
        titleElement.textContent = title;
        messageElement.textContent = message;
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    new EnterpriseDashboard();
});

// Add some interactive features
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('action-button')) {
        e.target.textContent = 'Loading...';
        setTimeout(() => {
            e.target.textContent = 'View Details';
        }, 1000);
    }
});