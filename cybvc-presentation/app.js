// Presentation Controller
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        this.progressBar = document.getElementById('progressBar');
        this.charts = {};
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.updateProgressBar();
        
        // Add event listeners with proper binding
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.previousSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Wait for Chart.js to load
        this.waitForChartJS();
        
        // Add touch/swipe support
        this.initTouchControls();
        
        // Add modal functionality
        this.initModals();
        
        // Initialize first slide charts if needed
        setTimeout(() => {
            if (this.currentSlide === 5) this.createTrendsChart();
            if (this.currentSlide === 6) this.createMetricsChart();
            if (this.currentSlide === 10) this.createFinancialsChart();
        }, 1000);
    }
    
    waitForChartJS() {
        if (typeof Chart !== 'undefined') {
            Chart.defaults.color = '#ffffff';
            Chart.defaults.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            Chart.defaults.font.family = "'FKGroteskNeue', 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
            console.log('Chart.js готов к использованию');
        } else {
            setTimeout(() => this.waitForChartJS(), 100);
        }
    }
    
    showSlide(slideNumber) {
        console.log(`Переход на слайд ${slideNumber}`);
        
        // Remove active class from all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Add active class to target slide
        const targetSlide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (targetSlide) {
            targetSlide.classList.add('active');
            this.currentSlide = slideNumber;
            this.updateSlideCounter();
            this.updateNavigationButtons();
            this.updateProgressBar();
            
            // Initialize charts based on slide with delay for animation
            setTimeout(() => {
                switch(slideNumber) {
                    case 5:
                        this.createTrendsChart();
                        break;
                    case 6:
                        this.createMetricsChart();
                        break;
                    case 10:
                        this.createFinancialsChart();
                        break;
                }
            }, 600);
        }
    }
    
    nextSlide() {
        console.log(`Попытка перехода вперед с слайда ${this.currentSlide}`);
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        console.log(`Попытка перехода назад с слайда ${this.currentSlide}`);
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
        }
        if (this.totalSlidesSpan) {
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.currentSlide === 1;
        }
        if (this.nextBtn) {
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }
    
    updateProgressBar() {
        if (this.progressBar) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            this.progressBar.style.width = progress + '%';
        }
    }
    
    createTrendsChart() {
        const canvas = document.getElementById('trendsChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Trends chart: Canvas не найден или Chart.js не загружен');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.trends) {
            this.charts.trends.destroy();
        }
        
        const trendsData = {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025 (прогноз)'],
            datasets: [{
                label: 'AI инвестиции (млрд $)',
                data: [40, 52, 65, 78, 110, 150],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1FB8CD',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        };
        
        const config = {
            type: 'line',
            data: trendsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Рост AI инвестиций по годам',
                        color: '#ffffff',
                        font: { size: 18, weight: 'bold' },
                        padding: { bottom: 30 }
                    },
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffffff',
                            font: { size: 14 },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 2,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.y + 'B';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { 
                            color: '#ffffff', 
                            font: { size: 12 },
                            callback: function(value) {
                                return '$' + value + 'B';
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        };
        
        try {
            this.charts.trends = new Chart(ctx, config);
            console.log('Trends chart создан успешно');
        } catch (error) {
            console.error('Ошибка создания trends chart:', error);
        }
    }
    
    createMetricsChart() {
        const canvas = document.getElementById('metricsChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Metrics chart: Canvas не найден или Chart.js не загружен');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.metrics) {
            this.charts.metrics.destroy();
        }
        
        const metricsData = {
            labels: ['IRR (%)', 'Seed Success (%)', 'Time to Series A (мес)', 'Success Rate (%)'],
            datasets: [
                {
                    label: 'Venture Studios',
                    data: [60, 84, 25.2, 70],
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                },
                {
                    label: 'Traditional VC',
                    data: [21, 50, 56, 40],
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185',
                    borderWidth: 1,
                    borderRadius: 6,
                    borderSkipped: false,
                }
            ]
        };
        
        const config = {
            type: 'bar',
            data: metricsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Сравнение ключевых метрик',
                        color: '#ffffff',
                        font: { size: 18, weight: 'bold' },
                        padding: { bottom: 30 }
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: '#ffffff',
                            font: { size: 14 },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#1FB8CD',
                        borderWidth: 2,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        ticks: { 
                            color: '#ffffff', 
                            font: { size: 12 },
                            maxRotation: 45
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            color: '#ffffff', 
                            font: { size: 12 }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                },
                animation: {
                    duration: 2000,
                    delay: (context) => context.dataIndex * 200
                }
            }
        };
        
        try {
            this.charts.metrics = new Chart(ctx, config);
            console.log('Metrics chart создан успешно');
        } catch (error) {
            console.error('Ошибка создания metrics chart:', error);
        }
    }
    
    createFinancialsChart() {
        const canvas = document.getElementById('financialsChart');
        if (!canvas || typeof Chart === 'undefined') {
            console.log('Financials chart: Canvas не найден или Chart.js не загружен');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        if (this.charts.financials) {
            this.charts.financials.destroy();
        }
        
        const financialsData = {
            labels: ['2025', '2026', '2027'],
            datasets: [
                {
                    label: 'Размер фонда (млн $)',
                    data: [25, 65, 100],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Целевой IRR (%)',
                    data: [25, 27, 30],
                    borderColor: '#00d2ff',
                    backgroundColor: 'rgba(0, 210, 255, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        };
        
        const config = {
            type: 'line',
            data: financialsData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Финансовые прогнозы',
                        color: '#ffffff',
                        font: { size: 18, weight: 'bold' },
                        padding: { bottom: 30 }
                    },
                    legend: {
                        display: true,
                        labels: {
                            color: '#ffffff',
                            font: { size: 14 },
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#667eea',
                        borderWidth: 2,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#ffffff', font: { size: 12 } },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: { 
                            color: '#667eea', 
                            font: { size: 12 },
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: { 
                            color: '#00d2ff', 
                            font: { size: 12 },
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: { drawOnChartArea: false }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        };
        
        try {
            this.charts.financials = new Chart(ctx, config);
            console.log('Financials chart создан успешно');
        } catch (error) {
            console.error('Ошибка создания financials chart:', error);
        }
    }
    
    initTouchControls() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        this.handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        };
    }
    
    initModals() {
        // Add click handlers for interactive elements that could show more info
        const interactiveElements = document.querySelectorAll('.summary-item, .advantage-item, .team-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showModal(e.currentTarget);
            });
        });
    }
    
    showModal(element) {
        // Get element type and content
        let title = 'Дополнительная информация';
        let content = 'Подробная информация об этом элементе будет доступна в полной версии презентации.';
        
        if (element.classList.contains('summary-item')) {
            title = 'Ключевые показатели рынка';
            content = 'Эти данные основаны на исследованиях ведущих аналитических агентств и отражают текущие тренды в венчурном инвестировании и AI индустрии.';
        } else if (element.classList.contains('advantage-item')) {
            title = 'Конкурентное преимущество';
            content = 'Наши технологические решения позволяют автоматизировать процессы, которые традиционно требуют больших временных затрат и человеческих ресурсов.';
        } else if (element.classList.contains('team-card')) {
            title = 'Команда экспертов';
            content = 'Наша команда объединяет опыт успешных предпринимателей, инвесторов и технических экспертов с глубокими знаниями в области AI и венчурного инвестирования.';
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        // Add modal styles if not already added
        if (!document.getElementById('modal-styles')) {
            const modalStyles = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                    animation: modalFadeIn 0.3s ease;
                }
                .modal-content {
                    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                    border: 1px solid rgba(102, 126, 234, 0.3);
                    border-radius: 12px;
                    padding: 24px;
                    max-width: 500px;
                    width: 90%;
                    color: #ffffff;
                    backdrop-filter: blur(10px);
                    animation: modalSlideIn 0.3s ease;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }
                .modal-header h3 {
                    color: #667eea;
                    margin: 0;
                    font-size: 1.25rem;
                }
                .modal-close {
                    background: none;
                    border: none;
                    color: #ffffff;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }
                .modal-close:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .modal-body p {
                    margin: 0;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.8);
                }
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from { transform: translateY(-20px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.id = 'modal-styles';
            styleSheet.textContent = modalStyles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(modal);
        
        // Close modal handlers
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeIn 0.3s ease reverse';
            setTimeout(() => {
                if (document.body.contains(modal)) {
                    document.body.removeChild(modal);
                }
            }, 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
        });
        
        // Close on ESC
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                modal.style.animation = 'modalFadeIn 0.3s ease reverse';
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
                document.removeEventListener('keydown', handleEsc);
            }
        };
        document.addEventListener('keydown', handleEsc);
    }
    
    // Method to jump to specific slide
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.showSlide(slideNumber);
        }
    }
}

// Additional utility functions
class PresentationUtils {
    static addHoverEffects() {
        const interactiveElements = document.querySelectorAll('.summary-item, .problem-item, .advantage-item, .team-card, .step-item, .tech-layer');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                if (!this.style.transform.includes('scale')) {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    static addParticleEffect() {
        // Create subtle particle animation for title slide
        const titleSlide = document.querySelector('[data-slide="1"]');
        if (!titleSlide) return;
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 1;
        `;
        
        // Create particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(102, 126, 234, 0.6);
                border-radius: 50%;
                animation: float ${5 + Math.random() * 10}s infinite linear;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }
        
        // Add floating animation
        const floatKeyframes = `
            @keyframes float {
                0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-20px) rotate(360deg); opacity: 0; }
            }
        `;
        
        if (!document.getElementById('particle-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'particle-styles';
            styleSheet.textContent = floatKeyframes;
            document.head.appendChild(styleSheet);
        }
        
        titleSlide.appendChild(particleContainer);
    }
    
    static addKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Don't interfere with navigation if already handled
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                return; // Let the main controller handle this
            }
            
            // Fullscreen toggle
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log('Fullscreen не доступен:', err);
                    });
                } else {
                    document.exitFullscreen();
                }
            }
            
            // Home - go to first slide
            if (e.key === 'Home') {
                e.preventDefault();
                window.presentation.goToSlide(1);
            }
            
            // End - go to last slide
            if (e.key === 'End') {
                e.preventDefault();
                window.presentation.goToSlide(window.presentation.totalSlides);
            }
            
            // Number keys for direct slide navigation
            if (e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const slideNumber = parseInt(e.key);
                if (slideNumber <= window.presentation.totalSlides) {
                    window.presentation.goToSlide(slideNumber);
                }
            }
        });
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация CybVC презентации...');
    
    // Initialize the main presentation controller
    const presentation = new PresentationController();
    
    // Add utility enhancements
    PresentationUtils.addHoverEffects();
    PresentationUtils.addParticleEffect();
    PresentationUtils.addKeyboardShortcuts();
    
    // Make presentation controller available globally
    window.presentation = presentation;
    
    // Add CTA button functionality
    const ctaButton = document.querySelector('.cta-button .btn');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            this.textContent = 'Отправляем запрос...';
            this.disabled = true;
            
            setTimeout(() => {
                alert('Спасибо за интерес к CybVC! Мы свяжемся с вами в ближайшее время для обсуждения возможностей сотрудничества.');
                this.textContent = 'Запланировать встречу';
                this.disabled = false;
            }, 2000);
        });
    }
    
    // Add loading completion
    setTimeout(() => {
        document.body.classList.add('loaded');
        console.log('✅ CybVC Presentation загружена успешно!');
    }, 500);
    
    // Console info for presenter
    console.log('📋 Keyboard shortcuts:');
    console.log('← → : Навигация по слайдам');
    console.log('F : Полноэкранный режим');
    console.log('Home/End : Первый/Последний слайд');
    console.log('1-9 : Переход к конкретному слайду');
    console.log('Click: Интерактивные элементы для доп. информации');
});