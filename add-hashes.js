const fs = require('fs');
var crypto = require('crypto');

const htmlFolder = "./build/";
const cssFolder = "./build/css/";
const jsFolder = "./build/js/";
const imgFolder = "./build/img/";

const formats = {
    html: ["html"],
    css: ["css", "css.gz"],
    js: ["js", "js.gz"],
    img: [
        "png",
        "png.gz",
        "svg",
        "svg.gz",
        "jpg",
        "jpg.gz",
        "webp",
        "webp.gz",
        "jpeg",
        "jpeg.gz",
    ]
}

const readFiles = (folder, formats) => fs.readdirSync(folder)
    .filter(name => formats.some(format => name.endsWith(format)))
    .map(name => folder + name);

const readHtmlFiles = () => readFiles(htmlFolder, formats.html);
const readCssFiles = () => readFiles(cssFolder, formats.css);
const readJsFiles = () => readFiles(jsFolder, formats.js);
const readImgFiles = () => readFiles(imgFolder, formats.img);

const calcHash = (file) => {
    const hash = crypto.createHash('sha256');
    hash.setEncoding('hex');
    hash.write(fs.readFileSync(file))
    hash.end();
    return hash.read().substring(0, 10);
}

const calcNewFileName = (formats, fileName) => {
    const hash = calcHash(fileName);
    const format = formats.find(format => fileName.endsWith(format));
    return fileName.replace(`.${format}`, `-${hash}.${format}`)
}

const move = (formats, fileName) => {
    const newFileName = calcNewFileName(formats, fileName);
    fs.renameSync(fileName, newFileName);

    const from = fileName.replace("./build/", "./");
    const to = newFileName.replace("./build/", "./");
    return [from, to];
}

const replaceContent = (fileName, replaceFun) => {
    const content = fs.readFileSync(fileName).toString();
    const newContent = replaceFun(content);
    fs.writeFileSync(fileName, newContent);
}

const addHashes = () => {
    const movements = [
        ...readCssFiles().map(fileName => move(formats.css, fileName)),
        ...readJsFiles().map(fileName => move(formats.js, fileName)),
        ...readHtmlFiles().map(fileName => move(formats.img, fileName)),
    ];

    const replaceFun = content => movements.reduce((result, [from, to]) => result.replaceAll(from, to), content)

    const files = [
        ...readCssFiles(),
        ...readJsFiles(),
        ...readHtmlFiles(),
    ]

    files.forEach(fileName => replaceContent(fileName, replaceFun));
}

addHashes()
