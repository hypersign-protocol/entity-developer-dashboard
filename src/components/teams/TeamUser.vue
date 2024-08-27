<template>
    <b-list-group-item class="d-flex align-items-center" style="min-height: 70px;">
        <b-avatar variant="primary" text="VB" class="mr-2"></b-avatar>
        <span class="mr-auto">vishwas@gmail.com</span>
        <span class="mx-1" style="color:grey"><b-icon icon="check" aria-hidden="true"></b-icon>2FA</span>
        <b-badge pill variant="info" class="mx-1">2 teams</b-badge>
        <b-dropdown size="sm" variant="link" toggle-class="text-decoration-none" no-caret dropleft>
            <template #button-content>
                <b-icon style="color:grey" icon="list" aria-hidden="true"></b-icon>
            </template>
            <b-dropdown-item-button style="text-align: left;">Delete</b-dropdown-item-button>
        </b-dropdown>
    </b-list-group-item>
</template>