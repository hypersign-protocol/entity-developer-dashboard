<template>
    <div class="  overflow-hidden" style="text-align:center;padding-top:20px;">
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