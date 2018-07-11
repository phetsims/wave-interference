The Wave Interference simulation was ported from Java in 2018.  The first 3 screens show a 2D lattice and time-based
wave propagation, while the final screen shows the interference pattern from a slit with a given 2d shape, which
is instantly updated.  The query string ?dev will output debugging information to the console.

# Waves, Interference, Slits Screens

The first three screens are mainly coded in js/common.

There are 3 coordinate frames:
* view coordinates
* lattice coordinates (integer), with damping regions
* model metric coordinates (such as cm), corresponding to physical measures

There is only a single lattice, so all waves are combined and cannot be deconvoluted.  The light panel cannot show multiple
colors at the same time.

The wave is represented on a 2D discrete lattice, and we use use the discretization of the wave equation described in
http://www.mtnmath.com/whatth/node47.html and known as a finite difference method:

```
f(x,y,t+1) = c*c(f(x+1,y,t) + f(x-1,y,t) + f(x,y-1,t) + f(x,y+1,t) - 4*f(x,y,t)) - f(x,y,t-1) + 2*f(x,y,t)
```
The description for the wave speed c is given in Lattice.js

The lattice extends beyond the visible region, and damping is applied near the boundaries to minimize the effects of
reflection and artifacts around the edges.

We run the physics on a finite discrete lattice, but must match up with the correct values (frequency, wavelength and
wave speed) for all frequencies of light.  This table describes the desired values for light.  Run the simulation with
?dev to get corresponding output in the console.  Use the stopwatch and sim play/pause feature to record one cycle.  To
measure the wave speed, let the light propagate to the edge of the boundary, then use the measuring tape to measure distance
and divide by the elapsed time on the stopwatch.

The time constants have been tuned in WavesScreenModel.js so that the observed Wavelength and Oscillation Time are correct.
These tables can be used to verify those values if they need fine tuning (say if we need to adjust the wavelength scaling
of light on the lattice).

## Water (values recorded April 30, 2018)
| Value | Frequency (Hz) | Wavelength (cm) |
| :--- | ---: | ---: |
| min | 4 | 9.2 |
| mid | 12 | 2.7 |
| max | 20 | 1.7 |

Wave speed measured at 7.1E-2/1.43 = 5cm/sec.  In https://github.com/phetsims/wave-interference/issues/43 we decided this
is a reasonable wave speed for a wave pool, even though it doesn't match wave speeds for, say, oceanic waves.

## Sound (values recorded April 30, 2018)
| Value | Frequency (Hz) | Wavelength (cm) |
| :--- | ---: | ---: |
| min |  |  |
| mid |  |  |
| max |  |  |

In the Java version, sound is observed to be traveling 351.7 m/s.  We will need to change the stopwatch units to get this to work in HTML5
because we want the wave area to be 1m. TODO(after-webgl): calibrate after view optimized
Also, the default frequency of sound in the Java version is measured to be 52cm = E5 (the E above concert A)
See https://pages.mtu.edu/~suits/notefreqs.html
However, Java sound does not show a good interference pattern because the wavelength on the lattice is too big

## Light
| Color | Frequency (THz) | Wavelength (nm) | Oscillation Time (fs) |
| :--- | ---: | ---: | ---: |
| Red (VisibleColor min) | 384.35 | 780.00 | 2.60 |
| Green (VisibleColor mid) | 586.64 | 511.03 | 1.70 |
| Violet (VisibleColor max) | 788.93 | 380.00 | 1.27 |

For green light, measuring the distance traveled by a wavefront and dividing by time gives 2807.3E-9/9.75E-15 = 287928205 m/s,
which is about 4% off of the true speed of light.  Measuring the colored wavefront for green, I see a deviation of < 1%.
Since the distance and wave propagation speeds are independent of frequency, measurements for different colors will
give the same speed of light.

Here is a schematic for the two-slit dimensions:
![schematic for the two-slit dimensions](images/slitDimensions.jpg?raw=true "Two-Slit Dimensions")

# Diffraction Screen
In the fourth screen, we use a Fast Fourier Transform (FFT) in order to compute the diffraction pattern, see
https://en.wikipedia.org/wiki/Diffraction