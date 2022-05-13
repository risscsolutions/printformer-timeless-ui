<template>
    <info icon="FormenHinweise">
        <template slot="info">
            <p> Klicke auf das Formenfeld, um Motive hinzufügen und zu bearbeiten.</p>
        </template>
        <template slot="tipp">
            <p>Du kannst deine Motive per Drag & Drop auf deiner Werbefläche platzieren.</p>
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
