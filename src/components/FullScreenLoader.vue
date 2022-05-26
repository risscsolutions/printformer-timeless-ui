<template>
    <div v-show="fullScreenLoaderVisible"
         style="width: 100vw; height: 100vh; position:absolute; top:0; z-index: 1000;">
        <div class="columns mx-0" style="height: 100%;" :class="{'mt-6': editorLoaded}">
            <div v-if="editorLoaded" class="column"
                 :class="{'is-1 width-50': !showroomIsOpen, 'is-6 pr-4': showroomIsOpen }"
                 style="background: white; opacity:.5;"></div>
            <div class="column pl-0"
                 style="background: white;display: flex;flex-direction: column;align-content: center;justify-content: center;flex-wrap: wrap;align-items: center;">
                <span style="  animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;"
                      v-html="$svg('VectorizerLadebalken')"></span>
                <p>Wird geladen...</p>
            </div>
            <div v-if="editorLoaded && !traceControlsIsOpen" class="column px-0 is-1 width-105" style="background: white; opacity:.5;"></div>
        </div>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "FullScreenLoader",
    computed: {
        ...mapState(['fullScreenLoaderVisible', 'showroomIsOpen', 'editorLoaded','traceControlsIsOpen']),
    }
}
</script>
<style>
@keyframes loader-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
