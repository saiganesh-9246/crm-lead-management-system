const CRMStorage = (() => {

    const KEY = "leadflow_crm_data";

    function getSeedData() {
        return {
            settings: {
                darkMode: false
            },

            users: [
                {
                    id: "usr-admin",
                    name: "Admin User",
                    email: "admin@sgleadflow.local",
                    password: "admin123",
                    role: "Administrator",
                    createdAt: "2026-01-15T09:00:00.000Z"
                },
                {
                    id: "usr-sai",
                    name: "Sai Ganesh",
                    email: "sai@sgleadflow.local",
                    password: "sales123",
                    role: "Lead Sales Executive",
                    createdAt: "2026-02-01T10:30:00.000Z"
                }
            ],

            leads: [
                {
                    id: "lead-101",
                    name: "Alex Morgan",
                    email: "alex.morgan@apexcloud.io",
                    phone: "+1 415-555-0182",
                    company: "Apex Cloud Systems",
                    source: "Website",
                    score: 88,
                    assignedTo: "Sai Ganesh (Lead)",
                    status: "Qualified",
                    notes: "High interest in enterprise tier. Budget approved for Q3 rollout.",
                    createdAt: "2026-09-20",
                    activities: [
                        { id: "act-1", type: "Qualified", text: "Lead qualified after technical assessment", at: "2026-09-22T14:30:00.000Z" },
                        { id: "act-2", type: "Contacted", text: "Introductory call completed with Alex", at: "2026-09-21T11:00:00.000Z" },
                        { id: "act-3", type: "Created", text: "Lead created from Website inquiry", at: "2026-09-20T09:15:00.000Z" }
                    ]
                },
                {
                    id: "lead-102",
                    name: "Priya Sharma",
                    email: "priya.sharma@novatech.co",
                    phone: "+91 98234-56789",
                    company: "NovaTech Solutions",
                    source: "LinkedIn",
                    score: 95,
                    assignedTo: "Priya Sharma",
                    status: "Converted",
                    notes: "Signed 1-year annual contract for 50 licenses.",
                    createdAt: "2026-09-15",
                    activities: [
                        { id: "act-4", type: "Converted", text: "Lead converted to customer", at: "2026-09-24T16:00:00.000Z" },
                        { id: "act-5", type: "Qualified", text: "Commercial terms approved", at: "2026-09-18T10:00:00.000Z" },
                        { id: "act-6", type: "Created", text: "Lead created from LinkedIn outreach", at: "2026-09-15T08:45:00.000Z" }
                    ]
                },
                {
                    id: "lead-103",
                    name: "David Chen",
                    email: "david.chen@horizonfin.com",
                    phone: "+1 212-555-0143",
                    company: "Horizon Financial",
                    source: "Google",
                    score: 65,
                    assignedTo: "Aakash Verma",
                    status: "Contacted",
                    notes: "Sent demo recording and feature comparison matrix. Awaiting review.",
                    createdAt: "2026-09-22",
                    activities: [
                        { id: "act-7", type: "Contacted", text: "Sent product walkthrough email", at: "2026-09-23T15:20:00.000Z" },
                        { id: "act-8", type: "Created", text: "Lead created from Google search ad", at: "2026-09-22T13:10:00.000Z" }
                    ]
                },
                {
                    id: "lead-104",
                    name: "Elena Rostova",
                    email: "elena@luminahealth.org",
                    phone: "+44 20 7946 0912",
                    company: "Lumina Health",
                    source: "Referral",
                    score: 78,
                    assignedTo: "Sai Ganesh (Lead)",
                    status: "New",
                    notes: "Referred by Apex Cloud. Needs HIPAA compliance details.",
                    createdAt: "2026-09-25",
                    activities: [
                        { id: "act-9", type: "Created", text: "Lead created from Referral", at: "2026-09-25T17:00:00.000Z" }
                    ]
                },
                {
                    id: "lead-105",
                    name: "Marcus Vance",
                    email: "marcus.v@stratosretail.com",
                    phone: "+1 312-555-0199",
                    company: "Stratos Retail",
                    source: "Social Media",
                    score: 35,
                    assignedTo: "Rahul Mehta",
                    status: "Lost",
                    notes: "Chose alternative in-house tool due to current budget freeze.",
                    createdAt: "2026-09-10",
                    activities: [
                        { id: "act-10", type: "Lost", text: "Lead status changed to Lost (budget constraint)", at: "2026-09-19T11:30:00.000Z" },
                        { id: "act-11", type: "Created", text: "Lead created from Social Media campaign", at: "2026-09-10T14:00:00.000Z" }
                    ]
                },
                {
                    id: "lead-106",
                    name: "Sophia Martinez",
                    email: "sophia@solargrid.net",
                    phone: "+1 512-555-0177",
                    company: "SolarGrid Energy",
                    source: "Website",
                    score: 82,
                    assignedTo: "Sai Ganesh (Lead)",
                    status: "Qualified",
                    notes: "Wants a customized demo for their 20 sales reps next Tuesday.",
                    createdAt: "2026-09-23",
                    activities: [
                        { id: "act-12", type: "Qualified", text: "Passed SDR qualification checklist", at: "2026-09-24T09:30:00.000Z" },
                        { id: "act-13", type: "Created", text: "Lead created from Website contact form", at: "2026-09-23T16:45:00.000Z" }
                    ]
                }
            ],

            followups: [
                {
                    id: "fu-201",
                    leadId: "lead-101",
                    date: "2026-09-28",
                    time: "11:00",
                    type: "Demo",
                    note: "Executive demo with CTO & Head of Sales",
                    completed: false
                },
                {
                    id: "fu-202",
                    leadId: "lead-103",
                    date: "2026-09-29",
                    time: "15:30",
                    type: "Call",
                    note: "Follow up on security review feedback",
                    completed: false
                },
                {
                    id: "fu-203",
                    leadId: "lead-106",
                    date: "2026-09-30",
                    time: "10:00",
                    type: "Meeting",
                    note: "Discuss custom integration requirements",
                    completed: false
                },
                {
                    id: "fu-204",
                    leadId: "lead-102",
                    date: "2026-09-24",
                    time: "14:00",
                    type: "Email",
                    note: "Sent onboarding kit and welcome documentation",
                    completed: true
                }
            ]
        };
    }

    function init() {
        const stored = localStorage.getItem(KEY);

        if (!stored) {
            save(getSeedData());
            return;
        }

        const data = get();
        let changed = false;

        if (!data.settings) {
            data.settings = { darkMode: false };
            changed = true;
        }

        if (!Array.isArray(data.users) || data.users.length === 0) {
            data.users = getSeedData().users;
            changed = true;
        } else {
            const hasAdmin = data.users.some(u => u.email === "admin@sgleadflow.local");
            const hasSai = data.users.some(u => u.email === "sai@sgleadflow.local");
            if (!hasAdmin || !hasSai) {
                getSeedData().users.forEach(u => {
                    if (!data.users.some(existing => existing.email.toLowerCase() === u.email.toLowerCase())) {
                        data.users.push(u);
                        changed = true;
                    }
                });
            }
        }

        if (!Array.isArray(data.leads) || data.leads.length === 0) {
            data.leads = getSeedData().leads;
            changed = true;
        }

        if (!Array.isArray(data.followups)) {
            data.followups = getSeedData().followups;
            changed = true;
        }

        if (changed) {
            save(data);
        }
    }

    function get() {
        const data = localStorage.getItem(KEY);

        if (!data) {
            return getSeedData();
        }

        try {
            return JSON.parse(data);
        } catch (error) {
            console.error("CRM storage error:", error);
            return getSeedData();
        }
    }

    function save(data) {
        localStorage.setItem(KEY, JSON.stringify(data));
    }

    function update(callback) {
        const data = get();
        callback(data);
        save(data);
    }

    function reset() {
        const seed = getSeedData();
        save(seed);
        return seed;
    }

    return {
        init,
        get,
        save,
        update,
        reset
    };

})();