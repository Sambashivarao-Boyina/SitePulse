
# SitePulse

SitePulse is a **website monitoring and analytical platform** that helps developers track their website’s uptime, response times, and user interactions in real-time with powerful dashboards and automated alerting systems.

🔗 **Live Website:** [https://sitepulse-bc6z.onrender.com/](https://sitepulse-bc6z.onrender.com/)

---

## 🚀 Features

- **Website Monitoring**
  - Automatically checks website status and response time every 5 minutes.
  - Sends alerts via email when the website is down.
  - Allows adding multiple team members to receive downtime notifications.
  - If there are **continuous 3 alerts**, the website is disabled in SitePulse and must be manually re-enabled for safety.

- **Visitor Analytics**
  - Integrate a lightweight **script CDN** in the website header to track:
    - Total visits
    - Number of users visited each day
    - Active users in real-time
    - Device type distribution
    - Session durations
    - Routes visited within the site

- **Analytical Dashboard**
  - Intuitive dashboard to view and analyze visit data.
  - Heatmap showing approximate user visit locations.

- **Live Stats Badge**
  - Embed a **live stats badge** directly into your website to display current analytics publicly or privately.

- **Structured Documentation**
  - Comprehensive guides and integration steps are available within the platform for seamless onboarding.

---

## 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Shadcn
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time:** WebSockets
- **Authentication:** Clerk

---

## 📝 Getting Started

### Prerequisites

- Node.js
- MongoDB instance
- Clerk credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sambashivarao-Boyina/SitePulse
   cd SitePulse


2. **Setup environment variables**

   * For the **server**, create a `.env` file inside the `server` directory:

     ```env
     MONGO_URI=your_mongodb_connection_string
     CLERK_SECRET_KEY=your_clerk_secret
     CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
     ```

   * For the **client**, create a `.env` file inside the `client` directory if required for environment-specific variables (e.g. Vite base URL).

3. **Install dependencies**

   * For the **server**:

     ```bash
     cd server
     npm install
     ```

   * For the **client**:

     ```bash
     cd ../client
     npm install
     ```

4. **Run the applications**

   * **Start the server**

     ```bash
     cd server
     node app.js
     ```

   * **Start the client**

     In a new terminal:

     ```bash
     cd client
     npm run dev
     ```

---

## 📄 Documentation

Full integration and usage documentation is available on the [SitePulse website](https://sitepulse-bc6z.onrender.com/docs) under the **Documentation** section.

---

> **Note:** Heatmap user locations are approximate and not accurate to exact addresses due to privacy and IP geolocation limitations.

