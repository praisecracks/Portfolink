// generateDocx.js
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default async function generateDocx(profile, projects) {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: profile.fullName, bold: true, size: 32 })],
          }),
          new Paragraph(profile.title),
          new Paragraph(profile.bio || ''),

          new Paragraph(''),
          new Paragraph({ text: 'Skills', bold: true }),
          new Paragraph(profile.skills?.join(', ') || ''),

          new Paragraph(''),
          new Paragraph({ text: 'Languages', bold: true }),
          new Paragraph(profile.languages?.join(', ') || ''),

          new Paragraph(''),
          new Paragraph({ text: 'Projects', bold: true }),
          ...projects.map((proj) => new Paragraph(`${proj.title}: ${proj.description}`)),

          new Paragraph(''),
          new Paragraph({ text: 'Generated with Portfolink ❤️', italics: true }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}
