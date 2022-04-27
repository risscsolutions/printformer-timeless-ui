<template>
    <info icon="TexteHinweise">
        <template slot="info">
            Klicke auf das Textfeld, um Schriften hinzuzufügen und zu formatieren.
        </template>
        <template slot="tipp">
            Mit einem <b>einfachem Klick</b> auf das Textfeld kannst du die Größe des Rahmens ändern, drehen und
            verschieben.
            <br>
            Mit einem <b>doppelten Klick</b> in das Textfeld kannst du den Text innerhalb der Rahmens beliebig
            verändern.
        </template>
    </info>
</template>

<script>
import Info from "./info";

export default {
    name: "texts-info",
    components: {Info}
}
</script>
