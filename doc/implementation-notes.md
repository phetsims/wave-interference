# Wave Interference - implementation notes

This document contains notes related to the implementation of Wave Interference. The audience for this document is 
software developers who are familiar with JavaScript and PhET simulation development, as described in
[PhET Development Overview](https://github.com/phetsims/phet-info/blob/master/doc/phet-development-overview.md).

Before reading this document, see [model.md](https://github.com/phetsims/wave-interference/blob/master/doc/model.md), 
which provides a high-level description of the simulation model.

## Overview

The Wave Interference simulation depicts waves on a 2 dimensional surface and the interference patterns they create.  
The first 3 screens show a 2D lattice and time-based wave propagation, while the fourth screen shows the interference 
pattern from a slit with a given 2d shape, which is instantly updated.  

The query string `?log` can be used to output the selected frequency and wavelenth, for debugging.
Other sim-specific query parameters are described in
[WaveInterferenceQueryParameters](https://github.com/phetsims/wave-interference/blob/master/js/common/WaveInterferenceQueryParameters.js).

There are no dynamically created/destroyed user interface components or model elements in the simulation, so the
simulation doesn't require dispose calls.

## The first three Screens: Waves, Interference, Slits

The first three screens are mainly implemented in js/common.  

[WavesModel](https://github.com/phetsims/wave-interference/blob/master/js/waves/model/WavesModel.js) is the
main model for these screens.  
Each [WavesModel](https://github.com/phetsims/wave-interference/blob/master/js/waves/model/WavesModel.js)
contains 3 [Scene](https://github.com/phetsims/wave-interference/blob/master/js/common/model/Scene.js) instances, one for 
each of water, sound and light.  Most settings (such as whether the waves are turned on or off) are independent for each
[Scene](https://github.com/phetsims/wave-interference/blob/master/js/common/model/Scene.js), and each [Scene](https://github.com/phetsims/wave-interference/blob/master/js/common/model/Scene.js) has its own physical model and [Lattice.ts](https://github.com/phetsims/scenery-phet/blob/master/js/Lattice.ts).
The tools which appear in the toolbox are shared
across each [Scene](https://github.com/phetsims/wave-interference/blob/master/js/common/model/Scene.js). 

There are 3 coordinate frames:
* lattice coordinates (integer)
* Scene-specific physical coordinates (such as cm or nm)
* view coordinates

Coordinate transformations between these frames are defined in [Scene](https://github.com/phetsims/wave-interference/blob/master/js/common/model/Scene.js):
```js
// @public {ModelViewTransform2} - converts the model coordinates (in the units for this scene) to lattice
// coordinates, does not include damping regions
this.modelToLatticeTransform = ...;

// @public {ModelViewTransform2|null} - transforms from the physical units for this scene to view coordinates,
// filled in after the view area is initialized, see setViewBounds
this.modelViewTransform = ...;

// @public {ModelViewTransform2|null} - transforms from lattice coordinates to view coordinates, filled in after
// the view area is initialized, see setViewBounds
this.latticeToViewTransform = ...;
```

The wave is represented on a single 2D discrete scalar lattice, and we use use the discretization of the wave equation 
described in http://www.mtnmath.com/whatth/node47.html and known as a finite difference method:

```
f(x,y,t+1) = c*c(f(x+1,y,t) + f(x-1,y,t) + f(x,y-1,t) + f(x,y+1,t) - 4*f(x,y,t)) - f(x,y,t-1) + 2*f(x,y,t)
```
The description for the wave speed `c` is given in [Lattice.ts](https://github.com/phetsims/scenery-phet/blob/master/js/Lattice.ts)

The lattice extends beyond the visible region, and damping is applied near the boundaries to minimize the effects of
reflection and artifacts around the edges.

We run the physics on a finite discrete lattice, but must match up with the correct values (frequency, wavelength and
wave speed) for each scene.  Run the simulation with `?dev` to get corresponding output in the console.  Use the stopwatch 
and sim play/pause feature to record one cycle.  To measure the wave speed, let the light propagate to the edge of the 
boundary, then use the measuring tape to measure distance and divide by the elapsed time on the stopwatch.

The time constants have been tuned in [WavesModel](https://github.com/phetsims/wave-interference/blob/master/js/waves/model/WavesModel.js) so that the observed wavelength and oscillation time are 
correct.

The following values can also be reported by running with`?log`.

### Water
| Value | Frequency (Hz) | Wavelength (cm) |
| :--- | ---: | ---: |
| min | 0.25 | 7.4 |
| max | 1 | 1.85 |

Wave speed measured at 7.1E-2/1.43 = 5cm/sec.  In https://github.com/phetsims/wave-interference/issues/43 we decided this
is a reasonable wave speed for a wave pool, even though it doesn't match wave speeds for, say, oceanic waves.

### Sound
| Value | Frequency (Hz) | Wavelength (cm) |
| :--- | ---: | ---: |
| min | 220 | 156 |
| max | 440 | 78 |

### Light
| Color | Frequency (THz) | Wavelength (nm) | 
| :--- | ---: | ---: | 
| Red (VisibleColor min) | 384.35 | 780.00 | 
| Violet (VisibleColor max) | 788.93 | 380.00 | 

For green light, measuring the distance traveled by a wavefront and dividing by time gives 2807.3E-9/9.75E-15 = 287928205 m/s, which is about 4% off of the true speed of light.  Measuring the colored wavefront for green, I see a deviation of < 1%. Since the distance and wave propagation speeds are independent of frequency, measurements for different colors will
give the same speed of light.  See also [WavesModel](https://github.com/phetsims/wave-interference/blob/master/js/waves/model/WavesModel.js) usage of `timeScaleFactor` for how the model is calibrated.

### Slits Screen
Here is a schematic for the two-slit dimensions:
![schematic for the two-slit dimensions](images/slitDimensions.jpg?raw=true "Two-Slit Dimensions")

By using `?dev`, you can show the [TheoryInterferenceOverlay](https://github.com/phetsims/wave-interference/blob/master/js/slits/view/TheoryInterferenceOverlay.js), which depicts `d sin(θ) = mλ` (theoretical maxima) and `d sin(θ) = (m+1/2)λ` (theoretical minima). See https://github.com/phetsims/wave-interference/issues/74

## The Final Screen: Diffraction
In the fourth screen, we use a Fast Fourier Transform (FFT) in order to compute the diffraction pattern, see
https://en.wikipedia.org/wiki/Diffraction.  A 3rd party library is used to compute the FFT.

There are 5 apertures (each shown in a scene) with different tunable characteristics.  The aperture renders to a canvas
in the model for the sake of determining which points in the aperture are open and closed.  The same "render to canvas" 
code is used for rendering crisp images in the view.

The FFT does not take the wavelength as an argument.  To simulate the wavelength-dependence of the FFT, we artificially 
rescale the size of the aperture itself based on the wavelength, then run the FFT on the artificially sized aperture.  
The artificially-sized aperture does not appear to the user.