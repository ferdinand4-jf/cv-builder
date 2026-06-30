"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePDF = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const generatePDF = async (cv) => {
    const browser = await puppeteer_1.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
        const page = await browser.newPage();
        // Generate HTML from CV data
        const html = generateCVHTML(cv);
        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });
        // Generate PDF
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '40px',
                bottom: '40px',
                left: '40px',
                right: '40px',
            },
        });
        return Buffer.from(pdf);
    }
    finally {
        await browser.close();
    }
};
exports.generatePDF = generatePDF;
const generateCVHTML = (cv) => {
    const { personalInfo, experience, education, skills, languages, certifications, projects, styling } = cv;
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: ${styling.fontFamily || 'Inter'}, sans-serif;
            font-size: ${styling.fontSize || 14}px;
            color: #1a202c;
            line-height: 1.6;
            padding: 0;
            margin: 0;
          }
          .container {
            max-width: 100%;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 3px solid ${styling.primaryColor || '#3b82f6'};
          }
          .header h1 {
            color: ${styling.primaryColor || '#3b82f6'};
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          .header .contact {
            color: ${styling.secondaryColor || '#1e293b'};
            font-size: 0.9rem;
          }
          .section {
            margin-bottom: 1.5rem;
          }
          .section h2 {
            color: ${styling.primaryColor || '#3b82f6'};
            font-size: 1.2rem;
            border-bottom: 2px solid ${styling.primaryColor || '#3b82f6'}33;
            padding-bottom: 0.3rem;
            margin-bottom: 0.8rem;
          }
          .experience-item, .education-item, .project-item {
            margin-bottom: 1rem;
          }
          .experience-item .header, .education-item .header, .project-item .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0.2rem;
            text-align: left;
          }
          .experience-item h3, .education-item h3, .project-item h3 {
            font-size: 1.1rem;
            margin: 0;
          }
          .experience-item .company, .education-item .institution {
            font-weight: 500;
            color: ${styling.secondaryColor || '#1e293b'};
          }
          .experience-item .date, .education-item .date {
            font-size: 0.85rem;
            color: #64748b;
          }
          .experience-item .description {
            margin-top: 0.3rem;
            font-size: 0.95rem;
          }
          .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .skill-tag {
            background: ${styling.primaryColor || '#3b82f6'}22;
            color: ${styling.primaryColor || '#3b82f6'};
            padding: 0.2rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
          }
          .languages-list, .certifications-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .languages-list li, .certifications-list li {
            padding: 0.2rem 0;
          }
          .project-item .link {
            color: ${styling.primaryColor || '#3b82f6'};
            text-decoration: none;
          }
          .project-item .link:hover {
            text-decoration: underline;
          }
          @media print {
            body { padding: 0; }
            .container { max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>
            <div class="contact">
              ${personalInfo.email}
              ${personalInfo.phone ? ` • ${personalInfo.phone}` : ''}
              ${personalInfo.address ? ` • ${personalInfo.address}` : ''}
            </div>
            ${personalInfo.linkedin || personalInfo.portfolio ? `
              <div class="contact" style="margin-top: 0.3rem;">
                ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" style="color: ${styling.primaryColor || '#3b82f6'}; text-decoration: none;">LinkedIn</a>` : ''}
                ${personalInfo.linkedin && personalInfo.portfolio ? ' • ' : ''}
                ${personalInfo.portfolio ? `<a href="${personalInfo.portfolio}" style="color: ${styling.primaryColor || '#3b82f6'}; text-decoration: none;">Portfolio</a>` : ''}
              </div>
            ` : ''}
          </div>

          ${personalInfo.summary ? `
            <div class="section">
              <h2>Professional Summary</h2>
              <p>${personalInfo.summary}</p>
            </div>
          ` : ''}

          ${experience && experience.length > 0 ? `
            <div class="section">
              <h2>Experience</h2>
              ${experience.map((exp) => `
                <div class="experience-item">
                  <div class="header">
                    <div>
                      <h3>${exp.position}</h3>
                      <div class="company">${exp.company}</div>
                    </div>
                    <div class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || ''}</div>
                  </div>
                  <div class="description">${exp.description}</div>
                  ${exp.achievements && exp.achievements.length > 0 ? `
                    <ul style="margin-top: 0.3rem; padding-left: 1.5rem;">
                      ${exp.achievements.map((a) => `<li>${a}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${education && education.length > 0 ? `
            <div class="section">
              <h2>Education</h2>
              ${education.map((edu) => `
                <div class="education-item">
                  <div class="header">
                    <div>
                      <h3>${edu.degree} in ${edu.field}</h3>
                      <div class="institution">${edu.institution}</div>
                    </div>
                    <div class="date">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate || ''}</div>
                  </div>
                  ${edu.gpa ? `<div style="font-size: 0.9rem; margin-top: 0.2rem;">GPA: ${edu.gpa}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${skills && skills.length > 0 ? `
            <div class="section">
              <h2>Skills</h2>
              <div class="skills-list">
                ${skills.map((skill) => `
                  <span class="skill-tag">${skill.name} (${skill.level})</span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${languages && languages.length > 0 ? `
            <div class="section">
              <h2>Languages</h2>
              <ul class="languages-list">
                ${languages.map((lang) => `
                  <li>${lang.name} - ${lang.level}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${certifications && certifications.length > 0 ? `
            <div class="section">
              <h2>Certifications</h2>
              <ul class="certifications-list">
                ${certifications.map((cert) => `
                  <li>${cert.name} - ${cert.issuer} (${cert.date})</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          ${projects && projects.length > 0 ? `
            <div class="section">
              <h2>Projects</h2>
              ${projects.map((project) => `
                <div class="project-item">
                  <div class="header">
                    <div>
                      <h3>${project.name}</h3>
                    </div>
                  </div>
                  <div class="description">${project.description}</div>
                  ${project.link ? `<a href="${project.link}" class="link" target="_blank">View Project</a>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
};
//# sourceMappingURL=pdfService.js.map