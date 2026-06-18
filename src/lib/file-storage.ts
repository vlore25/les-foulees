import { put, del } from '@vercel/blob';
import path from "path";

/**
 * Sauvegarde un fichier File (API Web) sur Vercel Blob
 * @param file Le fichier uploadé via FormData
 * @param folderPath Le dossier cible dans "public" (ex: "uploads/docs/certificates")
 * @param prefixUniq Un préfixe pour rendre le nom unique (ex: "nom_prenom_id")
 * @returns L'URL absolue publique du fichier sur Vercel Blob
 */
export async function saveUploadedFile(
    file: File, 
    folderPath: string, 
    prefixUniq: string = "file"
): Promise<string> {
    try {
        // 1. Générer un nom de fichier propre et unique
        const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
        // On nettoie le préfixe pour éviter les caractères spéciaux dans le nom de fichier
        const safePrefix = prefixUniq.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safePrefix}_${Date.now()}${ext}`;

        // 2. Définir le chemin dans le blob (ex: uploads/users/victor_lore_123.jpg)
        const subFolder = folderPath.replace(/^uploads\/?/, '');
        const blobPath = subFolder ? `${subFolder}/${filename}` : filename;

        // 3. Uploader le fichier vers Vercel Blob
        const blob = await put(blobPath, file, {
            access: 'public',
            addRandomSuffix: false // On a déjà ajouté Date.now() pour l'unicité
        });

        // 4. Retourner l'URL absolue renvoyée par Vercel Blob
        return blob.url;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde sur Vercel Blob:", error);
        throw new Error("Impossible de sauvegarder le fichier sur le cloud.");
    }
}

/**
 * Supprime un fichier sur Vercel Blob à partir de son URL publique.
 * @param publicUrl L'URL absolue du fichier (ex: "https://...vercel-storage.com/...jpg")
 */
export async function deleteUploadedFile(publicUrl: string | null | undefined): Promise<void> {
    if (!publicUrl) return;

    try {
        await del(publicUrl);
    } catch (error) {
        // Si le fichier n'existe déjà plus, c'est pas grave
        console.warn(`Erreur lors de la suppression du fichier Blob ${publicUrl}:`, error);
    }
}
