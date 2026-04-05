/**
 * Bold Reports Viewer - Main Script
 * Handles tab switching and report loading with parameters
 */

class BoldReportsViewer {
    constructor() {
        this.currentTabIndex = 0;
        this.loadedReports = new Set();
        this.selectedParameters = {};
        this.loaderElement = document.querySelector('.report-loader');
        
        console.log('[BoldReportsViewer] Initializing...');
        this.init();
    }

    init() {
        console.log('[BoldReportsViewer] Initialization starting...');
        
        // Initialize parameters panel FIRST (just UI setup)
        this.initializeParametersPanel();
        
        // Attach event listeners
        this.attachTabListeners();
        this.attachParameterListeners();
        this.attachButtonListeners();
        
        console.log('[BoldReportsViewer] Event listeners attached');
        
        // Now wait for SDK and load first report
        this.waitForSDK();
    }

    waitForSDK() {
        if (typeof jQuery !== 'undefined' && typeof BoldReports !== 'undefined' && typeof $('#viewer-0').boldReportViewer !== 'undefined') {
            console.log('[BoldReportsViewer] Bold Reports SDK loaded ✓');
            // Load first report immediately
            setTimeout(() => {
                this.loadReport(0);
                setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
            }, 500);
        } else {
            console.log('[BoldReportsViewer] Waiting for Bold Reports SDK...');
            setTimeout(() => this.waitForSDK(), 300);
        }
    }

    attachTabListeners() {
        document.querySelectorAll('.tab-button').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const reportIndex = parseInt(btn.getAttribute('data-report'));
                console.log(`[BoldReportsViewer] Tab ${reportIndex} clicked`);
                this.switchTab(reportIndex);
            });
        });
    }

    attachParameterListeners() {
        // These will be attached dynamically when parameters are created
        document.addEventListener('parameterChanged', (e) => {
            console.log('[BoldReportsViewer] Parameter changed:', e.detail);
        });
    }

    attachButtonListeners() {
        // Apply Parameters button
        document.getElementById('btn-apply-params')?.addEventListener('click', () => {
            console.log('[BoldReportsViewer] Apply Parameters clicked');
            this.applyParametersToAllReports();
        });

        // Reset button
        document.getElementById('btn-reset-params')?.addEventListener('click', () => {
            console.log('[BoldReportsViewer] Reset clicked');
            this.resetParameters();
        });

        // Refresh button
        document.querySelector('.btn-refresh')?.addEventListener('click', () => {
            console.log('[BoldReportsViewer] Refresh clicked');
            this.refreshCurrentReport();
        });
    }

    switchTab(reportIndex) {
        if (reportIndex === this.currentTabIndex) {
            return; // Already on this tab
        }

        this.currentTabIndex = reportIndex;

        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach((btn) => {
            const btnIndex = parseInt(btn.getAttribute('data-report'));
            if (btnIndex === reportIndex) {
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            }
        });

        // Update report tabs
        document.querySelectorAll('.report-tab').forEach((tab) => {
            const tabIndex = parseInt(tab.getAttribute('data-report-index'));
            if (tabIndex === reportIndex) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Load report if not loaded
        if (!this.isReportLoaded(reportIndex)) {
            this.loadReport(reportIndex);
        } else {
            // Trigger resize for the viewer control so it repaints
            const viewerElement = $(`#viewer-${reportIndex}`);
            const viewerControl = viewerElement.data('boldReportViewer');
            if (viewerControl && typeof viewerControl.resize === 'function') {
                setTimeout(() => viewerControl.resize(), 100);
            } else {
                setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
            }
        }
    }

    destroyViewer(reportIndex) {
        try {
            const viewerElement = $(`#viewer-${reportIndex}`);
            if (viewerElement.length === 0) {
                return;
            }

            const viewerControl = viewerElement.data('boldReportViewer');
            if (viewerControl) {
                console.log(`[BoldReportsViewer] Destroying viewer ${reportIndex}`);
                // Clear cache
                if (viewerControl.clearReportCache) {
                    viewerControl.clearReportCache();
                    console.log(`[BoldReportsViewer] Report cache cleared for viewer ${reportIndex}`);
                }
                // Destroy viewer
                if (viewerControl.destroy) {
                    viewerControl.destroy();
                    console.log(`[BoldReportsViewer] Viewer ${reportIndex} destroyed`);
                }
            }

            // Remove from loaded reports
            this.loadedReports.delete(reportIndex);
        } catch (error) {
            console.warn(`[BoldReportsViewer] Error destroying viewer ${reportIndex}:`, error);
        }
    }

    // Check if a report viewer exists and is loaded
    isReportLoaded(reportIndex) {
        try {
            const viewerElement = $(`#viewer-${reportIndex}`);
            if (viewerElement.length === 0) {
                return false;
            }
            const viewerControl = viewerElement.data('boldReportViewer');
            return viewerControl !== undefined && viewerControl !== null;
        } catch (error) {
            return false;
        }
    }

    // Get all currently loaded reports (by checking if they exist)
    getLoadedReports() {
        const loaded = [];
        for (let i = 0; i < 4; i++) {
            if (this.isReportLoaded(i)) {
                loaded.push(i);
            }
        }
        console.log(`[BoldReportsViewer] Currently loaded reports:`, loaded);
        return loaded;
    }

    loadReport(reportIndex) {
        // Don't load if already loaded
        if (this.isReportLoaded(reportIndex)) {
            console.log(`[BoldReportsViewer] Report ${reportIndex} already loaded`);
            return;
        }

        try {
            this.showLoader();

            // Validate configuration
            if (!this.validateConfig()) {
                console.error('[BoldReportsViewer] Configuration validation failed');
                this.hideLoader();
                return;
            }

            // Get report data
            if (typeof REPORTS === 'undefined' || !REPORTS[reportIndex]) {
                console.error(`[BoldReportsViewer] Report ${reportIndex} not found in REPORTS array`);
                this.hideLoader();
                return;
            }

            const report = REPORTS[reportIndex];
            const viewerElement = $(`#viewer-${reportIndex}`);

            if (viewerElement.length === 0) {
                console.error(`[BoldReportsViewer] Viewer element #viewer-${reportIndex} not found in DOM`);
                this.hideLoader();
                return;
            }

            // Build parameters array
            const parameters = this.buildParameters();

            console.log(`[BoldReportsViewer] Loading report ${reportIndex}: ${report.name}`);
            console.log(`[BoldReportsViewer] Report path: ${report.path}`);
            console.log(`[BoldReportsViewer] Parameters to send:`, parameters);

            // Create the viewer
            viewerElement.boldReportViewer({
                reportServiceUrl: BOLD_REPORTS_CONFIG.reportServiceUrl,
                reportServerUrl: BOLD_REPORTS_CONFIG.reportServerUrl,
                serviceAuthorizationToken: BOLD_REPORTS_CONFIG.serviceAuthorizationToken,
                reportPath: report.path,
                parameters: parameters,
                height: "100%",
                width: "100%",
                // Event handlers
                reportLoad: (args) => {
                    console.log(`[BoldReportsViewer] Report ${reportIndex} loaded successfully`, args);
                    this.loadedReports.add(reportIndex);
                },
                renderingComplete: (args) => {
                    console.log(`[BoldReportsViewer] Report ${reportIndex} rendering complete`, args);
                    this.hideLoader();
                },
                error: (args) => {
                    console.error(`[BoldReportsViewer] Report ${reportIndex} error:`, args);
                    this.hideLoader();
                }
            });

            console.log(`[BoldReportsViewer] Viewer created for report ${reportIndex}`);

        } catch (error) {
            console.error(`[BoldReportsViewer] Error loading report ${reportIndex}:`, error);
            console.error('[BoldReportsViewer] Stack trace:', error.stack);
            this.hideLoader();
        }
    }

    validateConfig() {
        if (typeof BOLD_REPORTS_CONFIG === 'undefined') {
            console.error('[BoldReportsViewer] BOLD_REPORTS_CONFIG not defined');
            return false;
        }

        if (!BOLD_REPORTS_CONFIG.reportServiceUrl) {
            console.error('[BoldReportsViewer] reportServiceUrl not configured');
            return false;
        }

        if (!BOLD_REPORTS_CONFIG.reportServerUrl) {
            console.error('[BoldReportsViewer] reportServerUrl not configured');
            return false;
        }

        if (!BOLD_REPORTS_CONFIG.serviceAuthorizationToken) {
            console.error('[BoldReportsViewer] serviceAuthorizationToken not configured');
            return false;
        }

        console.log('[BoldReportsViewer] Configuration validated ✓');
        return true;
    }

    buildParameters() {
        const parameters = [];

        if (typeof PARAMETERS_DATA === 'undefined') {
            console.warn('[BoldReportsViewer] PARAMETERS_DATA not available, returning empty parameters');
            return parameters;
        }

        // Get selected values from parameter panel
        document.querySelectorAll('.parameter-item').forEach((item) => {
            const paramLabel = item.querySelector('.parameter-label');
            const paramName = paramLabel?.getAttribute('data-param-name') || '';
            const checkboxes = item.querySelectorAll('input[type="checkbox"]:checked');
            const selectedValues = Array.from(checkboxes).map(cb => cb.value);

            if (selectedValues.length > 0) {
                parameters.push({
                    name: paramName,
                    labels: selectedValues,
                    values: selectedValues
                });

                console.log(`[BoldReportsViewer] Parameter "${paramName}": ${selectedValues.length} values selected`, selectedValues);
            }
        });

        console.log(`[BoldReportsViewer] Total parameters to send: ${parameters.length}`, parameters);
        return parameters;
    }

    applyParametersToAllReports() {
        console.log('[BoldReportsViewer] Applying parameters to all loaded reports');
        const parameters = this.buildParameters();
        
        // Get currently loaded reports by checking if they exist
        const loadedReports = this.getLoadedReports();
        console.log(`[BoldReportsViewer] Found ${loadedReports.length} loaded reports to refresh`);

        if (loadedReports.length === 0) {
            console.warn('[BoldReportsViewer] No reports currently loaded');
            return;
        }

        this.showLoader();

        // Destroy and reload all reports with new parameters
        loadedReports.forEach((reportIndex) => {
            try {
                console.log(`[BoldReportsViewer] Destroying and reloading report ${reportIndex}`);
                
                // Destroy the viewer
                this.destroyViewer(reportIndex);
                
                // Reload with new parameters
                setTimeout(() => {
                    console.log(`[BoldReportsViewer] Reloading report ${reportIndex} after destroy`);
                    this.loadReport(reportIndex);
                }, 500);  // Increased delay to 500ms
                
            } catch (error) {
                console.error(`[BoldReportsViewer] Error refreshing report ${reportIndex}:`, error);
            }
        });

        setTimeout(() => this.hideLoader(), 2500);  // Increased timeout
    }

    refreshCurrentReport() {
        console.log(`[BoldReportsViewer] Refreshing current report ${this.currentTabIndex}`);
        this.applyParametersToAllReports();
    }

    resetParameters() {
        console.log('[BoldReportsViewer] Resetting all parameters');

        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });

        // Update selected values display
        document.querySelectorAll('.selected-values').forEach((elem) => {
            elem.innerHTML = '<div style="padding: 8px 12px; background: #f0f0f0; border-radius: 4px; font-size: 13px; color: #999; border: 1px solid #ddd;">No values selected</div>';
        });

        console.log('[BoldReportsViewer] Parameters reset');
    }

    initializeParametersPanel() {
        console.log('[BoldReportsViewer] Initializing parameters panel...');
        
        const container = document.getElementById('parameters-container');
        const template = document.getElementById('parameter-template');

        if (!container) {
            console.error('[BoldReportsViewer] Parameters container not found');
            return;
        }
        
        if (!template) {
            console.error('[BoldReportsViewer] Parameter template not found');
            return;
        }

        if (typeof PARAMETERS_DATA === 'undefined') {
            console.error('[BoldReportsViewer] PARAMETERS_DATA not defined');
            return;
        }

        PARAMETERS_DATA.forEach((param) => {
            const paramElement = template.content.cloneNode(true);
            const paramLabel = paramElement.querySelector('.parameter-label');
            const toggleBtn = paramElement.querySelector('.toggle-dropdown');
            const dropdown = paramElement.querySelector('.parameter-dropdown');
            const searchBox = paramElement.querySelector('.parameter-search-box');
            const optionsContainer = paramElement.querySelector('.parameter-options');
            const searchInput = paramElement.querySelector('.search-input');
            const selectedValuesDiv = paramElement.querySelector('.selected-values');
            const selectAllBtn = paramElement.querySelector('.btn-select-all');
            const deselectAllBtn = paramElement.querySelector('.btn-deselect-all');

            // Set label and data attribute
            paramLabel.textContent = param.label;
            paramLabel.setAttribute('data-param-name', param.name);

            // Create options and SELECT ALL BY DEFAULT
            param.values.forEach((value) => {
                const option = document.createElement('div');
                option.className = 'parameter-option';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = value;
                checkbox.checked = true; // ✅ SELECT ALL BY DEFAULT

                const label = document.createElement('label');
                label.className = 'option-label';
                label.textContent = value;

                checkbox.addEventListener('change', () => {
                    this.updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer);
                });

                label.addEventListener('click', (e) => {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    this.updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer);
                });

                option.appendChild(checkbox);
                option.appendChild(label);
                optionsContainer.appendChild(option);
            });

            // Toggle dropdown
            toggleBtn.addEventListener('click', () => {
                const isOpen = dropdown.style.display === 'block';
                dropdown.style.display = isOpen ? 'none' : 'block';
                searchBox.style.display = isOpen ? 'none' : 'block';
                toggleBtn.classList.toggle('open', !isOpen);
                if (!isOpen) {
                    searchInput.focus();
                }
            });

            // Search functionality
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                optionsContainer.querySelectorAll('.parameter-option').forEach((opt) => {
                    const text = opt.querySelector('.option-label').textContent.toLowerCase();
                    opt.style.display = text.includes(searchTerm) ? 'flex' : 'none';
                });
            });

            // Select All / Deselect All
            selectAllBtn.addEventListener('click', () => {
                optionsContainer.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                    checkbox.checked = true;
                });
                this.updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer);
            });

            deselectAllBtn.addEventListener('click', () => {
                optionsContainer.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
                    checkbox.checked = false;
                });
                this.updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.parameter-item')) {
                    dropdown.style.display = 'none';
                    searchBox.style.display = 'none';
                    toggleBtn.classList.remove('open');
                }
            });

            // Initialize selected values display
            this.updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer);

            container.appendChild(paramElement);
        });

        console.log('[BoldReportsViewer] Parameters panel initialized with ' + PARAMETERS_DATA.length + ' parameters');
    }

    updateSelectedValuesDisplay(selectedValuesDiv, param, optionsContainer) {
        selectedValuesDiv.innerHTML = '';
        const checkedBoxes = optionsContainer.querySelectorAll('input[type="checkbox"]:checked');
        const selectedCount = checkedBoxes.length;
        const totalCount = param.values.length;

        const summary = document.createElement('div');
        summary.style.cssText = `
            padding: 8px 12px;
            background: #f0f0f0;
            border-radius: 4px;
            font-size: 13px;
            color: #333;
            border: 1px solid #ddd;
        `;

        if (selectedCount === 0) {
            summary.textContent = 'No values selected';
            summary.style.color = '#999';
        } else if (selectedCount === totalCount) {
            summary.innerHTML = `✓ All ${totalCount} values selected`;
            summary.style.background = '#f0fdf4';
            summary.style.borderColor = '#86efac';
            summary.style.color = '#16a34a';
        } else if (selectedCount === 1) {
            summary.innerHTML = `<strong>1 value selected:</strong> ${checkedBoxes[0].value}`;
        } else {
            summary.innerHTML = `<strong>${selectedCount} of ${totalCount} values selected</strong>`;
        }

        selectedValuesDiv.appendChild(summary);
    }

    showLoader() {
        if (this.loaderElement) {
            this.loaderElement.style.display = 'flex';
        }
    }

    hideLoader() {
        if (this.loaderElement) {
            this.loaderElement.style.display = 'none';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.reportsViewer = new BoldReportsViewer();
});
