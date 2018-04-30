The wave is represented on a 2D discrete lattice, and we use use the discretization of the wave equation described in
http://www.mtnmath.com/whatth/node47.html and known as a finite difference method:

f(x,y,t+1) = c*c(f(x+1,y,t) + f(x-1,y,t) + f(x,y-1,t) + f(x,y+1,t) - 4*f(x,y,t)) - f(x,y,t-1) + 2*f(x,y,t).
The description for the wave speed c is given in Lattice.js

The lattice extends beyond the visible region, and damping is applied near the boundaries to minimize the effects of
reflection and artifacts around the edges.

We run the physics on a finite discrete lattice, but must match up with the correct values (frequency, wavelength and
wave speed) for all frequencies of light.  This table describes the desired values for light.  Run the simulation with
?dev to get corresponding output in the console.  Use the stopwatch and sim play/pause feature to record one cycle.  To
measure the wave speed, let the light propagate to the edge of the boundary, then use the measuring tape to measure distance
and divide by the elapsed time on the stopwatch.

| Color | Frequency (THz) | Wavelength (nm) | Time for one oscillation (fs) |
| --- | --- | --- | --- |
| Red (VisibleColor min) | 384.35 | 780.00 | 2.60 |
| Green (VisibleColor mid) | 586.64 | 511.03 | 1.70 |
| Violet (VisibleColor max) | 788.93 | 380.00 | 1.27 |

# Diffraction Screen
In the fourth screen, we use a Fast Fourier Transform (FFT) in order to compute the diffraction pattern, see
https://en.wikipedia.org/wiki/Diffraction