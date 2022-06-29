const
    fs = require('fs'),
    {promisify} = require('util'),
    execFile = promisify(require('child_process').execFile),

    sections = {
        "Ants": ["ant"],
        "Aphids": ["aphid"],
        "Bees and wasps": ["bumblebee", "wasp"],
        "Beetles": ["rhinoceros-beetle", "dung-beetle", "dung-beetle-robot"],
        "Butterflies and moths": ["butterfly", "moth"],
        "Caterpillars": ["monarch-caterpillar"],
        "Chrysalises": ["chrysalis"],
        "Cockroaches": ["cockroach"],
        "Dragonflies": ["dragonfly"],
        "Fireflies": ["lightning-bug"],
        "Flies": ["housefly", "hoverfly"],
        "Grasshoppers and locusts": ["locust", "grasshopper"],
        "Ladybugs": ["ladybug"],
        "Mantises": ["mantis"],
        "Millipedes": ["millipede"],
        "Snails": ["snail"],
        "Spiders": ["spider", "spider-prey"],
        "Weta": ["weta"],
        "Woodlice": ["woodlouse"],
        "Worms": ["worm"],
    },

    prompts = {
        ant: "Mechanized ant, artstation",
        aphid: "Mechanized aphid, artstation",
        bumblebee: "Mechanized bumblebee, artstation",
        butterfly: "Mechanized butterfly, artstation",
        chrysalis: "Mechanized chrysalis, artstation",
        cockroach: "Mechanized cockroach, artstation",
        dragonfly: "Mechanized dragonfly, artstation",
        "dung-beetle": "Mechanized dung beetle, artstation",
        "dung-beetle-robot": "Robotic dung beetle, artstation",
        grasshopper: "Mechanized grasshopper, artstation",
        housefly: "Mechanized housefly, artstation",
        hoverfly: "Mechanized hoverfly, artstation",
        ladybug: "Mechanized ladybug, artstation",
        "lightning-bug": "Mechanized lightning bug, artstation",
        locust: "Mechanized locust, artstation",
        mantis: "Mechanized praying mantis, artstation",
        millipede: "Mechanized millipede, artstation",
        "monarch-caterpillar": "Mechanized monarch caterpillar, artstation",
        moth: "Mechanized moth, artstation",
        "rhinoceros-beetle": "Mechanized rhinoceros beetle, artstation",
        snail: "Mechanized snail, artstation",
        spider: "Mechanized spider, artstation",
        "spider-prey": "Mechanized spider with prey, artstation",
        wasp: "Mechanized wasp, artstation",
        weta: "Mechanized weta, artstation",
        woodlouse: "Mechanized woodlouse, artstation",
        worm: "Mechanized earthworm, artstation",
    };

async function build() {
    let
        output = [];

    for (let sectionName in sections) {
        let
            prefixes = sections[sectionName];

        output.push(`
            <div class="gallery-container container pb-5">
                <h2 class="display-6">${sectionName}</h2>
            <div class="gallery">
        `);

        for (let prefix of prefixes) {
            let
                fnPattern = new RegExp(prefix + "-\\d+\\.png"),
                prompt = prompts[prefix],
                promises = [];

            for (let filename of fs.readdirSync('images').sort()) {
                if (!filename.match(fnPattern)) {
                    continue;
                }

                const
                    path = 'images/' + filename,
                    url = path.replace(/\.png$/, ".jpg");

                promises.push(execFile('identify', [path]).then(result => {
                    const
                        dimensions = result.stdout
                            .match(/ (\d+)x(\d+) /)
                            .slice(1)
                            .map(s => parseInt(s, 10));

                    return `
                        <figure>
                            <a href="${url}" title="${prompt}" data-pswp-width="${dimensions[0]}" data-pswp-height="${dimensions[1]}">
                                <img src="${url}" alt="${prompt}" title="${prompt}" loading="lazy" width="${dimensions[0]}" height="${dimensions[1]}">
                            </a>
                        </figure>
                    `;
                }));
            }

            output.push(...await Promise.all(promises));
        }

        output.push(`
                </div>
            </div>
        `);
    }

    return output;
}

build().then(
    output => {
        console.log(output.join("\n"));
    },
    err => {
        console.error(err);
        process.exitCode = 1;
    }
);