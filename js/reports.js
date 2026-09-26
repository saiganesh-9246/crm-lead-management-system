const CRMReports = (() => {
    function stats() {
        const leads = CRMLeads.all();
        const total = leads.length;
        const converted = leads.filter(l => l.status === "Converted").length;
        const qualified = leads.filter(l => l.status === "Qualified").length;
        const score = total ? Math.round(leads.reduce((sum,l) => sum + Number(l.score),0) / total) : 0;
        return {
            total, converted, qualified, score,
            conversionRate: total ? Math.round(converted / total * 100) : 0
        };
    }

    function byStatus() {
        const leads = CRMLeads.all();
        return Object.fromEntries(CRMLeads.STATUSES.map(s => [s, leads.filter(l => l.status === s).length]));
    }

    function bySource() {
        const leads = CRMLeads.all();
        return Object.fromEntries(CRMLeads.SOURCES.map(s => [s, leads.filter(l => l.source === s).length]));
    }

    function exportCSV() {
        const leads = CRMLeads.all();
        const headers = ["Name","Email","Phone","Company","Source","Score","Assigned To","Status","Created At"];
        const rows = leads.map(l => [
            l.name,l.email,l.phone,l.company,l.source,l.score,l.assignedTo,l.status,l.createdAt
        ]);
        const escape = value => `"${String(value ?? "").replaceAll('"','""')}"`;
        const csv = [headers, ...rows].map(row => row.map(escape).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sg-leadflow-leads.csv";
        a.click();
        URL.revokeObjectURL(url);
    }

    return { stats, byStatus, bySource, exportCSV };
})();
