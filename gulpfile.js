//Crear las funciones de importacion (paquetes)
const {src, dest, watch, parallel} = require("gulp"); //El require extrae a gulp que se encuentra en el package.json que a su vez se encuentra las funcionalidades de gulp en node_modules

//CSS
const sass = require("gulp-sass")(require("sass"));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer"); //Se encarga de volver el codigo de css compatible en cualquier navegador //Funciona con postcss por eso no lleva gulp en su declaracion
const cssnano = require("cssnano"); //Comprime el archivo de css //Funciona con postcss por eso no lleva gulp en su declaracion
const postcss = require("gulp-postcss"); //Ciertas transformaciones por medio de css nano y autoprefixer
const sourcemaps = require("gulp-sourcemaps");

//Imagenes
const cache = require("gulp-cache");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

//JavaScript
const terser = require("gulp-terser-js");

function css(callBack){
    src("src/scss/**/*.scss")//Identificar el archivo SASS
        .pipe(sourcemaps.init()) //Se inicializa el sourcemap
        .pipe(plumber())
        .pipe(sass())//Compilar
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write(".")) //Coloco un punto para indicarle que es la misma carpeta de la hoja de estilos de CSS en el src
        .pipe(dest("build/css"))//Almacenar en el disco duro
    callBack();
}

function imagenes(callBack) {
    const opciones= {
        optimizationLevel: 3
    }

    src("src/img/**/*.{png,jpg}")//Identifica el archivo
        .pipe(cache(imagemin(opciones)))
        .pipe(dest("build/img"))
    callBack();
}

function versionWebp(callBack){
    const opciones= {
        quality: 50
    }

    src("src/img/**/*.{png,jpg}")//Identifica el archivo
        .pipe(webp(opciones))//Compila
        .pipe(dest("build/img"))
    callBack();
}

function versionAvif(callBack){
    const opciones= {
        quality: 50
    }

    src("src/img/**/*.{png,jpg}")//Identifica el archivo
        .pipe(avif(opciones))//Compila
        .pipe(dest("build/img"))
    callBack();
}

function javaScript(callBack){
    src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write("."))
        .pipe(dest("build/js"))
    callBack();
}

function dev(callBack){
    watch("src/scss/**/*.scss", css) //Al colocar los asteriscos se globalizan todos los archivos de un mismo tipo, en este caso en esta carpeta buscara todos los de tipo scss
    watch("src/js/**/*.js", javaScript) 
    callBack();
}

exports.css = css;
exports.javaScript = javaScript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javaScript, dev);