# Wave Interference - model description

This is a high-level description of the model used in Wave Interference. It's intended for audiences
that are not necessarily technical.

## Waves Screen

This screen depicts a 2D wave on the surface of water, or the cross-section of a spherical wave for sound or light. The
user can choose between a continuous or pulse wave.  The user can control the frequency and amplitude of the wave,
and observe how it appears on the center line in a chart.  For light, the user can also observe the light collecting
on the screen on the right.  The wave speeds can be computed as `wave speed = frequency * wavelength`.

## Interference Screen

This screen has two point sources that can be enabled/disabled independently, and interference patterns emerge from the
overlapping waves.  The point sources are always in-phase.  The interference pattern shows constructive interference
at `d * sin(theta) = m * lambda`.

## Slits Screen

This screen provides an incoming plane wave, and the user can control the location of the barrier, the number of
slits and the location and width of the slits.  According to the Huygens-Fresnel principle, each part of the wave
produces spherical waves, and hence the part that passes through the slit produces spherical waves.

For double-slit (where `d` is the separation between centers of the slits):
* `d sin(θ) = mλ` for maxima,
* `d sin(θ) = (m + 1/2)λ` for minima

see http://electron9.phys.utk.edu/optics421/modules/m1/diffraction_and_interference.htm

For single slit (where `a` is the width of the aperture):
* `a sin(θ) = mλ` for minima
* `a sin(θ) = (m+1/2)λ` for maxima

see http://hyperphysics.phy-astr.gsu.edu/hbase/phyopt/sinslit.html

## Diffraction Screen

Please see https://en.wikipedia.org/wiki/Diffraction for general information about wave diffraction.  In this screen,
the diffraction pattern is computed as the discrete Fast Fourier Transform of the input pattern.

Diffraction through a 2d circular aperture creates an Airy disk pattern, which is described here:
https://en.wikipedia.org/wiki/Airy_disk  

Many dimensions are described in the simulation, explanation and elaboration is provided in 
https://github.com/phetsims/wave-interference/issues/370#issuecomment-484183051

The FFT does not take the wavelength as an argument.  To simulate the wavelength-dependence of the FFT, we artificially 
rescale the size of the aperture itself based on the wavelength, then run the FFT on the artificially sized aperture.  
The artificially-sized aperture does not appear to the user.