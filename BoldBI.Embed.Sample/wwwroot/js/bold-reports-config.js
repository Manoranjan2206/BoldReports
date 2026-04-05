/**
 * Bold Reports Configuration
 * Update these settings to match your environment
 */

const BOLD_REPORTS_CONFIG = {
    // Bold Reports Server URL
    reportServiceUrl: "https://adhoc.boldreports.com/reporting/reportservice/api/Viewer",
    reportServerUrl: "https://adhoc.boldreports.com/reporting/api/site/reportsdemo",
    serviceAuthorizationToken: "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbm9yYW5qYW4ucmFqZW5kcmFuQHN5bmNmdXNpb24uY29tIiwibmFtZWlkIjoiNiIsInVuaXF1ZV9uYW1lIjoiYmFkMTViMDEtMjhmNy00ZWJmLTllYjctNjA3ZGRmNmI1YWFjIiwiSVAiOiIxMjcuMC4wLjEiLCJpc3N1ZWRfZGF0ZSI6IjE3NzUyOTg0ODkiLCJuYmYiOjE3NzUyOTg0ODksImV4cCI6MTc5ODc2MTYwMCwiaWF0IjoxNzc1Mjk4NDg5LCJpc3MiOiJodHRwczovL2FkaG9jLmJvbGRyZXBvcnRzLmNvbS9yZXBvcnRpbmcvc2l0ZS9yZXBvcnRzZGVtbyIsImF1ZCI6Imh0dHBzOi8vYWRob2MuYm9sZHJlcG9ydHMuY29tL3JlcG9ydGluZy9zaXRlL3JlcG9ydHNkZW1vIn0.XbveyHnGpZJQ6-cGJIm2C_j1ccF_lP_mIn0sTpRRB7Q",

    // Report Paths (relative to SSRS server)
    reportPaths: {
        projectListReport: '/Ecointeractive_POC/Project List Report',
        projectOverviewReport: "/Ecointeractive_POC/Project_Overview_Report",
        locationDetailsReport: "/Ecointeractive_POC/Location_Details_Report",
        fundingDetailsReport: "/Ecointeractive_POC/Funding_Detail_Report"
    },

    // Report Viewer Settings
    viewerSettings: {
        height: "100%",
        width: "100%",
        minHeight: "400px"
    },

    // Validation method
    validate: function() {
        const errors = [];

        if (!this.reportServiceUrl) {
            errors.push('reportServiceUrl is not configured');
        }
        if (!this.reportServerUrl) {
            errors.push('reportServerUrl is not configured');
        }
        if (!this.serviceAuthorizationToken) {
            errors.push('serviceAuthorizationToken is not configured');
        }

        if (errors.length > 0) {
            console.error('[BoldReportsConfig] Configuration errors:', errors);
            return false;
        }

        console.log('[BoldReportsConfig] Configuration validated successfully');
        return true;
    }
};
