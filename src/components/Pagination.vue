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
        const total = parseInt(this.pagesCount);
        const pages=[];
        const endPage = Math.min(this.startPage + this.maxVisible - 1, total);
        for (let i = this.startPage; i <= endPage; i++) {
            pages.push(i);
            }
            return pages
        }
    },
    data() {
        return {
            currentPageNumber: 1,
            startPage: 1,
            maxVisible: 5,
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
       setPageNumer(clickedPage) {
            const total = parseInt(this.pagesCount);
            const maxVisible = this.maxVisible;
            const lastPageInWindow = this.startPage + maxVisible - 1;
            if (clickedPage === lastPageInWindow && clickedPage < total) {
                this.startPage = Math.min(clickedPage - 1, total - maxVisible + 1);
            }
            else if (clickedPage === this.startPage && clickedPage > 1) {
                this.startPage = Math.max(clickedPage - (maxVisible - 2), 1);
            }

            this.currentPageNumber = clickedPage;
            this.$emit('event-page-number', clickedPage);
}
    }
}

</script>