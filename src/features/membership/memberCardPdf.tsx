import { Membership, Season, User } from '@/prisma/generated/client';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { getAssetUrl } from '@/src/lib/utils';
import { fetchImageAsBase64 } from '@/src/features/account/user.action';


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
        + type.slice(1).toLowerCase().replace(/_/g, ' ')

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
                // Utiliser getAssetUrl pour avoir une URL de base
                let imageUrl = getAssetUrl(profileImageUrl);
                
                // Si l'URL est relative, on la rend absolue pour la Server Action
                if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                    imageUrl = `${window.location.origin}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                }

                let imageBytes: ArrayBuffer | null = null;
                let usedCircle = false;

                if (imageUrl.startsWith('data:')) {
                    // C'est déjà du base64
                    const base64Data = imageUrl.split(',')[1];
                    const binaryString = window.atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    imageBytes = bytes.buffer;
                } else {
                    // Utiliser la Server Action pour bypasser le CORS du navigateur
                    const base64 = await fetchImageAsBase64(imageUrl);
                    if (base64) {
                        const base64Data = base64.split(',')[1];
                        const binaryString = window.atob(base64Data);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        imageBytes = bytes.buffer;
                    }
                }

                if (imageBytes) {
                    let processedImageBytes = imageBytes;
                    try {
                        // Tenter de cropper
                        processedImageBytes = await cropToCircle(imageBytes);
                        usedCircle = true;
                    } catch (cropError) {
                        console.warn("Could not crop image to circle, using original", cropError);
                        processedImageBytes = imageBytes;
                    }

                    // Détecter le format de l'image
                    let image;
                    try {
                        if (usedCircle) {
                            image = await pdfDoc.embedPng(processedImageBytes);
                        } else {
                            try {
                                image = await pdfDoc.embedJpg(processedImageBytes);
                            } catch {
                                image = await pdfDoc.embedPng(processedImageBytes);
                            }
                        }
                    } catch (embedError) {
                        console.error("Could not embed image in PDF", embedError);
                    }

                    if (image) {
                        const width = 65;
                        const height = 65;
                        
                        firstPage.drawImage(image, {
                            x: firstPage.getWidth() - 85.5,
                            y: 228,
                            width: width,
                            height: height,
                        });
                    }
                }
            } catch (imgError) {
                console.warn("Error processing profile image for PDF", imgError);
            }
        }

        // Identité
        firstPage.drawText(`${name} ${lastname}`, {
            x: 15,
            y: firstHeight,
            size: 10,
            font: helveticaFont,
            color: textColor
        });

        // Type d'adhésion
        firstPage.drawText(`Adhésion: ${capiType}`, {
            x: 15,
            y: firstHeight - 12,
            size: 8,
            font: helveticaFont,
            color: textColor
        });

        // Saison
        const seasonText = `SAISON ${startDate.getFullYear()} - ${endDate.getFullYear()}`;
        firstPage.drawText(seasonText, {
            x: 15,
            y: firstHeight - 32,
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
        
        // Indispensable pour éviter les erreurs "tainted canvas" si l'image vient d'un autre port/domaine
        img.crossOrigin = "anonymous";

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(url);
                    return reject("Canvas context not found");
                }

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
                canvas.toBlob((resultBlob) => {
                    if (resultBlob) {
                        resultBlob.arrayBuffer().then(resolve);
                    } else {
                        reject("Failed to create blob from canvas");
                    }
                    URL.revokeObjectURL(url);
                }, 'image/png');
            } catch (err) {
                URL.revokeObjectURL(url);
                reject(err);
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject("Failed to load image for cropping");
        };
        img.src = url;
    });
}
