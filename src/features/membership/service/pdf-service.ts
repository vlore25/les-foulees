// src/features/membership/service/pdf-service.ts
import { PDFDocument, PDFName, PDFBool } from 'pdf-lib'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

// 1. On met à jour l'interface pour accepter les objets complets
interface GeneratePdfParams {
    user: {
        lastname: string
        name: string
    }
    seasonName: string
    signatureBase64: string
    userProfile: any
    formData: any
}

export async function generateSignedMembershipPdf({
    user,
    seasonName,
    signatureBase64,
    userProfile,
    formData
}: GeneratePdfParams): Promise<string> {

    try {
        // --- 1. CONFIGURATION CHEMINS ---
        const templatePath = path.join(process.cwd(), 'public', 'templates', 'Bulletin_d-adhésion_2025_2026.pdf');

        // Nettoyage du nom de saison (ex: "2025-2026")
        const safeSeasonName = seasonName.replace(/[^a-zA-Z0-9-_]/g, '_');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'docs', 'memberships', safeSeasonName);

        // Nom du fichier final
        const fileName = `Adhesion_${user.lastname}_${user.name}_${Date.now()}.pdf`;
        const outputPath = path.join(uploadDir, fileName);

        // --- 2. CHARGEMENT PDF ---
        const pdfBuffer = await readFile(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const form = pdfDoc.getForm();

        form.acroForm.dict.set(
            PDFName.of('NeedAppearances'),
            PDFBool.False
        )


        // --- 3. REMPLISSAGE TEXTE ---
        form.getTextField('text_lastname')?.setText(userProfile.lastname || '');
        form.getTextField('text_firstname')?.setText(userProfile.name || '');

        const birthDateStr = userProfile.birthdate
            ? new Date(userProfile.birthdate).toLocaleDateString('fr-FR')
            : '';
        form.getTextField('text_birthdate')?.setText(birthDateStr);

        form.getTextField('text_phone')?.setText(userProfile.phone || '');
        form.getTextField('text_address')?.setText(userProfile.address || '');
        form.getTextField('text_zipcode')?.setText(userProfile.zipCode || '');
        form.getTextField('text_city')?.setText(userProfile.city || '');
        form.getTextField('text_email')?.setText(userProfile.email || '');
        form.getTextField('text_urgence_lastname')?.setText(userProfile.emergencyLastName || '');
        form.getTextField('text_urgence_firstname')?.setText(userProfile.emergencyName || '');
        form.getTextField('text_urgence_phone')?.setText(userProfile.emergencyPhone || '');
        form.getTextField('text_doc_date')?.setText(new Date().toLocaleDateString('fr-FR'));

        const phoneChoice = formData.showPhoneDirectory ? 'on' : 'off';
        const emailChoice = formData.showEmailDirectory ? 'on' : 'off';
        console.log(phoneChoice, emailChoice)
        form.getRadioGroup('radio_group_phone_directory').select(phoneChoice);
        form.getRadioGroup('radio_group_email_directory').select(emailChoice);

        // --- 4. LICENCE & CLUB (Logique conditionnelle) ---
        const licenseType = formData.licenseType; // RENEWAL ou MUTATION
        const ffaNumber = formData.ffa || '';
        const oldClub = formData.club || '';

        if (licenseType === 'RENEWAL') {
            try { form.getTextField('text_license_ffa_asso')?.setText(ffaNumber); } catch (e) { }
        } else if (licenseType === 'MUTATION') {
            try {
                form.getTextField('text_license_ffa_mutuation')?.setText(ffaNumber);
                form.getTextField('text_club_mutuation')?.setText(oldClub);
            } catch (e) { }
        }

        // --- 6. PAIEMENT (CHECKBOXES) ---
        const method = formData.paymentMethod; // "CHECK" ou "TRANSFER"
        try {
            const boxCheque = form.getCheckBox('checkbox_check');
            const boxVirement = form.getCheckBox('checkbox_transfer');

            // On décoche tout d'abord pour être sûr
            boxCheque.uncheck();
            boxVirement.uncheck();

            if (method === 'CHECK') boxCheque.check();
            if (method === 'TRANSFER') boxVirement.check();
        } catch (e) {
            console.warn("Erreur Checkbox Paiement:", e);
        }

        const status = form.getCheckBox('checkbox_status')
        status.uncheck();
        status.check();

        // --- 7. SIGNATURE ---
        if (signatureBase64) {
            try {
                const cleanBase64 = signatureBase64.includes(',') ? signatureBase64.split(',')[1] : signatureBase64;
                const signatureImageBytes = Buffer.from(cleanBase64, 'base64');
                const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

                const pageToSign = pdfDoc.getPages()[0];

                // Ajustez ces coordonnées (x, y) selon votre PDF
                pageToSign.drawImage(signatureImage, {
                    x: 410,
                    y: 35,
                    width: 65,
                    height: 30,
                });
            } catch (sigError) {
                console.error("Erreur intégration signature:", sigError);
            }
        }


        form.updateFieldAppearances()

        const pdfBytes = await pdfDoc.save()

        // Création dossier si inexistant
        await mkdir(uploadDir, { recursive: true });
        await writeFile(outputPath, pdfBytes);

        return `/uploads/docs/memberships/${safeSeasonName}/${fileName}`;

    } catch (error) {
        console.error("Erreur PDF Service Global:", error);
        throw new Error("Impossible de générer le PDF d'adhésion");
    }
}