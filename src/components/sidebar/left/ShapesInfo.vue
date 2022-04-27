<template>
    <info icon="FormenHinweise">
        <template slot="info">
            Klicke auf das Formenfeld, um Motive hinzufügen und zu bearbeiten.
        </template>
        <template slot="tipp">
            Du kannst deine Motive per Drag & Drop auf deiner Werbefläche platzieren.
        </template>
    </info>
</template>

<script>
import Info from "./info";

export default {
    name: "shapes-info",
    components: {Info}
}
</script>
