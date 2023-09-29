Wave Interference
=============
"Wave Interference" is an educational simulation in HTML5, by <a href="https://phet.colorado.edu/" target="_blank">PhET
Interactive Simulations</a>
at the University of Colorado Boulder. For a description of this simulation, associated resources, and a link to the
published version,
<a href="https://phet.colorado.edu/en/simulation/wave-interference" target="_blank">visit the simulation's web page</a>.

### Try it!

<a href="https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html" target="_blank">Click here to
run "Wave Interference".</a>

<a href="https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html" target="_blank">
<img src="https://raw.githubusercontent.com/phetsims/wave-interference/main/assets/wave-interference-screenshot.png" alt="Screenshot" style="width: 400px;"/>
</a>

### Documentation

The <a href="https://github.com/phetsims/phet-info/blob/main/doc/phet-development-overview.md" target="_blank">PhET
Development Overview</a> is the most complete guide to PhET Simulation Development. This guide includes how to obtain
simulation code and its dependencies, notes about architecture & design, how to test and build the sims, as well as
other important information.

### Quick Start

(1) Clone the simulation and its dependencies:

```
git clone https://github.com/phetsims/assert.git
git clone https://github.com/phetsims/axon.git
git clone https://github.com/phetsims/babel.git
git clone https://github.com/phetsims/bamboo.git
git clone https://github.com/phetsims/brand.git
git clone https://github.com/phetsims/chipper.git
git clone https://github.com/phetsims/dot.git
git clone https://github.com/phetsims/griddle.git
git clone https://github.com/phetsims/joist.git
git clone https://github.com/phetsims/kite.git
git clone https://github.com/phetsims/perennial.git perennial-alias
git clone https://github.com/phetsims/phet-core.git
git clone https://github.com/phetsims/phetcommon.git
git clone https://github.com/phetsims/phetmarks.git
git clone https://github.com/phetsims/query-string-machine.git
git clone https://github.com/phetsims/scenery.git
git clone https://github.com/phetsims/scenery-phet.git
git clone https://github.com/phetsims/sherpa.git
git clone https://github.com/phetsims/sun.git
git clone https://github.com/phetsims/tambo.git
git clone https://github.com/phetsims/tandem.git
git clone https://github.com/phetsims/twixt.git
git clone https://github.com/phetsims/utterance-queue.git
git clone https://github.com/phetsims/wave-interference.git
```

(2) Install dev dependencies:

```
cd chipper
npm install
cd ../perennial-alias
npm install
cd ../wave-interference
npm install
```

(3) Change directory to chipper `cd ../chipper/`, then transpile the code to JavaScript by
running `node js/scripts/transpile.js --watch`. This starts a file-watching process that will automatically transpile
new or changed files.

(4) In a new terminal/command prompt, start an http-server

(5) Open in the browser: `http://localhost/wave-interference/wave-interference_en.html` (You will probably need to modify this
URL based on your HTTP port and relative path.)

#### Optional: Build the simulation into a single file

(1) Change directory to the simulation directory: `cd ../wave-interference`

(2) Build the sim: `grunt --brands=adapted-from-phet`. It is safe to ignore warnings
like `>> WARNING404: Skipping potentially non-public dependency`, which indicate that non-public PhET-iO code is not
being included in the build.

(3) Open in the
browser: `http://localhost/wave-interference/build/adapted-from-phet/wave-interference_en_adapted-from-phet.html` (You will
probably need to modify this URL based on your HTTP port and relative path.)

### Get Involved

Contact us at our Google
Group: <a href="http://groups.google.com/forum/#!forum/developing-interactive-simulations-in-html5" target="_blank">
Developing Interactive Simulations in HTML5</a>

Help us improve, create a <a href="http://github.com/phetsims/wave-interference/issues/new" target="_blank">New Issue</a>

### License

See the <a href="https://github.com/phetsims/wave-interference/blob/main/LICENSE" target="_blank">LICENSE</a>
