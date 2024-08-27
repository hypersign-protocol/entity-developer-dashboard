<template>
    <div class="overflow-hidden mt-3 center">
        <h1>404: Page Not Found</h1>
    </div>
</template>

<script>
import config from "../config"
export default {
    name: 'FourOfour',
    created() {
        document.title = `${config.app.name} - 404`;
    }
}
</script>