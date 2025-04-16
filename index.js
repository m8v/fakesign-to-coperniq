// Import the docusign payload
import { docusignPayload } from './docusign_payload.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API configuration
const CONFIG = {
  coperniq: {
    apiKey: process.env.COPERNIQ_API_KEY,
    apiUrl: process.env.COPERNIQ_API_URL || "https://api.coperniq.io/v1",
    matchBy: "primaryEmail",
    matchFoundStrategy: "enrich"
  },
  supportedTemplates: ["New_Contract"]
};

// EXTRACT
/**
 * Extract contact information from DocuSign signer data
 * @param {Object} signer - The signer object from DocuSign
 * @returns {Object} Contact information object
 */
const extractContactInfo = (signer) => {
    return {
        "name": signer.name,
        "email": signer.email,
        "phone": signer.phone || "", // Phone might not be in the payload
        "address": `${signer.address.street1}, ${signer.address.street2 ? signer.address.street2 + ', ' : ''}${signer.address.city}, ${signer.address.state}, ${signer.address.zipCode}, ${signer.address.country}`
    }
}

/**
 * Extract envelope data from DocuSign payload
 * @param {Object} payload - The DocuSign webhook payload
 * @returns {Object} Extracted envelope data
 */
const extractEnvelopeData = (payload) => {
    const { status, templateId } = payload.data.envelopeSummary;
    const signers = payload.data.envelopeSummary.recipients.signers;
    
    return { status, templateId, signers };
};

// TRANSFORM
/**
 * Build project payload for Coperniq API
 * @param {Object} envelopeData - The extracted envelope data
 * @returns {Object} Coperniq project object
 */
const transformToProject = (envelopeData) => {
    const contact = extractContactInfo(envelopeData.signers[0]);

    return {
        "title": contact.name,
        "address": [ contact.address ],
        "trades": [
            "Solar" // TODO: Extract trades from a custom field in the DocuSign envelope
        ],
        "size": 10.0, // KW
        "value": 50000, // USD
        "status": "ACTIVE",
        "primaryEmail": contact.email,
        "primaryPhone": contact.phone
    }
}

// LOAD
/**
 * Create a project in Coperniq based on project data
 * @param {Object} projectData - The transformed project data
 * @returns {Promise<Object>} The created project
 */
const loadProjectToCoperniq = async (projectData) => {
    // Query parameters for matching
    const queryParams = new URLSearchParams({
        match_by: CONFIG.coperniq.matchBy,
        match_found_strategy: CONFIG.coperniq.matchFoundStrategy
    });
    
    const response = await fetch(`${CONFIG.coperniq.apiUrl}/projects?${queryParams}`, {
        method: 'POST',
        headers: {
            'x-api-key': CONFIG.coperniq.apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }
    
    return response.json();
};

/**
 * Process DocuSign webhook payload using ETL pattern
 * @param {Object} payload - The DocuSign webhook payload
 * @returns {Promise<Object|null>} The created project or null
 */
const processDocuSignWebhook = async (payload) => {
    try {
        // Extract
        const envelopeData = extractEnvelopeData(payload);
        
        // Validate conditions
        if (envelopeData.status !== "completed") {
            console.log("Envelope is not completed, skipping");
            return null;
        }
        
        if (!CONFIG.supportedTemplates.includes(envelopeData.templateId)) {
            console.log("Template ID is not supported, skipping");
            return null;
        }
        
        // Transform
        const projectData = transformToProject(envelopeData);
        console.log("Project payload:", JSON.stringify(projectData, null, 2));
        
        // Load
        const coperniqProject = await loadProjectToCoperniq(projectData);
        console.log("Successfully created project in Coperniq:", coperniqProject.id);
        return coperniqProject;
    } catch (error) {
        console.error("Error processing DocuSign webhook:", error.message);
        throw error;
    }
}

// Execute the main function
processDocuSignWebhook(docusignPayload)
    .then(result => {
        if (result) {
            console.log("Process completed successfully");
        }
    })
    .catch(error => {
        console.error("Process failed:", error);
        process.exit(1);
    });