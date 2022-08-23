<template>
    <div v-if="notifications.length">
        <div v-for="notification in notifications">
            <b v-if="notification.type === 'error'"
               class="has-text-danger">{{ $translate('SIDEBAR_LEFT_NOTIFICATIONS_ERROR') }}</b>
            <b v-else-if="notification.type === 'info'"
               class="has-text-info">{{ $translate('SIDEBAR_LEFT_NOTIFICATIONS_INFO') }}</b>
            <b v-else-if="notification.type === 'warning'"
               class="has-text-warning">{{ $translate('SIDEBAR_LEFT_NOTIFICATIONS_WARNING') }}</b>
            <div class="is-flex is-justify-content-space-between is-align-items-center">
                <p>{{ notification.message }}</p>
                <button v-if="notification.action" class="button is-info is-small"
                        @click="doAction(notification.id)">
                    <span class="icon is-small" v-html="$svg('Pfeil3', 'stroke-white')"></span>
                </button>
            </div>
            <hr class="divider my-3">
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "Notifications",
    methods: {
        doAction(id) {
            this.$editor.getNotifications().doAction(id);
        },
    },
    computed: {
        ...mapState(['notifications'])
    }
}
</script>
