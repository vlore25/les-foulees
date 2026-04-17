import { writeFile, mkdir, unlink } from "fs/promises";
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
    try {
        // 1. Convertir le File en Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // 2. Générer un nom de fichier propre et unique
        const ext = path.extname(file.name); // .pdf, .jpg
        // On nettoie le préfixe pour éviter les caractères spéciaux dans le nom de fichier
        const safePrefix = prefixUniq.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safePrefix}_${Date.now()}${ext}`;

        // 3. Définir les chemins
        // Le dossier physique sur le serveur
        const isDev = process.env.NODE_ENV === 'development';
        const baseUploadDir = isDev 
            ? path.join(process.cwd(), "public", "uploads", "les-foulees")
            : "/var/www/uploads/les-foulees";
        
        // On enlève "uploads" du début de folderPath s'il existe pour éviter la répétition
        const subFolder = folderPath.replace(/^uploads\/?/, '');
        const uploadDir = path.join(baseUploadDir, subFolder);
        
        // 4. Créer le dossier s'il n'existe pas (Sécurité)
        await mkdir(uploadDir, { recursive: true });

        // 5. Écrire le fichier
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // En dev, on veut que l'URL corresponde à ce qui est servi par Next.js (sous /public)
        // En prod, on garde le même format d'URL
        const publicUrl = `/uploads/les-foulees/${subFolder}/${filename}`.replace(/\/+/g, '/');
        
        return publicUrl;
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du fichier:", error);
        throw new Error("Impossible de sauvegarder le fichier sur le serveur.");
    }
}

/**
 * Supprime un fichier physique sur le serveur à partir de son URL publique.
 * @param publicUrl L'URL relative du fichier (ex: "/uploads/les-foulees/docs/certificates/...")
 */
export async function deleteUploadedFile(publicUrl: string | null | undefined): Promise<void> {
    if (!publicUrl) return;

    try {
        const isDev = process.env.NODE_ENV === 'development';
        const baseUploadDir = isDev 
            ? path.join(process.cwd(), "public", "uploads", "les-foulees")
            : "/var/www/uploads/les-foulees";

        // Nettoyage de l'URL pour retrouver le chemin relatif
        // L'URL commence par /uploads/les-foulees/
        const relativePath = publicUrl.replace(/^\/uploads\/les-foulees\//, '');
        // On s'assure qu'on ne sort pas du dossier de base (sécurité sommaire)
        if (relativePath.includes('..')) {
            throw new Error("Chemin de fichier invalide.");
        }
        
        const filePath = path.join(baseUploadDir, relativePath);

        await unlink(filePath);
    } catch (error) {
        // Si le fichier n'existe déjà plus, c'est pas grave
        console.warn(`Erreur lors de la suppression du fichier ${publicUrl}:`, error);
    }
}
