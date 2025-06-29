(function () {
  const scriptTag = document.currentScript;
  const websiteId = "__WEBSITE_ID__";

  fetch(
    `https://sitepulse-bc6z.onrender.com/api/visit/extrnalsnippet/${websiteId}`
  )
    .then((res) => res.json())
    .then((data) => {
      // Create the main widget container
      const container = document.createElement("div");
      container.style.cssText = `
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
          margin: 20px auto;
          padding: 24px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
          box-sizing: border-box;
        `;

      // Create the header
      const header = document.createElement("div");
      header.style.cssText = `
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        `;
      header.innerHTML = `
          <h3 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
            📊 Website Analytics
          </h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Real-time performance insights</p>
        `;

      // Create cards container
      const cardsContainer = document.createElement("div");
      cardsContainer.style.cssText = `
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        `;

      // SVG Icons
      const icons = {
        liveUsers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>`,
        sessionTime: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
        weeklyUsers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2.5"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>`,
        monthlyUsers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
        quarterlyUsers: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`,
      };

      // Analytics data configuration
      const analyticsData = [
        {
          title: "Live Users",
          value: data.activeUsers,
          icon: icons.liveUsers,
          bgColor: "#f0fdf4",
          borderColor: "#10b981",
        },
        {
          title: "Avg Session Time",
          value: `${(data.averageSessionTime / 1000 / 60).toFixed(1)}m`,
          icon: icons.sessionTime,
          bgColor: "#eff6ff",
          borderColor: "#3b82f6",
        },
        {
          title: "Last 7 Days Users",
          value: data.past7daysUsers,
          icon: icons.weeklyUsers,
          bgColor: "#faf5ff",
          borderColor: "#8b5cf6",
        },
        {
          title: "Last Month Users",
          value: data.pastMonthUsers,
          icon: icons.monthlyUsers,
          bgColor: "#fffbeb",
          borderColor: "#f59e0b",
        },
        {
          title: "Last 3 Months Users",
          value: data.past3MonthsUsers,
          icon: icons.quarterlyUsers,
          bgColor: "#fef2f2",
          borderColor: "#ef4444",
        },
      ];

      // Create individual cards
      analyticsData.forEach((item) => {
        const card = document.createElement("div");
        card.style.cssText = `
            background: ${item.bgColor};
            border: 2px solid ${item.borderColor}20;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            text-align: left;
          `;

        // Add hover effect
        card.addEventListener("mouseenter", () => {
          card.style.transform = "translateY(-2px)";
          card.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
          card.style.borderColor = item.borderColor;
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "translateY(0)";
          card.style.boxShadow = "none";
          card.style.borderColor = `${item.borderColor}20`;
        });

        card.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
              <div style="background: white; padding: 8px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${item.icon}
              </div>
            </div>
            <div style="font-size: 32px; font-weight: 800; margin-bottom: 4px; color: #1f2937; line-height: 1;">
              ${item.value}
            </div>
            <div style="font-size: 14px; color: #6b7280; font-weight: 600;">
              ${item.title}
            </div>
          `;

        cardsContainer.appendChild(card);
      });

      // Create footer with branding
      const footer = document.createElement("div");
      footer.style.cssText = `
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
        `;

      const brandLink = document.createElement("a");
      brandLink.href = "https://sitepulse-bc6z.onrender.com"; // Replace with your actual domain
      brandLink.target = "_blank";
      brandLink.rel = "noopener noreferrer";
      brandLink.style.cssText = `
          color: #6b7280;
          text-decoration: none;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.3s ease;
          padding: 8px 16px;
          border-radius: 6px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        `;
      brandLink.innerHTML = `
          Powered by SitePulse
        `;

      brandLink.addEventListener("mouseenter", () => {
        brandLink.style.color = "#3b82f6";
        brandLink.style.background = "#eff6ff";
        brandLink.style.borderColor = "#3b82f6";
      });

      brandLink.addEventListener("mouseleave", () => {
        brandLink.style.color = "#6b7280";
        brandLink.style.background = "#f9fafb";
        brandLink.style.borderColor = "#e5e7eb";
      });

      footer.appendChild(brandLink);

      // Assemble the widget
      container.appendChild(header);
      container.appendChild(cardsContainer);
      container.appendChild(footer);

      // Add responsive styles
      const style = document.createElement("style");
      style.textContent = `
          @media (max-width: 768px) {
            .analytics-widget {
              margin: 10px;
              padding: 20px;
            }
            .analytics-widget .cards-container {
              grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
              gap: 12px;
            }
            .analytics-widget .card {
              padding: 16px;
            }
            .analytics-widget h3 {
              font-size: 20px !important;
            }
            .analytics-widget .value {
              font-size: 28px !important;
            }
          }
          @media (max-width: 480px) {
            .analytics-widget .cards-container {
              grid-template-columns: 1fr 1fr;
              gap: 10px;
            }
            .analytics-widget .card {
              padding: 14px;
            }
            .analytics-widget .value {
              font-size: 24px !important;
            }
          }
          @media (max-width: 360px) {
            .analytics-widget .cards-container {
              grid-template-columns: 1fr;
            }
          }
        `;
      document.head.appendChild(style);

      // Add classes for responsive targeting
      container.className = "analytics-widget";
      cardsContainer.className = "cards-container";

      // Replace the script tag with the widget
      scriptTag.parentNode.insertBefore(container, scriptTag);
      scriptTag.remove();
    })
    .catch((err) => {
      console.error("Analytics widget error:", err);

      // Create error fallback
      const errorContainer = document.createElement("div");
      errorContainer.style.cssText = `
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 100%;
          margin: 20px auto;
          padding: 20px;
          background: #fef2f2;
          border: 2px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          text-align: center;
          font-size: 14px;
        `;
      errorContainer.innerHTML = `
          <strong>⚠️ Analytics Widget Error</strong><br>
          Unable to load analytics data. Please try again later.
        `;

      scriptTag.parentNode.insertBefore(errorContainer, scriptTag);
      scriptTag.remove();
    });
})();