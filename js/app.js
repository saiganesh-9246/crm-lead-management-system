const CRMApp = (() => {
    let currentSection = "dashboard";
    let editingLeadId = null;

    const app = document.getElementById("app");

    function init() {
        CRMStorage.init();

        if (!CRMAuth.isLoggedIn()) {
            window.location.href = "login.html";
            return;
        }

        applyTheme();
        renderShell();
        bindGlobalEvents();
        navigate("dashboard");
    }

    function renderShell() {
        const user = CRMAuth.getUser();
        const initials = CRMLeads.initials(user?.name || "User");

        app.innerHTML = `
        <div class="app-shell">
            <aside class="sidebar">
                <div class="brand">
                    <div class="brand-mark">SG</div>
                    <div>
                        <h2>SG LEADFLOW</h2>
                        <p>Lead Management System</p>
                    </div>
                </div>

                <nav class="nav">
                    <div class="nav-label">WORKSPACE</div>
                    ${navButton("dashboard", "📊", "Dashboard")}
                    ${navButton("leads", "👥", "Lead List")}
                    ${navButton("add-lead", "➕", "Add Lead")}
                    ${navButton("kanban", "🗂️", "Status Board")}
                    ${navButton("followups", "📅", "Follow-ups")}

                    <div class="nav-label">INSIGHTS</div>
                    ${navButton("reports", "📈", "Reports")}
                    ${navButton("users", "👤", "User Management")}
                </nav>

                <div class="sidebar-bottom">
                    <div class="user-mini">
                        <div class="avatar">${initials}</div>
                        <div>
                            <strong>${escapeHTML(user?.name || "User")}</strong>
                            <small>${escapeHTML(user?.role || "User")}</small>
                        </div>
                    </div>
                    <button id="logoutBtn" class="btn btn-danger btn-full">Logout</button>
                </div>
            </aside>

            <main class="main">
                <header class="topbar">
                    <div class="topbar-left">
                        <div>
                            <h1 id="topTitle">Dashboard</h1>
                            <p id="topSubtitle">Lead statistics, pipeline overview and conversion tracking</p>
                        </div>
                    </div>
                    <div class="topbar-actions">
                        <button id="themeBtn" class="icon-btn" title="Toggle dark mode">🌙</button>
                        <button class="btn btn-primary hide-mobile" data-nav="add-lead">+ Add Lead</button>
                    </div>
                </header>

                <div class="content">
                    ${sectionsHTML()}
                </div>
            </main>
        </div>

        <div id="toast" class="toast"></div>
        <div id="modal" class="modal"></div>
        `;
    }

    function navButton(id, icon, label) {
        return `<button class="nav-item" data-nav="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`;
    }

    function sectionsHTML() {
        return `
        <section id="section-dashboard" class="section"></section>
        <section id="section-leads" class="section"></section>
        <section id="section-add-lead" class="section"></section>
        <section id="section-kanban" class="section"></section>
        <section id="section-followups" class="section"></section>
        <section id="section-reports" class="section"></section>
        <section id="section-users" class="section"></section>
        `;
    }

    function bindGlobalEvents() {
        document.querySelectorAll("[data-nav]").forEach(el => {
            el.addEventListener("click", () => {
                if (el.dataset.nav === "add-lead") editingLeadId = null;
                navigate(el.dataset.nav);
            });
        });

        document.getElementById("logoutBtn").addEventListener("click", CRMAuth.logout);

        document.getElementById("themeBtn").addEventListener("click", () => {
            const data = CRMStorage.get();
            data.settings.darkMode = !data.settings.darkMode;
            CRMStorage.save(data);
            applyTheme();
        });
    }

    function applyTheme() {
        const data = CRMStorage.get();
        document.body.classList.toggle("dark", !!data.settings.darkMode);
        const btn = document.getElementById("themeBtn");
        if (btn) btn.textContent = data.settings.darkMode ? "☀️" : "🌙";
    }

    function navigate(section) {
        currentSection = section;
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        const targetSection = document.getElementById(`section-${section}`);
        if (targetSection) targetSection.classList.add("active");

        document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.nav === section));

        const meta = {
            dashboard: ["Dashboard", "Lead statistics, pipeline overview and conversion tracking"],
            leads: ["Lead List", "Search, filter, sort and manage every lead"],
            "add-lead": [editingLeadId ? "Edit Lead" : "Add Lead", "Capture complete lead and contact information"],
            kanban: ["Lead Status Board", "Kanban-style sales pipeline"],
            followups: ["Follow-up Scheduler", "Schedule and track calls, emails and meetings"],
            reports: ["Reports & Analytics", "Conversion, source and pipeline analysis"],
            users: ["User Management", "Simulated login and user profiles"]
        }[section] || ["Dashboard", "CRM Overview"];

        document.getElementById("topTitle").textContent = meta[0];
        document.getElementById("topSubtitle").textContent = meta[1];

        renderSection(section);
    }

    function renderSection(section) {
        if (section === "dashboard") renderDashboard();
        if (section === "leads") renderLeads();
        if (section === "add-lead") renderAddLead();
        if (section === "kanban") renderKanban();
        if (section === "followups") renderFollowups();
        if (section === "reports") renderReports();
        if (section === "users") renderUsers();
    }

    function renderDashboard() {
        const stats = CRMReports.stats();
        const status = CRMReports.byStatus();
        const sources = CRMReports.bySource();
        const leads = CRMLeads.all();

        document.getElementById("section-dashboard").innerHTML = `
            <div class="page-head">
                <div><h2>CRM Dashboard</h2><p>Monitor lead health, pipeline movement and conversions.</p></div>
                <div class="actions">
                    <button class="btn" id="exportDashboard">Export CSV</button>
                    <button class="btn btn-primary" data-nav="add-lead">+ New Lead</button>
                </div>
            </div>

            <div class="stats-grid">
                ${statCard("👥", "Total Leads", stats.total, "All captured leads")}
                ${statCard("✨", "New Leads", status.New, "Awaiting first contact")}
                ${statCard("⭐", "Qualified", stats.qualified, "Sales-qualified leads")}
                ${statCard("✅", "Converted", stats.converted, stats.conversionRate + "% conversion rate")}
            </div>

            <div class="card">
                <div class="card-head">
                    <div><h3>Sales Pipeline</h3><p>Current leads by status</p></div>
                </div>
                <div class="pipeline-mini">
                    ${CRMLeads.STATUSES.map(s => `<div class="pipeline-item"><strong>${status[s]}</strong><span>${s}</span></div>`).join("")}
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <div class="card-head"><div><h3>Lead Status Distribution</h3><p>Pipeline volume by stage</p></div></div>
                    <div class="chart-bars">${CRMLeads.STATUSES.map(s => {
            const max = Math.max(1, ...Object.values(status));
            const height = Math.max(4, (status[s] / max) * 165);
            return `<div class="bar-wrap"><div class="bar-value">${status[s]}</div><div class="bar" style="height:${height}px"></div><div class="bar-label">${s}</div></div>`;
        }).join("")}</div>
                </div>

                <div class="card">
                    <div class="card-head"><div><h3>Lead Sources</h3><p>Where leads are coming from</p></div></div>
                    <div class="source-list">${Object.entries(sources).map(([source, count]) => {
            const pct = stats.total ? Math.round(count / stats.total * 100) : 0;
            return `<div class="source-row"><span>${source}</span><div class="source-track"><div class="source-fill" style="width:${pct}%"></div></div><strong>${count}</strong></div>`;
        }).join("")}</div>
                </div>
            </div>

            <div class="card">
                <div class="card-head"><div><h3>Recent Leads</h3><p>Latest records added to the CRM</p></div><button class="btn btn-small" data-nav="leads">View All</button></div>
                ${leadTable(leads.slice(0, 6), true)}
            </div>
        `;

        document.querySelectorAll("[data-nav]").forEach(el => el.onclick = () => {
            if (el.dataset.nav === "add-lead") editingLeadId = null;
            navigate(el.dataset.nav);
        });
        document.getElementById("exportDashboard").onclick = CRMReports.exportCSV;
    }

    function statCard(icon, label, value, note) {
        return `<div class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note">${note}</div></div>`;
    }

    function leadTable(leads, compact = false) {
        if (!leads.length) return `<div class="empty">No leads found.</div>`;
        return `<div class="table-wrap"><table class="table">
            <thead><tr>
                <th>Name</th><th>Company</th><th>Source</th><th>Score</th><th>Status</th><th>Assigned</th>${compact ? "" : "<th>Actions</th>"}
            </tr></thead>
            <tbody>${leads.map(l => `<tr>
                <td><strong>${escapeHTML(l.name)}</strong><br><small>${escapeHTML(l.email)}</small></td>
                <td>${escapeHTML(l.company || "-")}</td>
                <td>${escapeHTML(l.source)}</td>
                <td><span class="${CRMLeads.scoreClass(l.score)}">${l.score}</span></td>
                <td>${CRMLeads.badge(l.status)}</td>
                <td>${escapeHTML(l.assignedTo)}</td>
                ${compact ? "" : `<td><div class="actions">
                    <button class="btn btn-small btn-blue" data-action="view" data-id="${l.id}">View</button>
                    <button class="btn btn-small" data-action="edit" data-id="${l.id}">Edit</button>
                    <button class="btn btn-small btn-danger" data-action="delete" data-id="${l.id}">Delete</button>
                </div></td>`}
            </tr>`).join("")}</tbody>
        </table></div>`;
    }

    function renderLeads() {
        document.getElementById("section-leads").innerHTML = `
            <div class="page-head">
                <div><h2>Lead List</h2><p>All leads with search, filters and status indicators.</p></div>
                <div class="actions"><button class="btn" id="exportLeads">Export CSV</button><button class="btn btn-primary" data-nav="add-lead">+ Add Lead</button></div>
            </div>
            <div class="card">
                <div class="filters">
                    <input class="input" id="leadSearch" placeholder="🔍 Search name, email, company or phone">
                    <select class="select" id="statusFilter"><option value="All">All Statuses</option>${CRMLeads.STATUSES.map(s => `<option>${s}</option>`).join("")}</select>
                    <select class="select" id="sourceFilter"><option value="All">All Sources</option>${CRMLeads.SOURCES.map(s => `<option>${s}</option>`).join("")}</select>
                    <select class="select" id="assigneeFilter"><option value="All">All Assignees</option>${CRMLeads.TEAM.map(s => `<option>${s}</option>`).join("")}</select>
                </div>
                <div id="leadListTable"></div>
            </div>
        `;

        const refresh = () => {
            const q = document.getElementById("leadSearch").value.toLowerCase();
            const status = document.getElementById("statusFilter").value;
            const source = document.getElementById("sourceFilter").value;
            const assignee = document.getElementById("assigneeFilter").value;

            const filtered = CRMLeads.all().filter(l => {
                const matchesQ = [l.name, l.email, l.company, l.phone].join(" ").toLowerCase().includes(q);
                return matchesQ &&
                    (status === "All" || l.status === status) &&
                    (source === "All" || l.source === source) &&
                    (assignee === "All" || l.assignedTo === assignee);
            });

            document.getElementById("leadListTable").innerHTML = leadTable(filtered);
            bindLeadActions();
        };

        ["leadSearch", "statusFilter", "sourceFilter", "assigneeFilter"].forEach(id => {
            document.getElementById(id).addEventListener("input", refresh);
            document.getElementById(id).addEventListener("change", refresh);
        });

        document.getElementById("exportLeads").onclick = CRMReports.exportCSV;
        document.querySelectorAll("[data-nav]").forEach(el => el.onclick = () => {
            if (el.dataset.nav === "add-lead") editingLeadId = null;
            navigate(el.dataset.nav);
        });
        refresh();
    }

    function bindLeadActions() {
        document.querySelectorAll("[data-action]").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                if (action === "view") openLeadDetail(id);
                if (action === "edit") { editingLeadId = id; navigate("add-lead"); }
                if (action === "delete") {
                    if (confirm("Delete this lead and its follow-ups?")) {
                        CRMLeads.remove(id);
                        toast("Lead deleted.");
                        renderLeads();
                    }
                }
            };
        });
    }

    function renderAddLead() {
        const lead = editingLeadId ? CRMLeads.get(editingLeadId) : null;

        document.getElementById("section-add-lead").innerHTML = `
            <div class="page-head">
                <div><h2>${lead ? "Edit Lead" : "Add New Lead"}</h2><p>Capture lead details, score, source and assignment.</p></div>
            </div>

            <div class="card">
                <form id="leadForm">
                    <div class="form-grid">
                        ${field("name", "Full Name *", lead?.name || "", "John Doe")}
                        ${field("email", "Email *", lead?.email || "", "john@example.com", "email")}
                        ${field("phone", "Phone Number", lead?.phone || "", "+91 9876543210")}
                        ${field("company", "Company", lead?.company || "", "Company name")}
                        <div class="field"><label>Lead Source *</label><select class="select" id="source" required><option value="">Select source</option>${CRMLeads.SOURCES.map(s => `<option ${lead?.source === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
                        <div class="field"><label>Lead Score (0-100)</label><input class="input" id="score" type="number" min="0" max="100" value="${lead?.score ?? 50}"></div>
                        <div class="field"><label>Assigned To</label><select class="select" id="assignedTo">${CRMLeads.TEAM.map(s => `<option ${lead?.assignedTo === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
                        <div class="field"><label>Status</label><select class="select" id="status">${CRMLeads.STATUSES.map(s => `<option ${lead?.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></div>
                        <div class="field full"><label>Notes</label><textarea class="textarea" id="notes" placeholder="Add notes, requirements or context...">${escapeHTML(lead?.notes || "")}</textarea></div>
                    </div>
                    <div class="form-actions"><button type="button" class="btn" id="cancelLead">Cancel</button><button type="submit" class="btn btn-primary">${lead ? "Update Lead" : "Save Lead"}</button></div>
                </form>
            </div>
        `;

        document.getElementById("cancelLead").onclick = () => { editingLeadId = null; navigate("leads"); };

        document.getElementById("leadForm").onsubmit = e => {
            e.preventDefault();
            const payload = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                company: document.getElementById("company").value.trim(),
                source: document.getElementById("source").value,
                score: document.getElementById("score").value,
                assignedTo: document.getElementById("assignedTo").value,
                status: document.getElementById("status").value,
                notes: document.getElementById("notes").value.trim()
            };

            if (!payload.name || !payload.email || !payload.source) {
                toast("Please fill the required fields.");
                return;
            }

            if (lead) {
                CRMLeads.update(lead.id, payload);
                CRMLeads.addActivity(lead.id, "Lead details updated", "Updated");
                toast("Lead updated successfully.");
            } else {
                CRMLeads.add(payload);
                toast("Lead added successfully.");
            }

            editingLeadId = null;
            navigate("leads");
        };
    }

    function field(id, label, value, placeholder, type = "text") {
        return `<div class="field"><label>${label}</label><input class="input" id="${id}" type="${type}" value="${escapeAttr(value)}" placeholder="${placeholder}" ${id === "email" ? "required" : ""}></div>`;
    }

    function renderKanban() {
        const leads = CRMLeads.all();

        document.getElementById("section-kanban").innerHTML = `
            <div class="page-head">
                <div><h2>Lead Status Board</h2><p>Drag a lead card between columns to update its status.</p></div>
                <button class="btn btn-primary" data-nav="add-lead">+ Add Lead</button>
            </div>
            <div class="kanban">
                ${CRMLeads.STATUSES.map(status => {
            const items = leads.filter(l => l.status === status);
            return `<div class="kanban-column" data-drop-status="${status}">
                        <div class="kanban-head"><h3>${status}</h3><span class="count">${items.length}</span></div>
                        <div class="kanban-cards">
                            ${items.map(l => `<div class="kanban-card" draggable="true" data-lead-id="${l.id}">
                                <h4>${escapeHTML(l.name)}</h4>
                                <p>${escapeHTML(l.company || l.email)}</p>
                                <div class="kanban-meta"><span class="${CRMLeads.scoreClass(l.score)}">Score ${l.score}</span>${CRMLeads.badge(l.status)}</div>
                            </div>`).join("") || `<div class="empty">Drop leads here</div>`}
                        </div>
                    </div>`;
        }).join("")}
            </div>
        `;

        document.querySelectorAll("[data-nav]").forEach(el => el.onclick = () => {
            if (el.dataset.nav === "add-lead") editingLeadId = null;
            navigate(el.dataset.nav);
        });

        document.querySelectorAll(".kanban-card").forEach(card => {
            card.addEventListener("click", () => openLeadDetail(card.dataset.leadId));
            card.addEventListener("dragstart", e => {
                e.dataTransfer.setData("text/plain", card.dataset.leadId);
            });
        });

        document.querySelectorAll("[data-drop-status]").forEach(column => {
            column.addEventListener("dragover", e => { e.preventDefault(); column.classList.add("drop-active"); });
            column.addEventListener("dragleave", () => column.classList.remove("drop-active"));
            column.addEventListener("drop", e => {
                e.preventDefault();
                column.classList.remove("drop-active");
                const id = e.dataTransfer.getData("text/plain");
                CRMLeads.changeStatus(id, column.dataset.dropStatus);
                toast("Lead status updated.");
                renderKanban();
            });
        });
    }

    function renderFollowups() {
        const data = CRMFollowups.all().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

        document.getElementById("section-followups").innerHTML = `
            <div class="page-head">
                <div><h2>Follow-up Scheduler</h2><p>Schedule calls, emails and meetings for your leads.</p></div>
                <button class="btn btn-primary" id="newFollowup">+ Schedule Follow-up</button>
            </div>
            <div class="card">
                <div class="calendar-list">
                    ${data.length ? data.map(f => {
            const lead = CRMLeads.get(f.leadId);
            return `<div class="followup-card">
                            <div class="date-box"><strong>${formatDateShort(f.date)}</strong><span>${f.time}</span></div>
                            <div><h4>${escapeHTML(lead?.name || "Unknown Lead")} • ${escapeHTML(f.type)}</h4><p>${escapeHTML(f.note || "No note")} · ${f.completed ? "Completed" : "Pending"}</p></div>
                            <div class="actions">
                                <button class="btn btn-small ${f.completed ? "" : "btn-primary"}" data-follow-toggle="${f.id}">${f.completed ? "Undo" : "Complete"}</button>
                                <button class="btn btn-small btn-danger" data-follow-delete="${f.id}">Delete</button>
                            </div>
                        </div>`;
        }).join("") : `<div class="empty">No follow-ups scheduled.</div>`}
                </div>
            </div>
        `;

        document.getElementById("newFollowup").onclick = () => openFollowupModal();

        document.querySelectorAll("[data-follow-toggle]").forEach(b => b.onclick = () => { CRMFollowups.toggle(b.dataset.followToggle); renderFollowups(); });
        document.querySelectorAll("[data-follow-delete]").forEach(b => b.onclick = () => {
            if (confirm("Delete this follow-up?")) { CRMFollowups.remove(b.dataset.followDelete); renderFollowups(); }
        });
    }

    function openFollowupModal() {
        const leads = CRMLeads.all();
        document.getElementById("modal").innerHTML = `
            <div class="modal-card">
                <div class="modal-head"><h3>Schedule Follow-up</h3><button class="icon-btn" id="closeModal">✕</button></div>
                <form id="followupForm">
                    <div class="form-grid">
                        <div class="field full"><label>Lead</label><select class="select" id="fuLead">${leads.map(l => `<option value="${l.id}">${escapeHTML(l.name)} — ${escapeHTML(l.company || l.email)}</option>`).join("")}</select></div>
                        <div class="field"><label>Date</label><input class="input" id="fuDate" type="date" required value="${new Date().toISOString().slice(0, 10)}"></div>
                        <div class="field"><label>Time</label><input class="input" id="fuTime" type="time" required value="10:00"></div>
                        <div class="field"><label>Type</label><select class="select" id="fuType"><option>Call</option><option>Email</option><option>Meeting</option><option>Demo</option></select></div>
                        <div class="field full"><label>Note</label><textarea class="textarea" id="fuNote" placeholder="What should be discussed?"></textarea></div>
                    </div>
                    <div class="form-actions"><button type="button" class="btn" id="closeModal2">Cancel</button><button class="btn btn-primary">Schedule</button></div>
                </form>
            </div>
        `;
        document.getElementById("modal").classList.add("open");
        document.getElementById("closeModal").onclick = closeModal;
        document.getElementById("closeModal2").onclick = closeModal;
        document.getElementById("followupForm").onsubmit = e => {
            e.preventDefault();
            CRMFollowups.add({
                leadId: document.getElementById("fuLead").value,
                date: document.getElementById("fuDate").value,
                time: document.getElementById("fuTime").value,
                type: document.getElementById("fuType").value,
                note: document.getElementById("fuNote").value.trim()
            });
            const leadId = document.getElementById("fuLead").value;
            CRMLeads.addActivity(leadId, `Follow-up scheduled for ${document.getElementById("fuDate").value}`, "Follow-up");
            closeModal();
            toast("Follow-up scheduled.");
            renderFollowups();
        };
    }

    function renderReports() {
        const stats = CRMReports.stats();
        const sources = CRMReports.bySource();
        const status = CRMReports.byStatus();

        document.getElementById("section-reports").innerHTML = `
            <div class="page-head">
                <div><h2>Reports & Analytics</h2><p>Lead performance, source analysis and conversion reporting.</p></div>
                <button class="btn btn-primary" id="exportReport">Export Leads CSV</button>
            </div>

            <div class="kpi-grid">
                <div class="kpi"><span>Total Leads</span><strong>${stats.total}</strong></div>
                <div class="kpi"><span>Qualified</span><strong>${stats.qualified}</strong></div>
                <div class="kpi"><span>Converted</span><strong>${stats.converted}</strong></div>
                <div class="kpi"><span>Average Score</span><strong>${stats.score}</strong></div>
            </div>

            <div class="grid-2" style="margin-top:18px">
                <div class="card">
                    <div class="card-head"><div><h3>Conversion Report</h3><p>Converted leads as a percentage of total leads.</p></div></div>
                    <div style="font-size:42px;font-weight:900;color:var(--primary)">${stats.conversionRate}%</div>
                    <p style="color:var(--muted);font-size:12px">${stats.converted} of ${stats.total} leads converted.</p>
                    <div class="progress"><div style="width:${stats.conversionRate}%"></div></div>
                </div>
                <div class="card">
                    <div class="card-head"><div><h3>Source Analysis</h3><p>Lead volume by acquisition channel.</p></div></div>
                    <div class="source-list">${Object.entries(sources).map(([s, c]) => {
            const pct = stats.total ? Math.round(c / stats.total * 100) : 0;
            return `<div class="source-row"><span>${s}</span><div class="source-track"><div class="source-fill" style="width:${pct}%"></div></div><strong>${c}</strong></div>`;
        }).join("")}</div>
                </div>
            </div>

            <div class="card">
                <div class="card-head"><div><h3>Pipeline Report</h3><p>Lead counts by current status.</p></div></div>
                <div class="table-wrap"><table class="table"><thead><tr><th>Status</th><th>Count</th><th>Share</th><th>Progress</th></tr></thead><tbody>
                ${CRMLeads.STATUSES.map(s => {
            const c = status[s], pct = stats.total ? Math.round(c / stats.total * 100) : 0;
            return `<tr><td>${CRMLeads.badge(s)}</td><td>${c}</td><td>${pct}%</td><td><div class="progress"><div style="width:${pct}%"></div></div></td></tr>`;
        }).join("")}
                </tbody></table></div>
            </div>
        `;

        document.getElementById("exportReport").onclick = CRMReports.exportCSV;
    }

    function renderUsers() {
        const data = CRMStorage.get();
        document.getElementById("section-users").innerHTML = `
            <div class="page-head">
                <div><h2>User Management</h2><p>Simulated user profiles and authentication for the frontend project.</p></div>
                <span class="badge badge-qualified">${data.users.length} Users</span>
            </div>
            <div class="card">
                <div class="table-wrap"><table class="table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Access</th></tr></thead>
                <tbody>${data.users.map(u => `<tr>
                    <td><strong>${escapeHTML(u.name)}</strong></td>
                    <td>${escapeHTML(u.email)}</td>
                    <td>${escapeHTML(u.role)}</td>
                    <td><span class="badge badge-converted">Active</span></td>
                </tr>`).join("")}</tbody></table></div>
            </div>
        `;
    }

    function openLeadDetail(id) {
        const lead = CRMLeads.get(id);
        if (!lead) return;
        const followups = CRMFollowups.all().filter(f => f.leadId === id);

        document.getElementById("modal").innerHTML = `
            <div class="modal-card">
                <div class="modal-head">
                    <h3>Lead Detail</h3>
                    <button class="icon-btn" id="closeModal">✕</button>
                </div>

                <div class="profile-card">
                    <div class="profile-avatar">${CRMLeads.initials(lead.name)}</div>
                    <div>
                        <h3>${escapeHTML(lead.name)}</h3>
                        <p>${escapeHTML(lead.company || "No company")} • ${escapeHTML(lead.email)}</p>
                        ${CRMLeads.badge(lead.status)}
                    </div>
                </div>

                <div class="info-list">
                    <div class="info-row"><span>Email</span><strong>${escapeHTML(lead.email)}</strong></div>
                    <div class="info-row"><span>Phone</span><strong>${escapeHTML(lead.phone || "-")}</strong></div>
                    <div class="info-row"><span>Source</span><strong>${escapeHTML(lead.source)}</strong></div>
                    <div class="info-row"><span>Lead Score</span><strong class="${CRMLeads.scoreClass(lead.score)}">${lead.score}/100</strong></div>
                    <div class="info-row"><span>Assigned To</span><strong>${escapeHTML(lead.assignedTo)}</strong></div>
                    <div class="info-row"><span>Created</span><strong>${escapeHTML(lead.createdAt)}</strong></div>
                </div>

                <div style="margin-top:18px">
                    <strong style="font-size:12px">Notes</strong>
                    <p style="color:var(--muted);font-size:11px;line-height:1.6">${escapeHTML(lead.notes || "No notes added.")}</p>
                </div>

                <div class="card" style="margin-top:18px;padding:14px">
                    <div class="card-head"><div><h3>Activity Timeline</h3><p>Recent lead activity</p></div></div>
                    <div class="timeline">${(lead.activities || []).map(a => `<div class="timeline-item"><strong>${escapeHTML(a.type)}</strong><p>${escapeHTML(a.text)}</p><small>${formatDateTime(a.at)}</small></div>`).join("") || `<div class="empty">No activity yet.</div>`}</div>
                </div>

                <div class="card" style="margin-top:18px;padding:14px">
                    <div class="card-head"><div><h3>Follow-ups</h3><p>Scheduled activities for this lead</p></div></div>
                    ${followups.length ? followups.map(f => `<p style="font-size:11px;margin:8px 0">${f.date} ${f.time} • ${f.type} • ${escapeHTML(f.note || "")} ${f.completed ? "✓" : ""}</p>`).join("") : `<div class="empty">No follow-ups.</div>`}
                </div>

                <div class="form-actions">
                    <button class="btn" id="detailEdit">Edit</button>
                    <button class="btn btn-primary" id="detailConvert" ${lead.status === "Converted" ? "disabled" : ""}>Convert to Customer</button>
                </div>
            </div>
        `;

        document.getElementById("modal").classList.add("open");
        document.getElementById("closeModal").onclick = closeModal;
        document.getElementById("detailEdit").onclick = () => {
            closeModal();
            editingLeadId = id;
            navigate("add-lead");
        };
        document.getElementById("detailConvert").onclick = () => {
            CRMLeads.convert(id);
            closeModal();
            toast("Lead converted to customer.");
            if (currentSection === "leads") renderLeads();
            if (currentSection === "kanban") renderKanban();
        };
    }

    function closeModal() {
        document.getElementById("modal").classList.remove("open");
    }

    function toast(message) {
        const el = document.getElementById("toast");
        el.textContent = message;
        el.classList.add("show");
        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
    }

    function formatDateShort(date) {
        const d = new Date(date + "T00:00:00");
        return d.toLocaleDateString(undefined, { day: "2-digit", month: "short" });
    }

    function formatDateTime(value) {
        return new Date(value).toLocaleString(undefined, {
            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
        });
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, c => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
        }[c]));
    }

    function escapeAttr(value) {
        return escapeHTML(value);
    }

    return { init };
})();

document.addEventListener("DOMContentLoaded", CRMApp.init);
