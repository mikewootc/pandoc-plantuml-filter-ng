var pandoc = require('pandoc-filter');
var fs = require('fs');
var execSync = require("child_process").execSync;
var path = require('path');
var util = require('util');

var imgCounter = 0;

function filterPlantuml(type, value, format, meta) {
    if (type !== 'CodeBlock') {
        return null;
    }

    var cls = value[0][1];
    if (0 > cls.indexOf('plantuml')) {
        return null;
    }

    var umlText = value[1];

//    var plantumlPath = path.join(__dirname, "plantuml.8036.jar");
//    var res = execSync(util.format("java -splash:no -jar \"%s\" -charset UTF-8 -pipe", plantumlPath), { input: umlText });
    var plantumlPath = path.join(__dirname, "plantuml-1.2023.0.jar");
    var res = execSync(util.format("java -splash:no -jar \"%s\" -charset UTF-8 -pipe -Itheme-mike.puml", plantumlPath), { input: umlText });
    var tempDirName = ".temp";
    try {
        if (!fs.existsSync(tempDirName)) {
            fs.mkdirSync(tempDirName);
        }

        var fileName = util.format("%d.png", imgCounter++);
        var filePath = path.join(tempDirName, fileName);
        fs.writeFileSync(filePath, res);

        return pandoc.Para(
            [
                pandoc.Image(
                    ['', [], []],
                    [], // Description under image
                    [filePath, '' /* hint */])
            ]);
    } catch(error) {
        logger.error('##################### plantuml-filter error:', error);
        throw error;
    } finally {
        fs.rmdirSync(tempDirName);
    }
}

// var data = JSON.parse(json);
// var format = (process.argv.length > 2 ? process.argv[2] : '');
// var output = filter(data, action, format);
// process.stdout.write(JSON.stringify(output));


// [sberkov] kept for tests
//
// var data = require("./1.json");
// var res = pandoc.filter(data, filterPlantuml, "");
// var strRes = JSON.stringify(res);
// 
// fs.writeFile("2.json", strRes, function (err) {
//     if (err) {
//         return console.log(err);
//     }
// 
//     console.log("The file was saved!");
// }); 

pandoc.toJSONFilter(filterPlantuml);
