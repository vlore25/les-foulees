import { Membership, Season, User } from '@/prisma/generated/client';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';



interface MemberCardPdfProps {
    userData: User;
    memberShipData: Membership;
    season: Season;
}

export async function memberCardPdf({ userData, memberShipData, season }: MemberCardPdfProps) {


    const { name, lastname } = userData;
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
        link.download = 'my-modified-file.pdf'; // The name of the file
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