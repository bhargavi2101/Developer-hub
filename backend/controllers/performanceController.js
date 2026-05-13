const performanceService = require('../services/performanceService');

// Get performance metrics
const getPerformanceMetrics = async (req, res) => {
  try {
    const metrics = performanceService.performanceMonitor.getMetrics();

    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get performance metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get performance metrics'
    });
  }
};

// Log custom performance event
const logPerformanceEvent = async (req, res) => {
  try {
    const { eventType, eventData, duration, metadata } = req.body;

    // Log performance event
    console.log('Performance Event:', {
      eventType,
      eventData,
      duration,
      metadata,
      timestamp: new Date().toISOString()
    });

    // Store in database (implement as needed)
    // For now, just log to console

    res.json({
      success: true,
      message: 'Performance event logged'
    });
  } catch (error) {
    console.error('Log performance event error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log performance event'
    });
  }
};

// Get system performance report
const getPerformanceReport = async (req, res) => {
  try {
    const { period = '24h' } = req.query;

    // Get current metrics
    const currentMetrics = performanceService.performanceMonitor.getMetrics();

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(currentMetrics);

    // Generate recommendations
    const recommendations = generatePerformanceRecommendations(currentMetrics);

    res.json({
      success: true,
      report: {
        period,
        timestamp: new Date().toISOString(),
        metrics: currentMetrics,
        score: performanceScore,
        recommendations,
        grade: getPerformanceGrade(performanceScore)
      }
    });
  } catch (error) {
    console.error('Get performance report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get performance report'
    });
  }
};

// Calculate performance score (0-100)
function calculatePerformanceScore(metrics) {
  let score = 100;

  // Page load time (ideal: <2s)
  if (metrics.pageLoadTime > 2000) {
    score -= Math.min(30, (metrics.pageLoadTime - 2000) / 100);
  }

  // First Contentful Paint (ideal: <1s)
  if (metrics.firstContentfulPaint > 1000) {
    score -= Math.min(20, (metrics.firstContentfulPaint - 1000) / 50);
  }

  // Cumulative Layout Shift (ideal: <0.1)
  if (metrics.cumulativeLayoutShift > 0.1) {
    score -= Math.min(15, (metrics.cumulativeLayoutShift - 0.1) * 100);
  }

  // First Input Delay (ideal: <100ms)
  if (metrics.firstInputDelay > 100) {
    score -= Math.min(15, (metrics.firstInputDelay - 100) / 10);
  }

  return Math.max(0, Math.round(score));
}

// Generate performance recommendations
function generatePerformanceRecommendations(metrics) {
  const recommendations = [];

  // Page load recommendations
  if (metrics.pageLoadTime > 3000) {
    recommendations.push({
      category: 'Page Load',
      severity: 'high',
      title: 'Slow Page Load Time',
      description: 'Page takes more than 3 seconds to load',
      action: 'Optimize bundle size, enable lazy loading, reduce server response time'
    });
  } else if (metrics.pageLoadTime > 2000) {
    recommendations.push({
      category: 'Page Load',
      severity: 'medium',
      title: 'Moderate Page Load Time',
      description: 'Page takes more than 2 seconds to load',
      action: 'Consider code splitting and lazy loading'
    });
  }

  // FCP recommendations
  if (metrics.firstContentfulPaint > 1500) {
    recommendations.push({
      category: 'Rendering',
      severity: 'high',
      title: 'Slow First Contentful Paint',
      description: 'First contentful paint takes more than 1.5 seconds',
      action: 'Optimize critical CSS, reduce render-blocking resources, enable compression'
    });
  }

  // CLS recommendations
  if (metrics.cumulativeLayoutShift > 0.25) {
    recommendations.push({
      category: 'Layout Stability',
      severity: 'high',
      title: 'Poor Layout Stability',
      description: 'Significant layout shifts detected',
      action: 'Reserve space for dynamic content, use CSS transforms instead of animations'
    });
  } else if (metrics.cumulativeLayoutShift > 0.1) {
    recommendations.push({
      category: 'Layout Stability',
      severity: 'medium',
      title: 'Moderate Layout Shifts',
      description: 'Noticeable layout shifts detected',
      action: 'Optimize image dimensions, prevent layout shifts'
    });
  }

  // FID recommendations
  if (metrics.firstInputDelay > 300) {
    recommendations.push({
      category: 'Interactivity',
      severity: 'high',
      title: 'Poor Input Responsiveness',
      description: 'First input delay exceeds 300ms',
      action: 'Reduce JavaScript execution time, optimize event handlers, use web workers'
    });
  }

  return recommendations;
}

// Get performance grade
function getPerformanceGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

module.exports = {
  getPerformanceMetrics,
  logPerformanceEvent,
  getPerformanceReport
};