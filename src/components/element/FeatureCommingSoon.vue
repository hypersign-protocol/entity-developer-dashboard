<template>
    <div class="mt-3 card" style="max-width: 800px; padding: 45px;">
        <div class="row">
            <div class="col-md-3">
                <i class="fa fa-bullhorn" aria-hidden="true" style="font-size: 8rem;"></i>
            </div>

            <div class="col-md-9">
                <div class="row">
                    <div class="col center" style="font-size: x-large; text-align: center;">
                        Please stay tuned, this feature is coming soon....!
                    </div>
                </div>

                <div class="row mt-3">
                    <div class="col center">
                        <button class="btn btn-secondary" @click.prevent="$router.push('dashboard')">
                            <i class="fa fa-home" aria-hidden="true"></i> Home Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>