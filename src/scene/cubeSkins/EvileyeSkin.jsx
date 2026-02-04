import { useRef, useEffect } from 'react';
import { useLoader, useFrame, useThree, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import { SIMPLE_MAT, MATLIB } from '../MatList';
import { cyl_mesh, buffer_mesh, sphere_mesh } from '../meshLib';

extend({ TextGeometry });

// Global constants
const h = HALF_UNIT;
const p = Math.PI;
const q = 0.5 * p;

function FaceLabelTextMesh({ label }) {
    const meshRef = useRef();
    const text = {
        D: 'Gaze', 
        T: '',
        F: '',
        B: 'Vision',
        L: 'Insight',
        R: '', 
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

function BasicFace({mat, label}) {
    const interpPoints = (a, b, v) => {
        return [
            a[0] + (b[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * v,
            a[2] + (b[2] - a[2]) * v,
        ];
    }
    const cut = h * 0.3;
    const m = interpPoints(
        [h, 0, h],
        [-h, h * 2, -h],
        cut / 3
    );
    const vertices = [
        [h - cut, 0, h], [h, 0, h - cut], m,
    ];
    vertices.push(...vertices.map(p => [-p[0], p[1], +p[2]]));
    vertices.push(...vertices.map(p => [+p[0], p[1], -p[2]]));
    
    const indices = [
        0,7,1, 0,6,7,  0,3,6,
        4,10,9, 3,4,9,  3,9,6,
        2,5,11, 2,11,8,
        0,3,5, 0,5,2, 4,10,11, 4,11,5,
        1,2,8, 8,7,1, 11,9,8, 8,9,6,
    ];
    const in2 = [0,1,2, 3,5,4, 7,6,8, 10,11,9];
    return (
        <group
            userData={{id: label}}
            rotation={[q,0,0]}
            onPointerOver={(e) => {e.stopPropagation()}}
            onPointerOut={(e) => {e.stopPropagation()}}
            onClick={(e) => {e.stopPropagation()}}
        >
            {buffer_mesh(vertices.flat(), indices, mat, [0,0,0], [-q,0,0])}
            {buffer_mesh(vertices.flat(), in2, MATLIB.wood.tag, [0,0,0], [-q,0,0])}
        </group>
    );
};


function Spikes() {
    const a0 = 0.125;
    const a1 = 0.15;
    const sh = 0.07;
    const x0 = 0.45;
    const x1 = 0.28;
    const th = p/6;

    return (
        <group>
            {cyl_mesh(MATLIB.m5.tag, [a0, 0, sh, 3], [+x0,-sh/2,0], [0,-th,0])}
            {cyl_mesh(MATLIB.ma.tag, [a1, 0, sh, 3], [+x1,-sh/2,0], [0,-th,0])}
            {cyl_mesh(MATLIB.ma.tag, [a1, 0, sh, 3], [-x1,-sh/2,0], [0,+th,0])}
            {cyl_mesh(MATLIB.m5.tag, [a0, 0, sh, 3], [-x0,-sh/2,0], [0,+th,0])}
        </group>
    );
}

function Eye() {
    const { camera } = useThree();
    const eyeRef = useRef();
    const r = 0.125;

    useFrame((_, delta) => {
        // Skin animation: eyes looking at the camera
        if (eyeRef.current) {
            eyeRef.current.lookAt(camera.position);
            eyeRef.current.lookAt(camera.position);
        }
    });

    return (
        <group position={[0,0.025,0]}>
            <group rotation={[0,p*0.25,0]}><Spikes /></group>
            <group rotation={[0,p*0.25,p]}><Spikes /></group>
            
            {cyl_mesh(MATLIB.dust.tag, [0.8,0.8,0.051,4], [0,0,0], [0,p/4,0], [0.6,1,0.27])}
            {cyl_mesh(MATLIB.rose.tag, [0.22,0.22,0.072,36])}
            {cyl_mesh(MATLIB.dead.tag, [0.18,0.18,0.075,36])}
            {cyl_mesh(MATLIB.warm.tag, [0.14,0.14,0.08,36])}
           
            <group ref={eyeRef}>
                {sphere_mesh(MATLIB.m3nf.tag, [r], [0,0,0])}
                {sphere_mesh(MATLIB.yellow.tag, [0.03], [0,0,r*0.82], [0,0,0], [1.1,2.2,1.1])}
                {sphere_mesh(MATLIB.dark.tag,   [0.03], [0,0,r*0.95], [0,0,0], [0.6,1.7,0.6])}
            </group>
        </group>
    );
}

function Dots({ry}) {
    const radius = 0.4;
    const n = 12;
    const a = p * 2 / n;

    const args = [0.03, 0.03,0.07, 3];
    const pos = (i) => [radius * Math.cos(a * i), 0, radius * Math.sin(a * i)];
    const rot = [0,ry,0];

    return (
        <group position={[0,0.025,0]}>
            {Array.from({ length: n }).map((_, i) => (
                <group key={i}>
                    {cyl_mesh(MATLIB.m5.tag, args, pos(i), rot)}
                </group>
            ))}
        </group>
    );
}

function EyeFace({label}) {
    return (
        <group>
            <BasicFace mat={MATLIB.m6.tag} label={label} />
            <Eye/>
        </group>
    );
}

function DotFace({label, ry}) {
    return (
        <group>
            <BasicFace mat={MATLIB.ma.tag} label={label} />
            <FaceLabelTextMesh label={label} />
            <Dots ry={ry}/>
        </group>
    );
}

const FACE_COMPONENT = {
    // The eye faces
    T: EyeFace,
    F: EyeFace,
    R: EyeFace,

    // The dot faces
    D: DotFace,
    B: DotFace,
    L: DotFace,
};

const DOTS_ROT = {
    D: 0,
    B: p,
    L: -q,
}

export default function EvileyeSkin({ cubeId, label }) {
    const FaceSkin = FACE_COMPONENT[label];
    return <FaceSkin label={label} ry={DOTS_ROT[label]} />;
};
