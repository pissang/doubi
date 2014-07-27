var fs = require('fs');

// var fileName = process.argv[2];

// if (!fileName) {
    // console.log('Miss input file');
// }
// 

var fileName = 'relation3.txt';

var json = {}

var content = fs.readFileSync(fileName, 'utf-8');

var currentActor;

var radius = 50;

content.split('\n').forEach(function(line) {
    var items = line.split('\t');

    var actor = items[0];
    if (currentActor != actor) {
        currentActor = actor;
        json[actor] = {
            nodes: [{
                name: actor,
                radius: 80
            }],
            edges: []
        };

        radius = 50;
    }

    var works = items[1];
    var worksType = items[2];
    var friend = items[3];
    var friendType = items[4];

    if (works) {
        json[actor].nodes.push({
            name: works,
            radius: radius,
            image: 'imgs/小时代演员作品图/' + actor + '/' + works + '.jpg'
        });
        json[actor].edges.push({
            source: actor,
            target: works,
            label: worksType
        });
    }
    if (friend) {
        json[actor].nodes.push({
            name: friend,
            radius: radius,
            image: 'imgs/小时代人脉图/' + actor + '/' + friend + '.jpg'
        });
        json[actor].edges.push({
            source: actor,
            target: friend,
            label: friendType
        });
    }

    radius -= 5;
});

var out = fileName.slice(0, fileName.lastIndexOf('.'));
fs.writeFileSync(out + '.json', JSON.stringify(json, null, 2), 'utf-8');