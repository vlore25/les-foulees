import { useEffect, useRef, useState } from "react"
import { PDFDocument, PDFName, PDFBool } from "pdf-lib"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Loader2, Eraser } from "lucide-react"

interface PdfPreviewStepProps {
  formData: any
  userProfile: any
  onSignatureComplete: (signatureDataUrl: string) => void
}


export function PdfPreviewStep({ formData, userProfile, onSignatureComplete }: PdfPreviewStepProps) {

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isSigning, setIsSigning] = useState(false)
  const sigCanvas = useRef<SignatureCanvas>(null)

  useEffect(() => {
    async function generatePreview() {
      try {
        const formUrl = '/templates/Bulletin_d-adhésion_2025_2026.pdf'
        const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();
        form.acroForm.dict.set(
          PDFName.of('NeedAppearances'),
          PDFBool.False
        )
        // Remplissage des champs du formulaire PDF avec les données du formulaire et user context
        form.getTextField('text_lastname')?.setText(userProfile.lastname || '')
        form.getTextField('text_firstname')?.setText(userProfile.name || '')
        form.getTextField('text_birthdate')?.setText(userProfile.birthdate?.toLocaleDateString('fr-FR') || '')
        form.getTextField('text_phone')?.setText(userProfile.phone || '')
        form.getTextField('text_address')?.setText(userProfile.address || '')
        form.getTextField('text_zipcode')?.setText(userProfile.zipCode || '')
        form.getTextField('text_city')?.setText(userProfile.city || '')
        form.getTextField('text_email')?.setText(userProfile.email || '')
        form.getTextField('text_urgence_lastname')?.setText(userProfile.emergencyLastName || '')
        form.getTextField('text_urgence_firstname')?.setText(userProfile.emergencyName || '')
        form.getTextField('text_urgence_phone')?.setText(userProfile.emergencyPhone || '')
        form.getRadioGroup('radio_group_phone_directory').select(formData.showPhoneDirectory)
        form.getRadioGroup('radio_group_email_directory').select(formData.showEmailDirectory)

        

        const licenseType = formData.licenseType;
        const ffaNumber = formData.ffa || '';
        const oldClub = formData.club || '';
        if (licenseType === 'RENEWAL') {
          try {
            form.getTextField('text_license_ffa_asso').setText(ffaNumber);
          } catch (e) { console.warn("Champ licence renouvellement introuvable"); }

        } else if (licenseType === 'MUTATION') {

          try {
            form.getTextField('text_license_ffa_mutuation').setText(ffaNumber);
            form.getTextField('text_club_mutuation').setText(oldClub);
          } catch (e) { console.warn("Champs mutation introuvables"); }
        }

        const method = formData.paymentMethod || 'transfer';

        try {
          const boxCheque = form.getCheckBox('checkbox_check');
          const boxVirement = form.getCheckBox('checkbox_transfer');

          boxCheque.uncheck();
          boxVirement.uncheck();

          // CORRECTION : Vérification sur les valeurs majuscules
          if (method === 'CHECK') {
            boxCheque.check();
          } else if (method === 'TRANSFER') {
            boxVirement.check();
          }

        } catch (e) {
          console.warn("Erreur lors du cochage du paiement : vérifiez les noms des champs PDF", e);
        }

        const today = new Date;
        const dateNow = today.toLocaleString("fr", { dateStyle: "full" })

        form.getTextField('text_doc_date').setText(dateNow)

        form.updateFieldAppearances()
        
        const pdfBytes = await pdfDoc.save()
        
        const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })

        setPdfUrl(URL.createObjectURL(blob))
      } catch (e) {
        console.error("Erreur génération PDF:", e)
      }
    }

    generatePreview()
  }, [formData])

  const handleEndDrawing = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // On récupère l'image en base64 (PNG)
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png')
      onSignatureComplete(signatureData)
      setIsSigning(true)
    }
  }

  const clearSignature = () => {
    sigCanvas.current?.clear()
    onSignatureComplete("")
    setIsSigning(false)
  }

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden h-[500px] bg-slate-100 relative">
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            title="Aperçu Adhésion"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        )}
      </div>

      <div className="bg-white p-4 border rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg">
            Votre Signature <span className="text-red-500">*</span>
          </h3>
          <Button variant="ghost" size="sm" onClick={clearSignature} type="button">
            <Eraser className="w-4 h-4 mr-2" /> Effacer
          </Button>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-md bg-slate-50 hover:bg-white transition-colors">
          <SignatureCanvas
            ref={sigCanvas}
            penColor="black"
            canvasProps={{
              className: "w-full h-40 cursor-crosshair rounded-md",
            }}
            onEnd={handleEndDrawing}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Veuillez signer dans le cadre ci-dessus pour valider votre adhésion.
        </p>
      </div>
    </div>
  )
}