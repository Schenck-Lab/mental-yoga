import { HALF_UNIT } from '../../cubenet/cubeThreeModel';
import FaceLabelTextMesh from './FaceLabelTextMesh';
import { COOKIE_MAT } from '../MatList';
import { buffer_mesh } from '../meshLib';

// constants
const h = HALF_UNIT;
const p = Math.PI;
const q = p * 0.5;
const text = {
    D: 'Hum!',
    T: 'wheat',
    F: 'Flash',
    B: 'Better',
    L: 'Oak',
    R: 'Sift',
};
const scale = 0.135;
const textMat = COOKIE_MAT.ceekioText.tag;


function Dough() {
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
    const vertices = [[h - cut, 0, h], [h, 0, h - cut], m];

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
        <group>
            {buffer_mesh(vertices.flat(), indices, COOKIE_MAT.dough.tag)}
        </group>);
};


export default function CeekioSkin({label}) {
    const blueberry = (pos) => {
        return (
            <mesh position={pos} scale={[1,0.75,1]}>
                <octahedronGeometry args={[0.06, 2]} />
                {COOKIE_MAT.blue.tag}
            </mesh>
        );
    };
    
    const rotChoc = {
        D: [0,0,0],
        T: [0,0,0],
        F: [0,0,0],
        B: [0,0,0],
        L: [0,-q,0],
        R: [0,+q,0],
    };
    const y = 0;

    const blueberryGroup = () => {
        return (
            <group rotation={rotChoc[label]}>
                {blueberry([-0.23, y, 0.20])}
                {blueberry([0,     y, 0.12])}
                {blueberry([0.23,  y, 0.24])}
                {blueberry([0.39,  y, 0.01])}
                {blueberry([-0.32, y,-0.15])}
                {blueberry([0.1,   y,-0.36])}
            </group>
        );
    };

    return (
        <group>
            <Dough />
            <FaceLabelTextMesh 
                label={label} 
                text={text} 
                scale={scale} 
                material={textMat}
            />
            {blueberryGroup()}
        </group>
    );
}