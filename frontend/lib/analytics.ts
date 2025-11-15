interface AnalyticsEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  metadata?: Record<string, string | number | boolean>;
}

export const trackEvent = (event: AnalyticsEvent) => {
  // Your analytics implementation
  // Your analytics implementation (Google Analytics, Mixpanel, etc.)
  // if (typeof window !== 'undefined' && window.gtag) {
  //   window.gtag('event', event.event_name, {
  //     event_category: event.event_category,
  //     event_label: event.event_label,
  //     value: event.value,
  //     ...event.metadata,
  //   });
  // }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', event);
  }
};

// Analytics events summary for data export/import feature
//============================================================
//            data export/import feature
//============================================================

export const DATA_EXPORT_IMPORT_EVENTS = {
  // Page events
  PAGE_VIEWED: 'data_management_page_viewed',
  GUIDE_OPENED: 'data_export_guide_opened',

  // Export events
  EXPORT_INITIATED: 'data_export_initiated',
  EXPORT_SUCCESS: 'data_export_success',
  EXPORT_FAILED: 'data_export_failed',
  EXPORT_PERFORMANCE: 'export_performance',
  EXPORT_API_ERROR: 'export_api_error',
  EXPORT_OPTION_CHANGED: 'export_option_changed',

  // Import events
  IMPORT_FILE_SELECTED: 'import_file_selected',
  IMPORT_FILE_VALIDATED: 'import_file_validated',
  IMPORT_VALIDATION_FAILED: 'import_validation_failed',
  IMPORT_FILE_PARSE_ERROR: 'import_file_parse_error',
  IMPORT_FILE_REMOVED: 'import_file_removed',
  IMPORT_INITIATED: 'data_import_initiated',
  IMPORT_SUCCESS: 'data_import_success',
  IMPORT_FAILED: 'data_import_failed',
  IMPORT_EXCEPTION: 'data_import_exception',
  IMPORT_PERFORMANCE: 'import_performance',
  IMPORT_API_ERROR: 'import_api_error',
  IMPORT_WARNING: 'import_warning',
} as const;
// Example dashboard queries for analytics
// These can be used in your analytics platform (GA4, Mixpanel, etc.)

/*
KEY METRICS TO TRACK:

1. Export Usage
   - Total exports per month
   - Average file size
   - Include completions rate (%)
   - Include settings rate (%)
   - Export success rate (%)

2. Import Usage
   - Total imports per month
   - Average habits imported per user
   - Duplicate skip rate (%)
   - Import success rate (%)
   - Average import duration (ms)

3. User Behavior
   - Users who export (%)
   - Users who import (%)
   - Users who do both (account migration indicator)
   - Time between export and import (migration speed)

4. Error Tracking
   - Export failure rate
   - Import validation failures
   - Parse errors
   - API errors by status code

5. GDPR Compliance Metrics
   - Export requests per month (compliance indicator)
   - Average time to export (should be < 1 minute)
   - Export accessibility (should be 100% success rate)

EXAMPLE QUERIES (for Google Analytics 4):

// Export success rate
events
| where event_name == "data_export_success" or event_name == "data_export_failed"
| summarize
    total = count(),
    success = countif(event_name == "data_export_success"),
    success_rate = (countif(event_name == "data_export_success") * 100.0) / count()

// Average import performance
events
| where event_name == "import_performance"
| summarize
    avg_duration_ms = avg(value),
    p50_duration_ms = percentile(value, 50),
    p95_duration_ms = percentile(value, 95)

// Most common import warnings
events
| where event_name == "import_warning"
| summarize count() by event_label
| order by count_ desc

// User migration patterns (export -> import same day)
events
| where event_name in ("data_export_success", "data_import_success")
| summarize
    exports = countif(event_name == "data_export_success"),
    imports = countif(event_name == "data_import_success")
    by user_id, bin(timestamp, 1d)
| where exports > 0 and imports > 0
| count
*/
