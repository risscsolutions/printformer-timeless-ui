<template>
    <div class="px-4">
        <h2 :class="titleClass">{{ title }}</h2>
        <table class="table is-striped" style="table-layout: fixed;">
            <thead>
            <tr class="has-text-left">
                <th class="has-text-weight-semibold dark-gray-color" style="width: 2rem;">&nbsp;</th>
                <th class="has-text-weight-semibold dark-gray-color" style="width: 33%;">{{ $i18n.translate('Name') }}</th>
                <th class="has-text-weight-semibold dark-gray-color">{{ $i18n.translate('Beschreibung') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(hit, index) in results" class="dark-gray-color">
                <th scope="row" class="has-text-weight-semibold dark-gray-color">
                    {{ (index + 1) }}
                </th>
                <td>{{ hit.display_name }}</td>
                <td>{{ hit.display_comment }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped lang="scss">
.mt-4 {
    p {
        margin-bottom: 0;
    }
}

table, .table.is-striped tbody tr:not(.is-selected):nth-child(even) {
    background-color: transparent;
}

</style>

<script>

export default {
    name: "PreflightResultTable",

    props: {
        results: {
            type: Array | Object
        },
        title: {
            type: String
        },
        severity: {
            type: String
        }
    },
    computed: {
        titleClass() {
            return `has-text-${this.severity}`;
        }
    }
}
</script>
