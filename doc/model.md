The wave is represented on a 2D discrete lattice, and we use use the discretization of the wave equation described in
http://www.mtnmath.com/whatth/node47.html and known as a finite difference method.

The lattice extends beyond the visible region, and damping is applied near the boundaries to minimize the effects of
reflection and artifacts around the edges.

In the fourth screen, we use a Fast Fourier Transform (FFT) in order to compute the diffraction pattern, see
https://en.wikipedia.org/wiki/Diffraction