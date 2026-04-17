import { Membership, Season, User } from '@/prisma/generated/client';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';



interface MemberCardPdfProps {
    userData: User;
    memberShipData: Membership;
    season: Season;
}

export async function memberCardPdf({ userData, memberShipData, season }: MemberCardPdfProps) {


    const { name, lastname, profileImageUrl } = userData;
    const { type } = memberShipData
    const { startDate, endDate } = season

    const capiType =
        type.charAt(0)
        + type.slice(1).toLowerCase()

    try {

        const cardTemplate = '/templates/card.pdf';
        const existingPdfBytes = await fetch(cardTemplate).then(res => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const firstHeight = 237;
        const textColor = rgb(0.26, 0.23, 0.23);
        const licenseTextColor = rgb(0.13, 0.52, 0.12)

        if (profileImageUrl) {
            try {
                // S'assurer que l'URL est absolue si c'est un chemin relatif
                const absoluteUrl = profileImageUrl.startsWith('http') 
                    ? profileImageUrl 
                    : `${window.location.origin}${profileImageUrl}`;

                const imageBytes = await fetch(absoluteUrl).then(res => res.arrayBuffer());
                
                let processedImageBytes = imageBytes;
                try {
                    processedImageBytes = await cropToCircle(imageBytes);
                } catch (cropError) {
                    console.warn("Could not crop image to circle, using original", cropError);
                }

                // Détecter le format de l'image (PNG ou JPEG/Autre)
                // pdf-lib supporte embedPng et embedJpg
                let image;
                try {
                    image = await pdfDoc.embedPng(processedImageBytes);
                } catch (e) {
                    image = await pdfDoc.embedJpg(processedImageBytes);
                }

                const width = 65;
                const height = 65;
                
                firstPage.drawImage(image, {
                    x: firstPage.getWidth() - 85.5,
                    y: 228,
                    width: width,
                    height: height,
                });
            } catch (imgError) {
                console.warn("Could not embed profile image in PDF", imgError);
            }
        }

        firstPage.drawText(`${name} ${lastname}`, {
            x: 15,
            y: firstHeight,
            size: 10,
            font: helveticaFont,
            color: textColor
        });

        firstPage.drawText(`${name} ${lastname}`, {
            x: 15,
            y: firstHeight,
            size: 10,
            font: helveticaFont,
            color: textColor
        });

        firstPage.drawText(`Type de license: ${capiType}`, {
            x: 15,
            y: firstHeight - 10,
            size: 7,
            font: helveticaFont,
            color: textColor
        });

        firstPage.drawText(`SEASON ${startDate.getFullYear()} - ${endDate.getFullYear()}`, {
            x: 15,
            y: firstHeight - 30,
            size: 10,
            font: helveticaFont,
            color: licenseTextColor
        });

        firstPage.drawText(`SEASON ${startDate.getFullYear()} - ${endDate.getFullYear()}`, {
            x: 15,
            y: firstHeight - 30,
            size: 10,
            font: helveticaFont,
            color: licenseTextColor
        });

        // 1. Generate the bytes
        const pdfBytes = await pdfDoc.save();
        const compatibleBytes = new Uint8Array(pdfBytes);
        const blob = new Blob([compatibleBytes], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // 4. Create a temporary anchor element and click it
        const link = document.createElement('a');
        link.href = url;
        link.download = `Carte_Adherent_${lastname}_${name}.pdf`;
        document.body.appendChild(link);
        link.click();

        // 5. Cleanup: remove the link and revoke the URL to save memory
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return
    } catch (error) {
        console.error('Error modifying or downloading PDF:', error);
    }
}

async function cropToCircle(imageBuffer: ArrayBuffer): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const blob = new Blob([imageBuffer]);
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        // Nécessaire pour les images provenant d'un autre domaine (CORS)
        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (!ctx) return reject("Canvas context not found");

            // Créer le chemin du cercle
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();

            // Dessiner l'image centrée dans le cercle
            ctx.drawImage(
                img,
                (img.width - size) / 2, (img.height - size) / 2, size, size,
                0, 0, size, size
            );

            // Convertir le canvas en ArrayBuffer
            canvas.toBlob((blob) => {
                blob?.arrayBuffer().then(resolve);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };

        img.onerror = reject;
        img.src = url;
    });
}