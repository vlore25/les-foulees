import { saveUploadedFile } from "../src/lib/file-storage";
import fs from "fs/promises";
import path from "path";

async function testUpload() {
    console.log("--- Test Upload ---");
    
    // Simulate a simple file (Web API File like in Next.js)
    const fileName = "test-image.png";
    const content = Buffer.from("fakedata-image-content");
    const file = new File([content], fileName, { type: "image/png" });

    try {
        // Enforce development mode for the test
        process.env.NODE_ENV = "development";
        
        const folder = "uploads/tests";
        const prefix = "user123";
        
        console.log(`Saving file: ${fileName} to ${folder} with prefix ${prefix}...`);
        
        const publicUrl = await saveUploadedFile(file, folder, prefix);
        
        console.log("SUCCESS: File saved!");
        console.log("Returned URL:", publicUrl);

        // Verify file existence in public folder
        const expectedDir = path.join(process.cwd(), "public", "uploads", "les-foulees", "tests");
        const files = await fs.readdir(expectedDir);
        
        const uploadedFile = files.find(f => f.startsWith("user123_") && f.endsWith(".png"));
        
        if (uploadedFile) {
            const filePath = path.join(expectedDir, uploadedFile);
            console.log(`Verified file on disk: ${filePath}`);
            
            // Cleanup
            await fs.unlink(filePath);
            console.log("Cleaned up test file.");
        } else {
            console.error("FAILURE: File not found in expected directory.");
        }

    } catch (error) {
        console.error("An error occurred during test:", error);
    }
}

testUpload();
