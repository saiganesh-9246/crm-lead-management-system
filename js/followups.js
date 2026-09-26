const CRMFollowups = (() => {
    function all() {
        return CRMStorage.get().followups;
    }

    function add(payload) {
        const item = { id: "f" + Date.now(), completed: false, ...payload };
        CRMStorage.update(data => data.followups.push(item));
        return item;
    }

    function toggle(id) {
        CRMStorage.update(data => {
            const item = data.followups.find(f => f.id === id);
            if (item) item.completed = !item.completed;
        });
    }

    function remove(id) {
        CRMStorage.update(data => {
            data.followups = data.followups.filter(f => f.id !== id);
        });
    }

    function leadName(id) {
        const lead = CRMLeads.get(id);
        return lead ? lead.name : "Unknown Lead";
    }

    return { all, add, toggle, remove, leadName };
})();
