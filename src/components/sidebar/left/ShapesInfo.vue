<template>
    <info icon="FormenHinweise">
        <template slot="title">
            <p class="mb-1 like-h4">TIPPS UND HINWEISE</p>
        </template>
        <template slot="info">
            <p>Wenn du eine Form (z.B. ein Rechteck oder einen Kreis) auf der Werbefläche abbilden möchtest, klicke im Menü rechts auf das Symbol <span class="svg-15" v-html="$svg('FormenHinweise')"></span> und wähle deine gewünschte Form.</p>
            <p class="mt-2">Du kannst die Formen einfach mit der Maus größer oder kleiner ziehen.</p>
        </template>
        <template slot="tipp">
            <p>Nutze den Bereich „Ebenen“ in der erweiterten Bearbeitung, um eine Form z.B. hinter einen Text zu legen.</p>
            <p class="mt-2">Platziere deine Form ganz einfach mit Drag & Drop in deiner Werbefläche.</p>
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
