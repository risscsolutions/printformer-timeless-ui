<template>
    <div class="columns is-multiline p-2 is-vcentered">

        <div class="column is-24 p-2">
            <slot name="title"></slot>
        </div>
        <div class="column is-one-fifth has-text-centered" v-html="$svg(icon)"></div>
        <div class="column is-four-fifths">
            <slot name="info"></slot>
        </div>
        <div class="column is-one-fifth has-text-centered" v-html="$svg('Tipp')">
        </div>
        <div class="column is-four-fifths">
            <slot name="tipp"></slot>
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
