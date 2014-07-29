var fs = require('fs');

var fileName = process.argv[2];

if (!fileName) {
    console.log('Miss input file');
}

var json = {
    nodes: [],
    edges: []
}

var content = fs.readFileSync(fileName, 'utf-8');

var lines = content.split('\n');
var nameList = lines[0].split('\t').slice(1);

json.nodes = nameList.map(function(name, idx) {
    return {
        name: name,
        radius: Math.max(idx < 4 ? (65 - idx * 2) : (60 - idx * 2), 30),
        image: 'imgs/roles/' + name + '.jpg',
        action: 'role/' + name
    }
});

lines.slice(1).forEach(function(line) {
    var items = line.split('\t');
    var name = items[0];

    items.slice(1).forEach(function(item, idx) {
        if (!item.trim() || nameList[idx] === name) {
            return;
        }
        json.edges.push({
            source: nameList[idx],
            target: name,
            label: item
        });
    });
});

var out = fileName.slice(0, fileName.lastIndexOf('.'));
fs.writeFileSync(out + '.json', JSON.stringify(json, null, 2), 'utf-8');