"""Export the opening's botanical linework from build_lycoris.py's photo-study formulas.

Uses the same seed, six florets, recurved tepal profiles and 42 filament/style paths.
The Blender model is unchanged; this is a light SVG layer for the opening dissolve.
"""
import math
import random
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

def add(*vs):
    return tuple(sum(v[i] for v in vs) for i in range(3))

def mul(v, s):
    return tuple(x*s for x in v)

def sub(a, b):
    return add(a, mul(b, -1))

def dot(a, b):
    return sum(x*y for x, y in zip(a, b))

def cross(a, b):
    return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])

def norm(v):
    return mul(v, 1 / math.sqrt(dot(v, v)))

emblem = '--emblem' in sys.argv
view = norm((-.12, .79, .6) if emblem else (-.277, .238, .931))
right = norm(cross((0, 1, 0), view))
up = cross(view, right)
all_points = []

def project(p):
    point = (p[0], p[2]-1.05, -p[1])
    xy = (dot(point, right)*150, -dot(point, up)*150)
    all_points.append(xy)
    return xy

def xy(p):
    return ' '.join(f'{x:.2f}' for x in project(p))

def polyline(points, close=False):
    return 'M' + ' L'.join(xy(p) for p in points) + (' Z' if close else '')

def spline(points):
    path = 'M' + xy(points[0])
    for i in range(len(points)-1):
        p0, p1 = points[max(0, i-1)], points[i]
        p2, p3 = points[i+1], points[min(len(points)-1, i+2)]
        c1 = add(p1, mul(sub(p2, p0), 1/6))
        c2 = sub(p2, mul(sub(p3, p1), 1/6))
        path += f' C{xy(c1)} {xy(c2)} {xy(p2)}'
    return path

def profile(t, curl, stretch, radius):
    if t < .14:
        q = t/.14
        return .17*q, .044*q*q*(3-2*q)
    q = (t-.14)/.86
    theta = -math.pi/2+curl*q
    contraction = 1-.46*q
    return (.17+stretch*contraction*math.cos(theta)-.035*q*q,
            .044+radius+radius*contraction*math.sin(theta))

rng = random.Random(41577100)
UP = (0, 0, 1)
florets = []
for h in range(6):
    a = -math.pi/2+h*math.tau/5+rng.uniform(-.11,.11) if h < 5 else -.2
    r = rng.uniform(.32,.42) if h < 5 else .07
    origin = (r*math.cos(a), r*math.sin(a), .73+rng.uniform(-.08,.08)+(.30 if h == 5 else 0))
    outward, tangent = (math.cos(a),math.sin(a),0), (-math.sin(a),math.cos(a),0)
    axis = norm(add(mul(outward,.95 if h < 5 else .52), mul(UP,rng.uniform(.24,.46) if h < 5 else .80)))
    upright = norm(cross(axis,tangent))
    petals, filaments = [], []
    pedicel = spline([(0,0,.35), (origin[0]*.48,origin[1]*.48,.55), origin])
    for j in range(6):
        roll = j*math.tau/6+h*.31+rng.uniform(-.07,.07)
        radial = add(mul(tangent,math.cos(roll)),mul(upright,math.sin(roll)))
        normal = norm(cross(axis,radial))
        curl, stretch, radius = rng.uniform(4.85,6), rng.uniform(.190,.235), rng.uniform(.17,.22)
        half_width, phase = rng.uniform(.052,.066), rng.uniform(0,math.tau)
        sides = [[], []]
        for k in range(49):
            t = k/48
            axial, rho = profile(t,curl,stretch,radius)
            center = add(origin,mul(axis,axial),mul(radial,rho),mul(normal,.020*math.sin(math.pi*t)*math.sin(phase+t*6)))
            a0,r0 = profile(max(0,t-.001),curl,stretch,radius)
            a1,r1 = profile(min(1,t+.001),curl,stretch,radius)
            direction = norm(add(mul(axis,a1-a0),mul(radial,r1-r0)))
            surface = norm(cross(direction,normal))
            twist = .24*math.sin(phase+t*4)+.28*t
            width_axis = add(mul(normal,math.cos(twist)),mul(surface,math.sin(twist)))
            width = half_width*math.sin(math.pi*t)**.60*(1-.36*t)+.0015
            flutter = (.008*math.sin(t*math.pi*18+phase)+.003*math.sin(t*math.pi*31))*math.sin(math.pi*t)
            for index, side in enumerate([-1,1]):
                sides[index].append(add(center,mul(width_axis,side*width),mul(surface,flutter)))
        delay = h*.105+j*.07
        petals.append(f'<path class="bloom-petal" data-delay="{delay:.3f}" pathLength="1" d="{polyline(sides[0]+sides[1][::-1],True)}"/>')
        fan = (j-2.5)*.17+rng.uniform(-.055,.055)
        d = add(mul(outward,math.cos(fan)),mul(tangent,math.sin(fan)))
        length = rng.uniform(1.46,1.73)
        tip = add(origin,mul(d,length),mul(UP,rng.uniform(.42,.97)+(.28 if h == 5 else 0)))
        controls = [add(origin,mul(axis,.10)),add(origin,mul(d,length*.32),mul(UP,-.10+.035*j)),add(origin,mul(d,length*.77),mul(UP,.05+.045*j)),tip]
        delay = h*.23+j*.095
        filaments.append(f'<path class="bloom-filament" data-delay="{delay:.3f}" pathLength="1" d="{spline(controls)}"/>')
    tip = add(origin,mul(outward,1.77),mul(UP,.47))
    style = spline([origin,add(origin,mul(outward,.70),mul(UP,-.06)),add(origin,mul(outward,1.30),mul(UP,.06)),tip])
    filaments.append(f'<path class="bloom-filament bloom-style" data-delay="{h*.23+.18:.3f}" pathLength="1" d="{style}"/>')
    depth = dot((origin[0],origin[2],-origin[1]),view)
    florets.append((depth,f'<g><path class="bloom-pedicel" d="{pedicel}"/>'+''.join(petals+filaments)+'</g>'))

x0, y0 = (min(p[i] for p in all_points) for i in range(2))
x1, y1 = (max(p[i] for p in all_points) for i in range(2))
margin = 20
vb = f'{x0-margin:.2f} {y0-margin:.2f} {x1-x0+margin*2:.2f} {y1-y0+margin*2:.2f}'
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none" aria-hidden="true">
<defs><linearGradient id="bloom-petal-ink" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#ffa895"/><stop offset=".32" stop-color="#ff3353"/><stop offset="1" stop-color="#7f122d"/></linearGradient>
<radialGradient id="bloom-filament-ink" gradientUnits="userSpaceOnUse" cx="0" cy="45" r="310"><stop class="bloom-ink-core"/><stop class="bloom-ink-middle" offset=".5"/><stop class="bloom-ink-edge" offset="1"/></radialGradient>
<filter id="bloom-halo" x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<g id="bloom-umbel">{''.join(x[1] for x in sorted(florets))}</g></defs>
<use href="#bloom-umbel" class="bloom-flower-halo" filter="url(#bloom-halo)"/>
<use href="#bloom-umbel"/>
<g class="bloom-trace-tips"/>
</svg>'''
path = Path(__file__).resolve().parents[1]/'src'/'lycoris'/'opening-flower.svg'
if not emblem:
    path.write_text(svg,encoding='utf-8')
    print(f'Exported 36 tepals and 42 filaments/styles ({len(svg)} bytes).')

# A small-size emblem keeps the model's recurved petals and long stamens,
# omitting alternate tepals and fine surface ripples that merge at icon scale.
source = ET.fromstring(svg)
mark_paths = []
petal_index = 0
for element in source.iter('{http://www.w3.org/2000/svg}path'):
    kind = element.get('class', '')
    d = element.get('d', '')
    if kind == 'bloom-petal':
        petal_index += 1
        if petal_index % 2 == 0:
            continue
        coordinates = re.findall(r'-?\d+\.\d+ -?\d+\.\d+', d)
        d = 'M' + ' L'.join(coordinates[::3]) + ' Z'
    elif 'bloom-filament' not in kind:
        continue
    mark_paths.append(f'<path class="{kind}" data-delay="{element.get("data-delay", "0")}" pathLength="1" d="{d}"/>')
mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" fill="none" aria-hidden="true" class="lycoris-mark">
<g stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{''.join(mark_paths)}</g>
<g class="bloom-trace-tips"/>
</svg>'''
if emblem:
    (path.parent/'flower-mark.svg').write_text(mark, encoding='utf-8')
    print(f'Exported a simplified botanical emblem ({len(mark)} bytes, viewBox {vb}).')
    icon_paths = []
    filament_index = 0
    for element in ET.fromstring(mark).iter('{http://www.w3.org/2000/svg}path'):
        is_petal = element.get('class') == 'bloom-petal'
        if not is_petal:
            filament_index += 1
            if filament_index % 3:
                continue
        icon_paths.append(f'<path d="{element.get("d")}" fill="{"#d84b63" if is_petal else "none"}" stroke="#ed6679" stroke-width="{4 if is_petal else 10}"/>')
    size = max(x1-x0, y1-y0)+margin*2
    icon_vb = f'{(x0+x1-size)/2:.2f} {(y0+y1-size)/2:.2f} {size:.2f} {size:.2f}'
    icon = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{icon_vb}" stroke-linecap="round" stroke-linejoin="round">'+''.join(icon_paths)+'</svg>'
    (path.parents[2]/'public'/'favicon.svg').write_text(icon, encoding='utf-8')
