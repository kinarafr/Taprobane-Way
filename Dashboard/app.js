document.addEventListener('DOMContentLoaded', () => {
    const recordsGrid = document.getElementById('records-grid');
    const tabAll = document.getElementById('tab-all');
    const tabItineraries = document.getElementById('tab-itineraries');
    const tabMessages = document.getElementById('tab-messages');
    const clearBtn = document.getElementById('clear-records-btn');

    let currentFilter = 'all';

    function getRecords() {
        return JSON.parse(localStorage.getItem('taprobane_records') || '[]');
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function renderRecords() {
        let records = getRecords();

        // Sort by newest first
        records.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (currentFilter !== 'all') {
            records = records.filter(r => r.type === currentFilter);
        }

        recordsGrid.innerHTML = '';

        if (records.length === 0) {
            recordsGrid.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3>No records found</h3>
                    <p>There are currently no ${currentFilter === 'all' ? '' : currentFilter + ' '}submissions.</p>
                </div>
            `;
            return;
        }

        records.forEach(record => {
            const card = document.createElement('div');
            card.className = 'record-card';

            const formattedDate = formatDate(record.timestamp);

            if (record.type === 'itinerary') {
                const interestsHtml = record.interests && record.interests.length > 0
                    ? record.interests.map(i => `<span class="interest-tag">${i}</span>`).join('')
                    : '<span class="field-value">None selected</span>';

                card.innerHTML = `
                    <div class="record-header">
                        <div>
                            <div class="record-title">Custom Itinerary Request</div>
                        </div>
                        <div class="record-date">${formattedDate}</div>
                    </div>
                    <div class="record-body">
                        <div class="record-field">
                            <div class="field-label">Email Address</div>
                            <div class="field-value">${record.email}</div>
                        </div>
                        <div class="record-field">
                            <div class="field-label">Arrival & Duration</div>
                            <div class="field-value">${record.arrivalDate} • ${record.duration} days</div>
                        </div>
                        <div class="record-field">
                            <div class="field-label">Travelers & Style</div>
                            <div class="field-value">${record.travelers} Travelers • <span style="text-transform: capitalize;">${record.style}</span></div>
                        </div>
                        <div class="record-field">
                            <div class="field-label">Interests</div>
                            <div class="interests-tags">${interestsHtml}</div>
                        </div>
                    </div>
                    <div class="record-footer">
                        <a href="mailto:${record.email}?subject=Your Taprobane Way Custom Itinerary" class="btn-email-back">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Email Back
                        </a>
                    </div>
                `;
            } else if (record.type === 'contact') {
                card.innerHTML = `
                    <div class="record-header">
                        <div>
                            <div class="record-title">Contact Message</div>
                        </div>
                        <div class="record-date">${formattedDate}</div>
                    </div>
                    <div class="record-body">
                        <div class="record-field">
                            <div class="field-label">Sender</div>
                            <div class="field-value">${record.name} (${record.email})</div>
                        </div>
                        <div class="record-field">
                            <div class="field-label">Interest</div>
                            <div class="field-value">${record.interest}</div>
                        </div>
                        <div class="record-field">
                            <div class="field-label">Message</div>
                            <div class="field-value message">${record.message}</div>
                        </div>
                    </div>
                    <div class="record-footer">
                        <a href="mailto:${record.email}?subject=Re: Your Message to Taprobane Way" class="btn-email-back">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; vertical-align: middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Email Back
                        </a>
                    </div>
                `;
            }
            
            recordsGrid.appendChild(card);
        });
    }

    // Event Listeners
    tabAll.addEventListener('click', () => {
        currentFilter = 'all';
        updateTabs(tabAll);
        renderRecords();
    });

    tabItineraries.addEventListener('click', () => {
        currentFilter = 'itinerary';
        updateTabs(tabItineraries);
        renderRecords();
    });

    tabMessages.addEventListener('click', () => {
        currentFilter = 'contact';
        updateTabs(tabMessages);
        renderRecords();
    });

    clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all records? This action cannot be undone.')) {
            localStorage.removeItem('taprobane_records');
            renderRecords();
        }
    });

    function updateTabs(activeTab) {
        [tabAll, tabItineraries, tabMessages].forEach(t => t.classList.remove('active'));
        activeTab.classList.add('active');
    }

    // Initial render
    renderRecords();
});
