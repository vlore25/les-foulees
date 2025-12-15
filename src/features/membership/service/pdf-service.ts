// src/features/membership/services/pdf-service.ts
import { PDFDocument } from 'pdf-lib'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

// On définit une interface pour typer proprement les données d'entrée
interface GeneratePdfParams {
    user: {
        lastname: string
        name: string
        birthdate: Date | null
        address: string
        zipCode: string
        city: string
        email: string
    }
    seasonName: string
    signatureBase64: string
}

export async function generateSignedMembershipPdf({ user, seasonName, signatureBase64 }: GeneratePdfParams): Promise<string> {
    try {
        // 1. Chemins
        const templatePath = path.join(process.cwd(), 'public', 'templates', 'Bulletin_d-adhésion_2025_2026.pdf');
        
        // Nettoyage du nom de saison pour le dossier (ex: "2025-2026" au lieu de "2025 / 2026")
        const safeSeasonName = seasonName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads,', 'docs', 'memberships', safeSeasonName);
        
        const fileName = `Adhesion_${user.lastname}_${user.name}_${Date.now()}.pdf`;
        const outputPath = path.join(uploadDir, fileName);

        // 2. Chargement
        const pdfBuffer = await readFile(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const form = pdfDoc.getForm();

        // 3. Remplissage Texte
        form.getTextField('text_lastname1')?.setText(user.lastname || '');
        form.getTextField('text_firstname')?.setText(user.name || '');
        form.getTextField('text_birthday')?.setText(user.birthdate ? user.birthdate.toLocaleDateString('fr-FR') : '');
        form.getTextField('text_addresse')?.setText(user.address || '');
        form.getTextField('text_zipcode')?.setText(user.zipCode || '');
        form.getTextField('text_city')?.setText(user.city || '');
        form.getTextField('text_email')?.setText(user.email || '');

        // 4. Signature
        if (signatureBase64) {
            // Nettoyage du header base64 si présent
            const cleanBase64 = signatureBase64.includes(',') ? signatureBase64.split(',')[1] : signatureBase64;
            const signatureImageBytes = Buffer.from(cleanBase64, 'base64');
            const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

            const pageToSign = pdfDoc.getPages()[0]; 
            const { width, height } = signatureImage.scale(0.5);

            pageToSign.drawImage(signatureImage, {
                x: 390,
                y: 20, // À ajuster selon votre PDF
                width: 100,
                height: 50,
            });
        }

        // 5. Sauvegarde
        form.flatten();
        const pdfBytes = await pdfDoc.save();

        // Création du dossier et écriture
        await mkdir(uploadDir, { recursive: true });
        await writeFile(outputPath, pdfBytes);

        // Retourne le chemin relatif pour la BDD
        return `/uploads/docs/memberships/${safeSeasonName}/${fileName}`;

    } catch (error) {
        console.error("Erreur PDF Service:", error);
        throw new Error("Impossible de générer le PDF d'adhésion");
    }
}