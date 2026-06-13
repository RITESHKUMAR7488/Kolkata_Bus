const fs = require('fs');
const ts = require('typescript');

function compileAndRun() {
  const src = fs.readFileSync('./src/lib/routingEngine.ts', 'utf8');
  const js = ts.transpileModule(src, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
  fs.writeFileSync('./scratch/compiledRoutingEngine.js', js.replace(/require\(['"].*busdata.json['"]\)/, "require('../src/data/busdata.json')"));
}

compileAndRun();
const routing = require('./scratch/compiledRoutingEngine.js');
console.log("Direct:", routing.findDirectRoutes('Dum Dum', 'Sealdah').length);
console.log("One-change Bandel to Sealdah:", routing.findOneChangeRoutes('Bandel', 'Sealdah').length);
