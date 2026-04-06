import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function BoxPosIndicator() {
    const x = 0.8;
    const matRef = useRef();

    const A = 0.3; 
    const B = 0.8;

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * 1.5;

        const normalized = (Math.sin(t * 2) + 1) / 2;
        const opacity = A + (B - A) * normalized;

        if (matRef.current) {
            matRef.current.opacity = opacity;
        }
    });

    return (
        <mesh>
            <boxGeometry args={[x, x, x]} />
            <meshStandardMaterial
                ref={matRef}
                color={0xff6600}
                transparent
                opacity={0.75}
                depthWrite={false}
            />
        </mesh>
    );
}

export default BoxPosIndicator;