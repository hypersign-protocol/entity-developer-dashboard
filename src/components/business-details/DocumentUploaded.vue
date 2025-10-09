<template>
    <div class="document-uploaded">
        <div class="section-header">
            <h2 class="section-title">Document Uploaded</h2>
            <p class="section-description">View and manage uploaded business documents</p>
        </div>

        <!-- Document Categories Summary -->
        <div class="document-summary" v-if="documents && documents.length > 0">
            <h3 class="summary-title">Document Summary</h3>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="summary-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="summary-info">
                        <span class="summary-count">{{ documents.length }}</span>
                        <span class="summary-label">Total Documents</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon verified">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="summary-info">
                        <span class="summary-count">{{ verifiedDocuments }}</span>
                        <span class="summary-label">Verified</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon pending">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="summary-info">
                        <span class="summary-count">{{ pendingDocuments }}</span>
                        <span class="summary-label">Pending</span>
                    </div>
                </div>
                <div class="summary-card">
                    <div class="summary-icon rejected">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="summary-info">
                        <span class="summary-count">{{ rejectedDocuments }}</span>
                        <span class="summary-label">Rejected</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Documents Grid -->

        <div v-if="documents && documents.length > 0" class="documents-grid">
            <div v-for="(document, index) in documents" :key="index" class="document-card">
                <div class="document-icon">
                    <i :class="getDocumentIcon(document.type)"></i>
                </div>
                <div class="document-content">
                    <p class="document-type">{{ formatDocumentType(document.type) }}</p>
                    <p class="document-name">{{ document.name || `Document ${index + 1}` }}</p>
                    <p class="document-description">{{ document.description }}</p>
                </div>
                <div class="document-actions">
                    <button class="download-btn" @click="downloadDocument(document)" title="Download Document">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-file-upload"></i>
            </div>
            <h3 class="empty-title">No Documents Uploaded</h3>
            <p class="empty-description">
                No documents have been uploaded for this business verification yet.
            </p>

        </div>
    </div>
</template>

<script>
export default {
    name: "DocumentUploaded",
    props: {
        company: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        documents() {
            // Use actual company documents from the API
            if (!this.company?.documents || this.company.documents.length === 0) {
                return [];
            }

            // Transform API data to component format
            return this.company.documents.map(doc => ({
                id: doc.id,
                name: doc.fileName,
                type: this.getDocumentTypeFromAPI(doc.documentType),
                documentType: doc.documentType,
                size: null,
                uploadDate: this.company.createdAt,
                status: this.getDocumentStatus(),
                description: this.getDocumentDescription(doc.documentType)
            }));
        },
        verifiedDocuments() {
            return this.documents.filter(doc => doc.status === 'verified').length;
        },
        pendingDocuments() {
            return this.documents.filter(doc => doc.status === 'pending').length;
        },
        rejectedDocuments() {
            return this.documents.filter(doc => doc.status === 'rejected').length;
        }
    },
    methods: {
        getDocumentIcon(type) {
            const iconMap = {
                incorporation: 'fas fa-building',
                address: 'fas fa-map-marker-alt',
                attorney: 'fas fa-gavel',
                other: 'fas fa-file-alt'
            };
            return iconMap[type] || 'fas fa-file-alt';
        },

        getDocumentTypeFromAPI(apiType) {
            const typeMap = {
                'CertificateOfIncorporation': 'incorporation',
                'ProofOfAddress': 'address',
                'PowerOfAttorney': 'attorney'
            };
            return typeMap[apiType] || 'other';
        },

        getDocumentStatus() {
            if (!this.company?.status) return 'pending';
            
            const statusMap = {
                'Approved': 'verified',
                'Rejected': 'rejected',
                'InProgress': 'pending',
                'Submitted': 'pending'
            };
            return statusMap[this.company.status] || 'pending';
        },

        getDocumentDescription(documentType) {
            const descriptions = {
                'CertificateOfIncorporation': 'Business incorporation document',
                'ProofOfAddress': 'Address verification document',
                'PowerOfAttorney': 'Legal authorization document'
            };
            return descriptions[documentType] || 'Business document';
        },

        formatDocumentType(type) {
            const typeMap = {
                incorporation: 'Certificate of Incorporation',
                address: 'Proof of Address',
                attorney: 'Power of Attorney'
            };
            return typeMap[type] || 'Document';
        },




        async downloadDocument(docData) {
            try {
                const blob = await this.$store.dispatch('mainStore/downloadKybUploadedFile', {
                    fileId: docData.id
                });

                // Determine file extension based on blob type
                let fileName = docData.fileName || docData.name || `document_${docData.id}`;
                
                if (!fileName.includes('.')) {
                    if (blob.type === 'application/pdf') {
                        fileName += '.pdf';
                    } else if (blob.type.startsWith('image/')) {
                        const ext = blob.type.split('/')[1];
                        fileName += `.${ext}`;
                    } else {
                        fileName += '.pdf';
                    }
                }

                // Create download link and trigger download
                const url = URL.createObjectURL(blob);
                const a = window.document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.style.display = 'none';
                
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                URL.revokeObjectURL(url);
                
            } catch (error) {
                console.error('Error downloading document:', error);
            }
        }
    }
}
</script>

<style scoped>
.document-uploaded {
    max-width: 1200px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.section-header {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
}

.section-description {
    color: #6b7280;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
}

/* Documents Grid */
.documents-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 2rem;
}

.document-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: 4rem;
}

.document-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.document-icon {
    width: 2.5rem;
    height: 2.5rem;
    background: #f3f4f6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.document-icon i {
    font-size: 1rem;
    color: #3b82f6;
}

.document-content {
    flex: 1;
    min-width: 0;
}

.document-type {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.25rem 0;
    line-height: 1.25;
}

.document-name {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.document-description {
    font-size: 0.7rem;
    color: #9ca3af;
    margin: 0.25rem 0 0 0;
    line-height: 1.25;
    font-style: italic;
}

.document-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.download-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b7280;
    font-size: 0.875rem;
}

.download-btn:hover {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

/* Status badges - used in summary icons */

/* Empty State */
.empty-state {
    text-align: center;
    padding: 2rem;
}

.empty-icon {
    font-size: 2rem;
    color: #9ca3af;
    margin-bottom: 1rem;
}

.empty-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.5rem 0;
}

.empty-description {
    color: #6b7280;
    margin: 0 0 1.5rem 0;
    line-height: 1.5;
}




/* Document Summary */
.document-summary {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
    border: 1px solid #e5e7eb;
}

.summary-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 1rem 0;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
}

.summary-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.summary-card:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.summary-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    background-color: #f3f4f6;
    color: #6b7280;
}

.summary-icon.verified {
    background-color: #f0fdf4;
    color: #16a34a;
}

.summary-icon.pending {
    background-color: #fffbeb;
    color: #d97706;
}

.summary-icon.rejected {
    background-color: #fef2f2;
    color: #dc2626;
}

.summary-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.summary-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    line-height: 1;
}

.summary-label {
    font-size: 0.75rem;
    color: #6b7280;
    font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
    .documents-grid {
        grid-template-columns: 1fr;
    }

    .document-card {
        min-height: 3.5rem;
        padding: 0.875rem;
    }

    .document-icon {
        width: 2rem;
        height: 2rem;
    }

    .document-icon i {
        font-size: 0.875rem;
    }

    .download-btn {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.75rem;
    }
}
</style>