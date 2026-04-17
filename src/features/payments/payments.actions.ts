'use server'

import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentStatus } from "@/prisma/generated/enums";

export async function updatePaymentStatusAction(paymentId: string, newStatus: PaymentStatus) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus }
    });

    revalidatePath("/admin/paiements");
    revalidatePath("/admin/adherants");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut du paiement:", error);
    return { success: false, message: "Erreur technique." };
  }
}
