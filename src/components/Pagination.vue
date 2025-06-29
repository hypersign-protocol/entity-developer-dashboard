<template>

    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item">
                <span class="page-link" aria-label="Next" style="color:grey; cursor: grab;"
                    @click="previousPageNumber()">
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </span>
            </li>

            <li class="page-item" v-for="page in pages" v-bind:key="page" @click="setPageNumer(page)">
                <a class="page-link" href="#" v-if="page === currentPageNumber">{{ page }}</a>
                <span class="page-link" v-else style="color:grey; cursor: grab;">{{ page }}</span>
            </li>

            <li class=" page-item">
                <span class="page-link" aria-label="Next" style="color:grey; cursor: grab;" @click="nextPageNumber()">
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </span>
            </li>
        </ul>
    </nav>
</template>

<script type="text/javascript">
export default {
    name: 'PagiNation',
    props: {
        pagesCount: { type: [String, Number], default: '3' }
    },
    computed: {
    pages() {
        const parsedPages = parseInt(this.pagesCount);
        return isNaN(parsedPages) || parsedPages < 1 ? 1 : parsedPages;
        }
    },
    data() {
        return {
            currentPageNumber: 1
        }
    },
    methods: {
        previousPageNumber() {
            let newPageNumber = 1;
            if (this.currentPageNumber == 1) {
                newPageNumber = this.currentPageNumber;
            } else {
                newPageNumber = this.currentPageNumber - 1
            }
            this.currentPageNumber = newPageNumber;
            this.$emit('event-page-number', this.currentPageNumber)
        },
        nextPageNumber() {
            this.currentPageNumber = this.currentPageNumber + 1
            this.$emit('event-page-number', this.currentPageNumber)
        },
        setPageNumer(pageNumber) {
            this.$emit('event-page-number', pageNumber)
            this.currentPageNumber = pageNumber;
        }
    }
}

</script>