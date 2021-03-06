"use strict";

let fs = require("fs");

function writeJavascript(file, icons = {}, defaultClass = "") {
    fs.writeFileSync(
        file,
        `
    const icons = {${icons}}
    const defaultClass = "${defaultClass}"

    module.exports = (name, attributes = '') => {
      var replacement = "<svg ";

      if (!icons[name]) {
        console.error('Failed to load SVG ' + name);
        return;
      }

      if (typeof attributes === "object") {
          for (let property in attributes) {
              if (attributes.hasOwnProperty(property)) {
                  let value = typeof attributes[property] == 'string'
                      ? attributes[property]
                      : JSON.stringify(attributes[property]);

                  replacement += property + "='" + value + "' ";
              }
          }
      } else {
          replacement += 'class="' + defaultClass + " " + attributes + '" ';
      }

      return icons[name].replace('<svg ', replacement);
    };
  `
    );
}

class SVG {
    register(options) {
        this.options = Object.assign(
            {
                class: "",
                assets: ["./src/assets/icons/"],
                output: "./src/svg.js",
            },
            options
        );
    }

    boot() {
        let icons = "";

        this.options.assets.forEach(path => {
            let files = this.walker(path);

            files.forEach(file => {
                const iconName = file.replace(".svg", "");
                const icon = fs.readFileSync(path + file) + "";

                icons += `'${iconName}': \`${icon}\`,\n\r`;
            });
        });

        writeJavascript(this.options.output, icons, this.options.class);
    }

    walker(dir, filelist = [], prefix = "") {
        let files = fs.readdirSync(dir);

        files.forEach(file => {
            if (fs.statSync(dir + file).isDirectory()) {
                let folder = file + "/";

                filelist = this.walker(dir + folder, filelist, prefix + folder);
            } else {
                if (!file.endsWith("svg")) return;

                filelist.push(prefix + file);
            }
        });

        return filelist;
    }
}

let svg = new SVG()
svg.register()
svg.boot()
