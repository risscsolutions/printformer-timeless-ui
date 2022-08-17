<template>
    <div v-show="fullScreenLoaderVisible"
         style="width: 100vw; height: 100vh; position:absolute; top:0; z-index: 1000;">
        <div class="columns mx-0" style="height: 100%;" :class="{'mt-6': editorLoaded}">
            <div v-if="editorLoaded" class="column"
                 :class="{'is-1 width-50': !showroomIsOpen, 'is-6 pr-4': showroomIsOpen }"
                 style="background: white; opacity:.5;"></div>
            <div class="column pl-0"
                 style="background: white;display: flex;flex-direction: column;align-content: center;justify-content: center;flex-wrap: wrap;align-items: center;">
                <span style="animation: 1.6s cubic-bezier(0.46, 0.03, 0.52, 0.96) 0s infinite normal none running loader-ring;"
                      v-html="$svg('Ladebalken','svg-150')"></span>
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
