const CRMLeads = (() => {
    const STATUSES = ["New", "Contacted", "Qualified", "Lost", "Converted"];
    const SOURCES = ["Website", "LinkedIn", "Google", "Referral", "Social Media"];
    const TEAM = ["Unassigned", "Sai Ganesh (Lead)", "Priya Sharma", "Aakash Verma", "Rahul Mehta"];

    function all() {
        return CRMStorage.get().leads;
    }

    function get(id) {
        return all().find(l => l.id === id);
    }

    function scoreClass(score) {
        if (score >= 70) return "score-high";
        if (score >= 40) return "score-medium";
        return "score-low";
    }

    function badge(status) {
        const cls = {
            New: "badge-new", Contacted: "badge-contacted", Qualified: "badge-qualified",
            Lost: "badge-lost", Converted: "badge-converted"
        }[status] || "badge-new";
        return `<span class="badge ${cls}">${status}</span>`;
    }

    function initials(name) {
        return name.split(" ").map(x => x[0]).slice(0,2).join("").toUpperCase();
    }

    function add(payload) {
        const lead = {
            id: "l" + Date.now(),
            ...payload,
            score: Number(payload.score || 0),
            createdAt: new Date().toISOString().slice(0,10),
            activities: [{
                id: "a" + Date.now(),
                type: "Created",
                text: `Lead created from ${payload.source}`,
                at: new Date().toISOString()
            }]
        };
        CRMStorage.update(data => data.leads.unshift(lead));
        return lead;
    }

    function update(id, payload) {
        CRMStorage.update(data => {
            const lead = data.leads.find(l => l.id === id);
            if (!lead) return;
            Object.assign(lead, payload, { score: Number(payload.score ?? lead.score) });
        });
    }

    function remove(id) {
        CRMStorage.update(data => {
            data.leads = data.leads.filter(l => l.id !== id);
            data.followups = data.followups.filter(f => f.leadId !== id);
        });
    }

    function changeStatus(id, status) {
        CRMStorage.update(data => {
            const lead = data.leads.find(l => l.id === id);
            if (!lead) return;
            lead.status = status;
            lead.activities = lead.activities || [];
            lead.activities.unshift({
                id: "a" + Date.now(),
                type: status,
                text: status === "Converted" ? "Lead converted to customer" : `Lead status changed to ${status}`,
                at: new Date().toISOString()
            });
        });
    }

    function addActivity(id, text, type = "Note") {
        CRMStorage.update(data => {
            const lead = data.leads.find(l => l.id === id);
            if (!lead) return;
            lead.activities = lead.activities || [];
            lead.activities.unshift({
                id: "a" + Date.now(), type, text, at: new Date().toISOString()
            });
        });
    }

    function convert(id) {
        changeStatus(id, "Converted");
        addActivity(id, "Customer conversion completed", "Converted");
    }

    return { STATUSES, SOURCES, TEAM, all, get, scoreClass, badge, initials, add, update, remove, changeStatus, addActivity, convert };
})();
