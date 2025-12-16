import { writeFile, mkdir } from "fs/promises";
import path from "path";

/**
 * Sauvegarde un fichier File (API Web) sur le disque serveur
 * @param file Le fichier uploadé via FormData
 * @param folderPath Le dossier cible dans "public" (ex: "uploads/docs/certificates")
 * @param prefixUniq Un préfixe pour rendre le nom unique (ex: "nom_prenom_id")
 * @returns L'URL publique relative du fichier
 */
export async function saveUploadedFile(
    file: File, 
    folderPath: string, 
    prefixUniq: string = "file"
): Promise<string> {
    
    // 1. Convertir le File en Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Générer un nom de fichier propre et unique
    const ext = path.extname(file.name); // .pdf, .jpg
    // On nettoie le préfixe pour éviter les caractères spéciaux dans le nom de fichier
    const safePrefix = prefixUniq.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `${safePrefix}_${Date.now()}${ext}`;

    // 3. Définir les chemins
    // Le dossier physique sur le serveur
    const uploadDir = path.join(process.cwd(), "public", folderPath);
    
    // 4. Créer le dossier s'il n'existe pas (Sécurité)
    await mkdir(uploadDir, { recursive: true });

    // 5. Écrire le fichier
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // 6. Retourner l'URL publique (pour l'accès web)
    // On utilise folderPath et filename. Note: path.join utilise des \ sur Windows, on force /
    const publicUrl = `/${folderPath}/${filename}`.replace(/\\/g, '/');
    
    return publicUrl;
}