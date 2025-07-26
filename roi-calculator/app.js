// Get all input elements
const monthlyProspectsInput = document.getElementById('monthly-prospects');
const openRateInput = document.getElementById('open-rate');
const replyRateInput = document.getElementById('reply-rate');
const meetingBookingRateInput = document.getElementById('meeting-booking-rate');
const meetingToOpportunityInput = document.getElementById('meeting-to-opportunity');
const opportunityCloseRateInput = document.getElementById('opportunity-close-rate');
const averageDealSizeInput = document.getElementById('average-deal-size');
const monthlyCostsInput = document.getElementById('monthly-costs');

// Get all display elements
const openRateValue = document.getElementById('open-rate-value');
const replyRateValue = document.getElementById('reply-rate-value');
const meetingBookingRateValue = document.getElementById('meeting-booking-rate-value');
const meetingToOpportunityValue = document.getElementById('meeting-to-opportunity-value');
const opportunityCloseRateValue = document.getElementById('opportunity-close-rate-value');

// Get all result elements
const monthlyMeetingsDisplay = document.getElementById('monthly-meetings');
const monthlyOpportunitiesDisplay = document.getElementById('monthly-opportunities');
const monthlyDealsDisplay = document.getElementById('monthly-deals');
const monthlyRevenueDisplay = document.getElementById('monthly-revenue');
const monthlyRoiDisplay = document.getElementById('monthly-roi-display');
const roiMultiplierDisplay = document.getElementById('roi-multiplier');
const annualRevenueDisplay = document.getElementById('annual-revenue');
const annualCostsDisplay = document.getElementById('annual-costs');
const annualRoiDisplay = document.getElementById('annual-roi');
const costPerAcquisitionDisplay = document.getElementById('cost-per-acquisition');

// ROI highlight container
const roiHighlight = document.querySelector('.roi-highlight');
const roiPercentage = document.querySelector('.roi-percentage');

// Utility functions
function formatCurrency(amount) {
    if (amount === 0) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Math.round(amount));
}

function formatNumber(number) {
    if (number === 0) return '0';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(number);
}

function formatPercentage(percentage) {
    if (percentage === 0) return '0%';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
    }).format(percentage) + '%';
}

// Update slider value displays
function updateSliderValues() {
    openRateValue.textContent = openRateInput.value + '%';
    replyRateValue.textContent = replyRateInput.value + '%';
    meetingBookingRateValue.textContent = meetingBookingRateInput.value + '%';
    meetingToOpportunityValue.textContent = meetingToOpportunityInput.value + '%';
    opportunityCloseRateValue.textContent = opportunityCloseRateInput.value + '%';
}

// Main calculation function
function calculateROI() {
    // Get input values with fallbacks
    const monthlyProspects = Math.max(0, parseFloat(monthlyProspectsInput.value) || 0);
    const openRate = Math.max(0, parseFloat(openRateInput.value) || 0);
    const replyRate = Math.max(0, parseFloat(replyRateInput.value) || 0);
    const meetingBookingRate = Math.max(0, parseFloat(meetingBookingRateInput.value) || 0);
    const meetingToOpportunity = Math.max(0, parseFloat(meetingToOpportunityInput.value) || 0);
    const opportunityCloseRate = Math.max(0, parseFloat(opportunityCloseRateInput.value) || 0);
    const averageDealSize = Math.max(0, parseFloat(averageDealSizeInput.value) || 0);
    const monthlyCosts = Math.max(0, parseFloat(monthlyCostsInput.value) || 0);

    // Calculate metrics step by step
    const monthlyMeetings = monthlyProspects * (openRate / 100) * (replyRate / 100) * (meetingBookingRate / 100);
    const monthlyOpportunities = monthlyMeetings * (meetingToOpportunity / 100);
    const monthlyDeals = monthlyOpportunities * (opportunityCloseRate / 100);
    const monthlyRevenue = monthlyDeals * averageDealSize;
    
    // Calculate ROI
    const monthlyROI = monthlyCosts > 0 ? ((monthlyRevenue - monthlyCosts) / monthlyCosts) * 100 : 0;
    const roiMultiplier = monthlyCosts > 0 ? (monthlyRevenue / monthlyCosts) : 0;
    
    // Calculate annual projections
    const annualRevenue = monthlyRevenue * 12;
    const annualCosts = monthlyCosts * 12;
    const annualROI = annualCosts > 0 ? ((annualRevenue - annualCosts) / annualCosts) * 100 : 0;
    
    // Calculate cost per acquisition
    const costPerAcquisition = monthlyDeals > 0 ? monthlyCosts / monthlyDeals : 0;

    // Update all displays
    monthlyMeetingsDisplay.textContent = formatNumber(monthlyMeetings);
    monthlyOpportunitiesDisplay.textContent = formatNumber(monthlyOpportunities);
    monthlyDealsDisplay.textContent = formatNumber(monthlyDeals);
    monthlyRevenueDisplay.textContent = formatCurrency(monthlyRevenue);
    monthlyRoiDisplay.textContent = formatPercentage(monthlyROI);
    roiMultiplierDisplay.textContent = formatNumber(roiMultiplier) + 'x возврат';
    
    annualRevenueDisplay.textContent = formatCurrency(annualRevenue);
    annualCostsDisplay.textContent = formatCurrency(annualCosts);
    annualRoiDisplay.textContent = formatPercentage(annualROI);
    costPerAcquisitionDisplay.textContent = monthlyDeals > 0 ? formatCurrency(costPerAcquisition) : '$0';

    // Update ROI visual indicators
    if (monthlyROI >= 0) {
        roiHighlight.classList.remove('negative');
        roiPercentage.classList.remove('negative');
    } else {
        roiHighlight.classList.add('negative');
        roiPercentage.classList.add('negative');
    }
}

// Validate inputs
function validateNumberInput(input, min = 0, max = Infinity) {
    let value = parseFloat(input.value);
    if (isNaN(value) || value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    }
}

// Handle input changes with immediate updates
function handleInputChange(callback) {
    if (callback) callback();
    updateSliderValues();
    calculateROI();
}

// Add event listeners for real-time updates
function addEventListeners() {
    // Slider inputs - multiple events for maximum responsiveness
    const sliders = [openRateInput, replyRateInput, meetingBookingRateInput, 
                    meetingToOpportunityInput, opportunityCloseRateInput];
    
    sliders.forEach(slider => {
        slider.addEventListener('input', () => handleInputChange());
        slider.addEventListener('change', () => handleInputChange());
        slider.addEventListener('mousemove', () => {
            if (slider === document.activeElement) {
                handleInputChange();
            }
        });
    });

    // Number inputs - multiple events for immediate updates
    const numberInputs = [monthlyProspectsInput, averageDealSizeInput, monthlyCostsInput];
    
    numberInputs.forEach(input => {
        // Real-time updates as user types
        input.addEventListener('input', () => {
            validateNumberInput(input, 0);
            handleInputChange();
        });
        
        input.addEventListener('change', () => {
            validateNumberInput(input, 0);
            handleInputChange();
        });
        
        input.addEventListener('keyup', () => {
            validateNumberInput(input, 0);
            handleInputChange();
        });
        
        input.addEventListener('blur', () => {
            validateNumberInput(input, 0);
            handleInputChange();
        });

        // Prevent invalid characters
        input.addEventListener('keydown', (e) => {
            // Allow: backspace, delete, tab, escape, enter, period for decimals
            if ([8, 9, 27, 13, 46].includes(e.keyCode) ||
                // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) ||
                // Allow home, end, left, right arrows
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            // Ensure that it's a number
            if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });

        // Handle paste events
        input.addEventListener('paste', (e) => {
            setTimeout(() => {
                validateNumberInput(input, 0);
                handleInputChange();
            }, 0);
        });
    });
}

// Initialize the calculator
function init() {
    // Set initial values if not already set
    if (!monthlyProspectsInput.value) monthlyProspectsInput.value = '1000';
    if (!averageDealSizeInput.value) averageDealSizeInput.value = '5000';
    if (!monthlyCostsInput.value) monthlyCostsInput.value = '2000';
    
    // Update displays and calculate
    updateSliderValues();
    calculateROI();
    
    // Add event listeners
    addEventListeners();
    
    console.log('ROI Calculator initialized successfully');
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}