import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FACE_LOCAL_FRAME_MAP } from '../../cubenet/cubeSpec';
import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import { useAppContext } from '../../context/AppContext';
import { useFrame } from '@react-three/fiber';
import { SIMPLE_MAT, ICEBOX_MAT } from '../MatList';
import { sphere_mesh, cyl_mesh, buffer_mesh, indices_4_to_3 } from '../meshLib';

extend({ TextGeometry });


const h = HALF_UNIT;
const p = Math.PI;
const q = 0.5 * p;

const SELECTOR_MAP = {
    zn: [0,p,0],
    xp: [0,q,0],
    zp: [0,0,0],
    xn: [0,-q,0],
};

function FaceLabelTextMesh({ label }) {
    const meshRef = useRef();
    const text = {
        D: 'Refresh',
        T: 'Chill',
        F: '?',
        B: 'Mint',
        L: 'Vanilla',
        R: 'Choc',
    };
    // Z-axis rotation (in radians) to orient face label text
    const rotTable = {
        D: [q,0,0],
        T: [q,0,0],
        F: [q,0,0],
        B: [q,0,p],
        L: [q,0,q],
        R: [q,0,-q],
    };

    const posY = {
        D: 0,
        T: 0,
        F: 0,
        B: 0,
        L: 0,
        R: 0,
    };
    // Load font once
    const options = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    };

    useEffect(() => {
        if (meshRef.current) {
            // Compute bouding box to place the text in center of the face
            const geometry = meshRef.current.geometry;
            geometry.computeBoundingBox();

            const box = geometry.boundingBox;
            const xOffset = (box.max.x + box.min.x) / 2;
            const yOffset = (box.max.y + box.min.y) / 2;

            geometry.translate(-xOffset, -yOffset + posY[label], 0.16);
        }
    // eslint-disable-next-line
    });

    const s = 0.12;
    
    return (
        <group rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,-0.02]} 
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {SIMPLE_MAT.label}
            </mesh>
        </group>
    );
}

function BasicFrame() {
    const c = 0.12; // cut
    const k = 0.06; // thickness

    const interpPoints = (a, b, v) => {
        return [
            a[0] + (b[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * v,
            a[2] + (b[2] - a[2]) * v,
        ];
    }
    const m = interpPoints(
        [h, 0, h],
        [-h, h * 2, -h],
        c / 3
    );
    
    const pts = [
        [h - c, 0, h], 
        [h - c - (Math.SQRT2 - 1) * k, 0, h - k],
    ];
    pts.push(...pts.map(v => [ v[2], 0, v[0]]));
    pts.push(...pts.map(v => [-v[0], 0, v[2]]));
    pts.push(...pts.map(v => [ v[0], 0,-v[2]]));

    const extra = [m];
    extra.push(...extra.map(v => [v[0], v[1], -v[2]]));
    extra.push(...extra.map(v => [-v[0], v[1], v[2]]));

    const n = pts.length;
    for (let i = 1; i < n; i += 2) {
        const v = pts[i];
        pts.push([v[0], k, v[2]]);
    }
    pts.push(...extra);

    const indices = [
        // horizontal surface
        0,1,3,2, 0,4,5,1, 4,6,7,5, 6,14,15,7, 
        14,12,13,15, 12,8,9,13, 8,10,11,9, 10,2,3,11,
        // vertical surface
        1,16,17,3, 1,5,18,16, 5,7,19,18, 7,15,23,19,
        15,13,22,23, 13,9,20,22, 9,11,21,20, 11,3,17,21,
        // slant surface
        0,16,17,2, 0,4,18,16, 4,6,19,18, 6,14,23,19,
        14,12,22,23, 12,8,20,22, 8,10,21,20, 10,2,17,21,
        // close face
        // 16,18,19,23, 16,23,22,17, 17,22,20,21,
    ];

    const temp = indices_4_to_3(indices);
    temp.push(...[
        24,0,2,   24,16,17, 24,0,16,  24,2,17,
        25,8,10,  25,20,21, 25,8,20,  25,10,21,
        26,4,6,   26,18,19, 26,4,18,  26,6,19,
        27,12,14, 27,22,23, 27,12,22, 27,14,23,
    ]);
    
    const square = () => {
        const b = 0.45;
        const c = 0.08; // cut
        const y = 0.02;
        const pts = [
            [b - c, y, b], 
        ];
        pts.push(...pts.map(v => [ v[2], y, v[0]]));
        pts.push(...pts.map(v => [-v[0], y, v[2]]));
        pts.push(...pts.map(v => [ v[0], y,-v[2]]));
        
        const ind = [0,4,5,1, 0,2,6,4, 2,3,7,6];

        return (
            <group>
                {buffer_mesh(pts.flat(), indices_4_to_3(ind), ICEBOX_MAT.m3.tag)}
            </group>
        );
    };

    return (
        <group
            onPointerOver={(e) => e.stopPropagation()}
            onPointerMove={(e) => e.stopPropagation()}
            onPointerOut={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {buffer_mesh(pts.flat(), temp, 
                ICEBOX_MAT.metal.tag,[0,0,0], [0,0,0])}
            {square()}
        </group>
    );
}

function IceCream({icecreamRef, label}) {
    useFrame((_, delta) => {
        // Skin animation: Ice cream rotating about y-axis
        if (icecreamRef.current) {
            icecreamRef.current.rotation.y += delta * -2;
        }
    });

    const args = [0.13, 16, 12];
    const rotation = [p, 0, 0];
    
    const waff_cone = cyl_mesh(ICEBOX_MAT.waff.tag, [0.02, 0.15, 0.45, 12]);
    const scoop_plain = sphere_mesh(ICEBOX_MAT.plain.tag, args,[-0.08,-0.25,0],      rotation);
    const scoop_straw = sphere_mesh(ICEBOX_MAT.staw.tag,  args,[+0.025,-0.27,-0.08], rotation);
    const scoop_mint  = sphere_mesh(ICEBOX_MAT.mint.tag,  args,[+0.09,-0.25,+0.04],  rotation);
    const scoop_blue  = sphere_mesh(ICEBOX_MAT.blue.tag,  args,[0,-0.35,0],          rotation);
    const scoop_moon  = sphere_mesh(ICEBOX_MAT.moon.tag,  args,[0,-0.28,+0.08],      rotation);

    return (
        <group ref={icecreamRef} 
            position={[0,0.02,-0.17]} 
            rotation={[-q,0,0]}
            visible={label === 'FT'}
        >
            {scoop_plain}
            {scoop_straw}
            {scoop_mint}
            {scoop_blue}
            {scoop_moon}
            {waff_cone}
        </group>
    );
}

function Selector({ ctrl, label, rot }) {
    const icRef = useRef('FT');
    const selRef = useRef();

    useEffect(() => {
        const inter = ctrl?.interactor;
        if (!inter?.registerSelector) return;

        inter.registerSelector(label, { icRef, selRef });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const a = 0.45;
    const b = 0.45;
    const c = 0.04;
    const pts = [
        [0, 0, 0],
        [a - c, 0, b - c],
        [a - 2 * c, 0, b],
        [-(a - 2 * c), 0, b],
        [c - a, 0, b - c],
    ];
    const idx = [0,1,2, 0,2,3, 0,3,4];

    const onOver = (e) => {
        e.stopPropagation();
        ctrl?.interactor?.onHover?.(label);
    };

    const onOut = (e) => {
        e.stopPropagation();
        ctrl?.interactor?.onOut?.(label);
    };

    const onClick = (e) => {
        e.stopPropagation();
        ctrl?.interactor?.onClick?.(label);
        console.log(`ice_cream @ ${label}`);
    };

    return (
        <group rotation={rot}>
            {/* Selector mesh */}
            <group position={[0, 0.0205, 0]} 
                onPointerOver={onOver} 
                onPointerOut={onOut} 
                onClick={onClick}>
                {buffer_mesh(pts.flat(), idx, ICEBOX_MAT.m3.tag, null, null, null, selRef)}
            </group>
            {/* Ice-cream */}
            <IceCream icecreamRef={icRef} label={label} />
        </group>
    );
}

export default function IceboxSkin({cubeId, label}) {
    const { cubeControllerMap } = useAppContext();
    return (
        <group>
            <BasicFrame label={label} />
            <FaceLabelTextMesh label={label} />
            {Object.entries(SELECTOR_MAP).map(([axis, rot]) => (
                <Selector
                    key={axis}
                    ctrl={cubeControllerMap[cubeId]}
                    label={`${label}${FACE_LOCAL_FRAME_MAP[label][axis]}`}
                    rot={rot}
                />
            ))}
        </group>
    );
}
