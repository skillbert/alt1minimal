import alt1chain from "@alt1/webpack";
import * as path from "path";

var srcdir = path.resolve(__dirname, "./src/");
var outdir = path.resolve(__dirname, "./dist/");

// Wrapper around webpack-chain, most stuff you'll need are direct properties,
// More fine-tuning can be done at config.chain
// The wrapper gives decent webpack defaults for everything alt1/typescript/react related
var config = new alt1chain(srcdir, { ugly: false });

// Exposes all root level exports as UMD (as named package "testpackage" or "TEST" in global scope)
config.makeUmd("testpackage", "TEST");

// The name and location of our entry file (the name is used for output and can contain a relative path)
config.entry("index", "./index.ts");

// Where to output all the stuff
config.output(outdir);


export default config.toConfig();