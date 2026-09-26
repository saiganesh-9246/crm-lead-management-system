# SG LEADFLOW (CRM)

A responsive frontend-only **Lead Management System (CRM)** built for the **Web Development Internship Online** task.

**Task ID:** `WD-CRM-002`  
**Domain:** CRM - Lead Management / Sales Pipeline  
**Technology:** HTML5, CSS3, JavaScript  
**Storage:** Browser LocalStorage  
**Project Type:** Frontend-only internship project

---

## Project Overview

**SG LEADFLOW** is a web application for capturing, tracking, managing, nurturing and converting sales leads.

It implements the internship requirements:

- Dashboard with lead statistics
- Add/Edit/Delete leads
- Search and filtering
- Lead detail view
- Kanban status board
- Follow-up scheduler
- Lead conversion to customer
- Reports and analytics
- Simulated user login/register management
- Lead source tracking
- Activity timeline
- CSV export
- Lead scoring
- Dark mode
- Responsive design

---

## Lead Pipeline

The application supports five lead statuses:

```text
New → Contacted → Qualified → Converted
                    ↓
                   Lost
```

The Kanban board allows leads to be dragged between statuses.

---

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- LocalStorage API
- Responsive CSS
- No external database
- No backend dependency

The internship instructions specify a frontend-only implementation using JavaScript objects/arrays for storing leads, follow-ups and activities. This project uses LocalStorage so data survives browser refreshes.

---

## Features

### 1. Dashboard

Displays:

- Total Leads
- New Leads
- Qualified Leads
- Converted Leads
- Conversion Rate
- Pipeline statistics
- Lead status chart
- Lead source analysis
- Recent leads

### 2. Lead List

Supports:

- Search by name, email, company or phone
- Filter by status
- Filter by source
- Filter by assigned user
- View lead
- Edit lead
- Delete lead
- CSV export

### 3. Add / Edit Lead

Lead fields:

- Full name
- Email
- Phone
- Company
- Lead source
- Lead score
- Assigned salesperson
- Status
- Notes

### 4. Lead Detail

Displays:

- Contact information
- Lead score
- Source
- Assignment
- Status
- Notes
- Activity timeline
- Scheduled follow-ups

Actions:

- Edit
- Convert to customer

### 5. Kanban Status Board

Five columns:

- New
- Contacted
- Qualified
- Lost
- Converted

Drag a lead card to another column to update its status.

### 6. Follow-up Scheduler

Supports:

- Calls
- Emails
- Meetings
- Demos
- Date/time scheduling
- Notes
- Completion tracking
- Delete follow-up

### 7. Reports

Provides:

- Total leads
- Qualified leads
- Converted leads
- Average lead score
- Conversion percentage
- Source analysis
- Pipeline report
- CSV export

### 8. User Management

Includes simulated users and roles:

- Administrator
- Sales Executive

### 9. Authentication

Demo login:

```text
Email: admin@sgleadflow.local
Password: admin123
```

Additional demo account:

```text
Email: sai@sgleadflow.local
Password: sales123
```

> This is simulated frontend authentication for an internship demonstration. It is not intended for production security.

### 10. Bonus Features

- Data visualization
- Lead source tracking
- Activity timeline
- Email/SMS-style activity simulation through follow-up types
- CSV export
- Lead scoring
- Dark mode

---

## Project Structure

```text
lead-management-system/
│
├── index.html
├── login.html
├── README.md
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── storage.js
│   ├── auth.js
│   ├── leads.js
│   ├── followups.js
│   ├── reports.js
│   └── app.js
│
├── pages/
│   └── .gitkeep
│
├── assets/
│   └── images/
│
└── screenshots/
```

The application uses a single-page dashboard interface after login. The `pages/` folder is reserved for future multi-page expansion.

---

## How to Run

### Option 1: Open directly

Open:

```text
login.html
```

in a browser.

### Option 2: VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `login.html`.
4. Select **Open with Live Server**.
5. Sign in using the demo credentials.

---

## Login

Use:

```text
admin@leadflow.local
admin123
```

After login you will be redirected to the CRM dashboard.

---

## LocalStorage

Application data is stored in the browser under:

```text
leadflow_crm_v1
```

This allows:

- Leads to persist after refresh
- Follow-ups to persist
- User session to persist
- Dark mode preference to persist

To reset demo data, open browser Developer Tools → Console and run:

```javascript
CRMStorage.reset();
location.reload();
```

---

## GitHub Setup

Create a GitHub repository, then run:

```bash
git init
git add .
git commit -m "Initial CRM lead management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/lead-management-system.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Recommended Commit History

For an internship submission, meaningful commits are preferable to one giant commit.

Example:

```text
Initial project structure
Add responsive CRM dashboard
Implement lead management
Add lead detail and activity timeline
Implement Kanban pipeline
Add follow-up scheduler
Add reports and CSV export
Add authentication simulation
Add dark mode and responsive improvements
Update README and screenshots
```

---

## Testing Checklist

Before submission, verify:

- [ ] Login works
- [ ] Dashboard loads
- [ ] Add Lead works
- [ ] Edit Lead works
- [ ] Delete Lead works
- [ ] Search works
- [ ] Filters work
- [ ] Lead detail opens
- [ ] Activity timeline displays
- [ ] Kanban drag-and-drop works
- [ ] Follow-up creation works
- [ ] Follow-up completion works
- [ ] Lead conversion works
- [ ] Reports load
- [ ] CSV export works
- [ ] Dark mode works
- [ ] Data persists after refresh
- [ ] Mobile layout works
- [ ] README is included
- [ ] GitHub repository is public

---

## Future Enhancements

For a production CRM, this frontend can be connected to:

- Node.js / Express
- Django
- Firebase
- MySQL
- PostgreSQL
- REST APIs
- Secure authentication
- Role-based authorization
- Email services
- SMS APIs

---

## Disclaimer

This project is designed as a frontend internship submission and demonstration. The authentication and LocalStorage data model are intentionally client-side. Production applications should use server-side authentication, password hashing, authorization and a secure database.
