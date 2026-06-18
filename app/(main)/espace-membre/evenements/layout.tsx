import { verifyValidatedMembership } from "@/src/lib/session";

export default async function EvenementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // L'utilisateur sera redirigé s'il n'a pas d'adhésion validée
  await verifyValidatedMembership();

  return <>{children}</>;
}
