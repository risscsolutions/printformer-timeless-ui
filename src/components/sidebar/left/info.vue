<template>
    <div class="columns is-multiline p-2 is-align-items-flex-start">
        <div class="column is-24 p-2">
            <slot name="title"></slot>
        </div>
        <div class="column is-2 has-text-centered" v-html="$svg(icon)"></div>
        <div class="column is-22">
            <slot name="info"></slot>
        </div>
        <div class="column is-2 has-text-centered" v-html="$svg('Tipp')">
        </div>
        <div class="column is-22">
            <slot name="tip"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "info",
    props: {
        icon: {type: String}
    }
}
</script>
