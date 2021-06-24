import {
    AdditiveBlending,
    BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, TextureLoader, Vector4
} from "../vendors/three.module.js";

const VS = `
    uniform float uTime;

    varying vec2 vAngle;
    varying vec4 vColor;

    attribute float angle;
    attribute vec3 velocity;
    attribute float startTime;

    void main() {
        float elapsed = uTime - startTime;
        vec3 disp = velocity * elapsed;
        vec3 transformed = position + disp;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        gl_PointSize = 50.0 - elapsed * 25.0;
        vAngle = vec2(cos(angle), sin(angle));
        vColor = vec4(0.88, 0.34, 0.13, 1.0);
    }
`
const FS = `
    uniform sampler2D uTexture;

    varying vec2 vAngle;
    varying vec4 vColor;

    void main() {
        vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
        gl_FragColor = texture2D(uTexture, coords) * vColor;
    }
`

class Particle {
    constructor() { 
        const total = 80
        const angle = this._fillAngle(total)

        this._geometry = new BufferGeometry()
        this._geometry.setAttribute('position', new Float32BufferAttribute(total * 3, 3))
        this._geometry.setAttribute('angle', new Float32BufferAttribute(angle, 1))
        this._geometry.setAttribute('velocity', new Float32BufferAttribute(total * 3, 3))
        this._geometry.setAttribute('startTime', new Float32BufferAttribute(total, 1))

        this._material = new ShaderMaterial({
            uniforms: {
                uTexture: {
                    value: new TextureLoader().load('../assets/flame_01.png')
                },
                uTime: {
                    value: 0.0
                }
            },
            vertexShader: VS,
            fragmentShader: FS,
            blending: AdditiveBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
        })

        this._point = new Points(this._geometry, this._material)
        this._offset = 1
        this._startIndex = 0
    }

    _fillPosition(total) {
        const position = []
        for (let i = 0; i < total; i++) {
            position[i*3] = (Math.random() - 0.5) * 5
            position[i*3+1] = (Math.random() - 0.5) * 5
            position[i*3+2] = (Math.random() - 0.5) * 5
        }
        return position
    }

    _fillAngle(total) {
        const angle = []
        for (let i = 0; i < total; i++) {
            angle.push(Math.random() * 6)
        }
        return angle
    }

    _spawn(dt) {
        const posAttrib = this._geometry.attributes.position
        const velAttrib = this._geometry.attributes.velocity
        const stAttrib = this._geometry.attributes.startTime

        for(let i = this._startIndex; i < this._offset; i++) {
            const x = (Math.random() - 0.5) / 4
            const z = (Math.random() - 0.5) / 4

            posAttrib.array[i*3] = x
            posAttrib.array[i*3+1] = 0.2
            posAttrib.array[i*3+2] = z

            velAttrib.array[i*3] = 0
            velAttrib.array[i*3+1] = 1
            velAttrib.array[i*3+2] = 0

            stAttrib.array[i] = dt
        }

        posAttrib.needsUpdate = true
        velAttrib.needsUpdate = true
        stAttrib.needsUpdate = true
        this._startIndex = this._offset
        this._offset += 1
        if (this._offset > 80) {
            this._offset = 1
            this._startIndex = 0
        }
    }

    get Point() {
        return this._point
    }

    update(dt) {
        this._spawn(dt)
        this._material.uniforms.uTime.value = dt
    }
}

export default Particle