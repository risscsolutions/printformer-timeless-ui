<template>
    <div class="column is-24 p-2">
        <div class="columns">
            <div class="column is-one-fifth has-text-centered"
                 style="align-content: center;justify-content: center;align-items: center;">
                  <span v-if="icon"
                        :class="{'svg-50': true, 'spinning': state === 'loading'}"
                        v-html="$svg(icon)"></span>
            </div>
            <div class="column is-four-fifths">
                <span class="has-text-weight-semibold dark-gray-color">Schritt {{ step }}:</span><br>
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Step",
    props: {
        step: {},
        text: {},
        state: {},
    },
    computed: {
        icon() {
            switch (this.state) {
                case 'loading':
                    return 'Ladebalken';
                case 'complete':
                    return 'Herunter';
                case 'failed':
                    return 'PfeilFormen'
            }
            return null;
        }
    }
}
</script>
