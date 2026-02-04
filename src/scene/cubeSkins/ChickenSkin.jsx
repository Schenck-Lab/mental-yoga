import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { SIMPLE_MAT, CHICKEN_MAT } from '../MatList';
import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import FaceLabelTextMesh from './FaceLabelTextMesh';
import { sphere_mesh, cyl_mesh, buffer_mesh,torus_mesh } from '../meshLib';
import { useAppContext } from '../../context/AppContext';


// constants
const h = HALF_UNIT;
const p = Math.PI;
const q = p * 0.5;

const text = {
    D: 'Jump',
    T: 'Lucky',
    F: 'Cluck',
    B: 'Secret',
    L: 'I Can',
    R: 'Fly',
}
const scale = 0.135;
const posY = {
    D: 0,
    T: 1.0,
    F: -2.2,
    B: 0,
    L: 1.5,
    R: 1.5,
};
const textMat = SIMPLE_MAT.label;


function BasicFace({cubeId, label}) {
    const ref = useRef();
    const { cubeControllerMap } = useAppContext();
    const controller = cubeControllerMap[cubeId];

    useEffect(() => {
        controller.interactor.faces[label] = ref;
    // eslint-disable-next-line
    }, []);

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
        0,1,2, 0,7,1, 0,6,7, 7,6,8, 0,3,6,
        3,5,4, 4,10,9, 3,4,9, 10,11,9, 3,9,6,
        2,5,11, 2,11,8,
        0,3,5, 0,5,2, 4,10,11, 4,11,5,
        1,2,8, 8,7,1, 11,9,8, 8,9,6,
    ];
    return (
        <group userData={{id: label}} >
            <group
                onPointerOver={(e) => {e.stopPropagation()}}
                onPointerOut={(e) => {e.stopPropagation()}}
                onClick={(e) => {e.stopPropagation()}}
            >
                {buffer_mesh(vertices.flat(), indices, CHICKEN_MAT.body, [0,0,0], [-q,0,0])}
            </group>
            

            <mesh ref={ref} position={[0,0,-0.06]} 
                onPointerOver={(e) => {
                    e.stopPropagation();
                    controller.interactor.handleFaceHover(label, 1);
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    controller.interactor.handleFaceHover(label, 0);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    controller.interactor.handleFaceClick(label);
                }}
            >
                <boxGeometry args={[0.8, 0.8, 0.06]} />
                {CHICKEN_MAT.inner}
            </mesh>
        </group>);
};


function ChickenFace({cubeId, label}) {
    const { camera } = useThree();
    const eyeLRef = useRef();
    const eyeRRef = useRef();

    const eyeOff = 0.12;
    const eyeRadius = 0.075;
   
    const ring = (sign) => torus_mesh(CHICKEN_MAT.red, 
        eyeRadius, 0.015, [sign * eyeOff,0.2,0]
    );
    
    const eye = (ref, sign) => (
        <mesh ref={ref} position={[(sign * eyeOff),0.2,0.015]}>
            <sphereGeometry args={[eyeRadius, 32, 32]}/>
            {CHICKEN_MAT.eye}

            {sphere_mesh(CHICKEN_MAT.eyeBall, [0.02,16,16],
                [0,0,eyeRadius], null, [1.2,1.2,0.3])}
        </mesh>
    );

    const brow = (sign) => {
        const a = 0.1;
        const b = 0.3;
        const c = 0.03;
        const d = 0.2;

        const vertices = [
            [0,0,0], [0.02,c,a/2], [0.01,a,0], 
            [a/2+d,c,a/2], [b,0,0], [b-0.03,a,0],
        ].map(v => [sign * v[0], v[1], v[2]]);

        const indices = [0,1,2, 0,4,1, 2,1,5, 1,3,5, 1,4,3, 3,4,5];
        
        return buffer_mesh(vertices.flat(), indices, CHICKEN_MAT.brow, 
            [sign * 0.02,0.27,0], [0,0,sign * p * 0.05]);    
    };

    const beak = () => {
        const vertices = [
            [0,0,0], [0,-0.05,0.15], 
            [0.175,-0.2,0], [0, -0.25, 0.2],[0,-0.3,0]
        ];
        vertices.push(...vertices.map(p => [-p[0], p[1], p[2]]));
        const indices = [0,1,2, 1,2,3, 5,6,7, 6,7,8, 2,3,4, 7,8,9];
        
        return (
            <group
                onPointerOver={(e) => {e.stopPropagation()}}
                onPointerOut={(e) => {e.stopPropagation()}}
                onClick={(e) => {
                    e.stopPropagation();
                    const audio = new Audio('/assets/chicken-sound.mp3');
                    audio.play();
                }}
            >
                {buffer_mesh(vertices.flat(), indices, CHICKEN_MAT.beak, [0,0.18,0])}
            </group>
        );
    };

    const wattle = () => {
        const r = 0.04;
        return (
            <group>
                {sphere_mesh(CHICKEN_MAT.red, [r], [+r,-0.14,0])}
                {sphere_mesh(CHICKEN_MAT.red, [r], [-r,-0.14,0])}
            </group>
        );
    };

    // Skin animation: eyes focusing on camera
    useFrame((_, delta) => {
        if (eyeLRef.current && eyeRRef.current) {
            eyeLRef.current.lookAt(camera.position);
            eyeRRef.current.lookAt(camera.position);
        }
    });

    return (
        <group rotation={[q, 0, 0]}>
            <BasicFace cubeId={cubeId} label={label} />
            {brow(-1)}
            {brow(+1)}
            {ring(-1)}
            {ring(+1)}
            {eye(eyeLRef, -1)}
            {eye(eyeRRef, +1)}
            {beak()}
            {wattle()}
        </group>
    );
}


function ChickenHead({cubeId, label}) {
    const y = 0.02;
    const combUnit = (rotX) => {
        const r = 0.035;
        return (
            <group rotation={[rotX,0,0]}>
                {cyl_mesh(CHICKEN_MAT.red, [r,0.025,0.1], [0,0,0.15], [q,0,0])}
                {sphere_mesh(CHICKEN_MAT.red, [r], [0,0,0.2])}
            </group>
        );
    };

    return (
        <group rotation={[q, 0, 0]}>
            <BasicFace cubeId={cubeId} label={label} />
            {/* Comb */}
            <group position={[0,-0.3,y/2]}>
                {sphere_mesh(CHICKEN_MAT.red, [0.1], [0,0,y/2])}
                {combUnit(+0.3 * p)}
                {combUnit(+0.1 * p)}
                {combUnit(-0.1 * p)}
                {combUnit(-0.3 * p)}
            </group>
        </group>
    );
}


function ChickenFeet({cubeId, label}) {
    return (
        <group rotation={[q, 0, 0]}>
            <BasicFace cubeId={cubeId} label={label} />
        </group>
    );
}

function ChickenTail({cubeId, label}) {
    return (
        <group rotation={[q, 0, 0]}>
            <BasicFace cubeId={cubeId} label={label} />
        </group>
    );
}


function ChickenWing({cubeId, label}) {
    const ref = useRef();
    const wingPhaseTime = useRef(0);
    
    const THD = 1;
    const coe = 2 * p / THD;
    const sign = {'L': 1, 'R': -1}[label];
    const updateRY = (value) => Math.sin(coe * value) * 0.7 * sign;

    // Skin animation: wing waving
    useFrame((_, delta) => {
        if (!ref.current || delta >= THD) return;

        wingPhaseTime.current += delta;
        if (wingPhaseTime.current > THD) {
                wingPhaseTime.current -= THD;
        }
        ref.current.rotation.y = updateRY(wingPhaseTime.current);
    });

    const wing = () => {
        const a = 0.3;
        const b = -0.04;
        const rotZ = {'L': p, 'R': 0}[label];

        const vertices = [
            [0,a,0], [0,-a,0], [0,0,a], [-b,a/2,a/2], [-b,-a/2,a/2],
        ];
        const indices = [0,1,2, 0,3,2, 1,2,4, 3,4,2, 0,1,3, 1,4,3];

        return (
            <group ref={ref} rotation={[0,0,rotZ]}>
                {buffer_mesh(vertices.flat(), indices, CHICKEN_MAT.body)}
            </group>
        );
    };

    return (
        <group rotation={[q, 0, 0]}>
            <BasicFace cubeId={cubeId} label={label}/>
            {wing()}
        </group>
    );
}


const FACE_COMPONENT = {
    T: ChickenHead,
    D: ChickenFeet,
    F: ChickenFace,
    B: ChickenTail,
    L: ChickenWing,
    R: ChickenWing,
};

export default function ChickenSkin({ cubeId, label }) {
    const FaceSkin = FACE_COMPONENT[label];
    return (
        <group>
            <FaceSkin cubeId={cubeId} label={label}/>
            <FaceLabelTextMesh 
                label={label} 
                text={text} 
                scale={scale} 
                material={textMat}
                posY={posY}
            />
        </group>
    );
};
