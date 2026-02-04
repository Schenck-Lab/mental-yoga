import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { HALF_PI } from '../../cubenet/cubeThreeModel';

extend({ TextGeometry });


const p = Math.PI;
const q = HALF_PI;
const DEFAULT_POS_Y = {
    D: 0,
    T: 0,
    F: 0,
    B: 0,
    L: 0,
    R: 0,
};

export default function FaceLabelTextMesh({ 
    label, text, scale, posY=DEFAULT_POS_Y, material, textOffset=-0.02,
}) {
    const meshRef = useRef();
    // Z-axis rotation (in radians) to orient face label text
    const rotTable = {
        D: [q,0,0],
        T: [q,0,0],
        F: [q,0,0],
        B: [q,0,p],
        L: [q,0,q],
        R: [q,0,-q],
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

    return (
        <group rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,textOffset]}
                scale={[scale, scale, scale]} 
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {material}
            </mesh>
        </group>
    );
}
