<template>
    <div class="document-uploaded">
        <template v-if="documents.length">
            <header class="section-header">
                <v-icon small>mdi-file-document-multiple-outline</v-icon>
                <h3>Uploaded documents</h3>
                <span class="count-pill">{{ documents.length }}</span>
            </header>

            <ul class="document-list">
                <li v-for="doc in documents" :key="doc.id" class="document-row">
                    <span class="document-icon" aria-hidden="true">
                        <v-icon small>{{ doc.meta.icon }}</v-icon>
                    </span>
                    <div class="document-content">
                        <span class="document-type">{{ doc.meta.label }}</span>
                        <span class="document-name" :title="doc.name">{{ doc.name }}</span>
                    </div>
                    <button
                        type="button"
                        class="download-btn"
                        :disabled="downloadingId === doc.id"
                        :aria-label="`Download ${doc.meta.label}`"
                        title="Download"
                        @click="downloadDocument(doc)"
                    >
                        <v-progress-circular v-if="downloadingId === doc.id" indeterminate size="14" width="2"></v-progress-circular>
                        <v-icon v-else small>mdi-download</v-icon>
                    </button>
                </li>
            </ul>
        </template>

        <empty-container v-else title="No Documents Uploaded" icon="mdi mdi-file-document-outline"
            description="This business hasn't uploaded any documents yet." />
    </div>
</template>

<script>
import UtilsMixin from '../../mixins/utils';

// Labels and icons match the Document Collection tab of the KYB widget configuration;
// the order here is also the order documents are listed in.
const DOCUMENT_TYPES = {
    CertificateOfIncorporation: { label: 'Certificate of Incorporation', icon: 'mdi-domain' },
    TaxRegistration: { label: 'Tax Registration Document', icon: 'mdi-receipt-text-outline' },
    ProofOfAddress: { label: 'Address Proof Document', icon: 'mdi-map-marker-outline' },
    PowerOfAttorney: { label: 'Power of Attorney Document', icon: 'mdi-file-sign' },
};
const OTHER_DOCUMENT = { label: 'Other document', icon: 'mdi-file-document-outline' };
const TYPE_ORDER = Object.keys(DOCUMENT_TYPES);

export default {
    name: "DocumentUploaded",
    mixins: [UtilsMixin],
    props: {
        company: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            downloadingId: null
        };
    },
    computed: {
        documents() {
            const docs = (this.company && this.company.documents) || [];
            const rank = type => {
                const index = TYPE_ORDER.indexOf(type);
                return index === -1 ? TYPE_ORDER.length : index;
            };
            return docs
                .map((doc, index) => ({
                    id: doc.id,
                    name: doc.fileName || `Document ${index + 1}`,
                    documentType: doc.documentType,
                    meta: DOCUMENT_TYPES[doc.documentType] || OTHER_DOCUMENT
                }))
                .sort((a, b) => rank(a.documentType) - rank(b.documentType));
        }
    },
    methods: {
        async downloadDocument(doc) {
            this.downloadingId = doc.id;
            try {
                const blob = await this.$store.dispatch('mainStore/downloadKybUploadedFile', {
                    fileId: doc.id
                });

                // Add an extension from the file type when the name has none
                let fileName = doc.name;
                if (!fileName.includes('.')) {
                    fileName += blob.type.startsWith('image/') ? `.${blob.type.split('/')[1]}` : '.pdf';
                }

                const url = URL.createObjectURL(blob);
                const link = window.document.createElement('a');
                link.href = url;
                link.download = fileName;
                link.style.display = 'none';
                window.document.body.appendChild(link);
                link.click();
                window.document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading document:', error);
                this.notifyErr('Could not download the document. Please try again.');
            } finally {
                this.downloadingId = null;
            }
        }
    }
}
</script>

<style scoped>
.document-uploaded {
    max-width: 1100px;
}

.section-header {
    align-items: center;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 10px;
}

.section-header >>> .v-icon {
    color: #64748b !important;
}

.section-header h3 {
    color: #111827;
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
}

.count-pill {
    background: #f1f5f9;
    border-radius: 999px;
    color: #475569;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 1px 8px;
}

.document-list {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    list-style: none;
    margin: 0;
    padding: 0;
}

.document-row {
    align-items: center;
    display: flex;
    gap: 12px;
    padding: 12px 16px;
}

.document-row + .document-row {
    border-top: 1px solid #f1f5f9;
}

/* Same icon tile as the KYB widget configuration toggle cards */
.document-icon {
    align-items: center;
    background: #eff6ff;
    border-radius: 8px;
    display: inline-flex;
    flex: 0 0 auto;
    height: 36px;
    justify-content: center;
    width: 36px;
}

.document-icon >>> .v-icon {
    color: #2563eb !important;
}

.document-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
}

.document-type {
    color: #111827;
    font-size: 0.875rem;
    font-weight: 600;
}

.document-name {
    color: #64748b;
    font-size: 0.75rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.download-btn {
    align-items: center;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #475569;
    display: inline-flex;
    flex: 0 0 auto;
    height: 32px;
    justify-content: center;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    width: 32px;
}

.download-btn:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
    color: #111827;
}

.download-btn:disabled {
    cursor: wait;
}

.download-btn >>> .v-icon {
    color: inherit !important;
}

</style>
