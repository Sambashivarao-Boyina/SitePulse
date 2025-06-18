const Website = require("../modals/website")
const path = require("path");
const fs = require("fs");

module.exports.createCDNofWebsite = async (req, res) => {
    const website = await Website.findById(req.params.id);

    if (!website) {
        return res.send("");
    }

    if (website.status === "Disable") {
    
        res.set("Content-Type", "application/javascript");
        return res.send("");
    }

    const scriptPath = path.join(__dirname, "/scriptTemplate/template.js");

    fs.readFile(scriptPath, "utf8", (err, data) => {
      if (err) return res.status(500).send("Error loading script");

      const finalScript = data.replace(/__WEBSITE_ID__/g, req.params.id);

      res.set("Content-Type", "application/javascript");
      res.send(finalScript);
    });

}