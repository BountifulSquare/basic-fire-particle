import {
    WebGLRenderer, Scene, PerspectiveCamera, GridHelper, AxesHelper,
    DirectionalLight, AmbientLight, sRGBEncoding
} from '../vendors/three.module.js'
import { OrbitControls } from '../vendors/OrbitControls.js'
import Stats from '../vendors/stats.module.js'

const setup = (canvas) => {
    const renderer = new WebGLRenderer({ canvas, antialias: true })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.physicallyCorrectLights = true
    renderer.gammaFactor = 2.2
    renderer.outputEncoding = sRGBEncoding
    renderer.shadowMap.enabled = true

    const camera = new PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 1000)
    camera.position.set(0, 10, 10)
    const controls = new OrbitControls(camera, canvas)
    controls.update()

    const stats = new Stats()
    document.body.appendChild(stats.dom)

    const dLight = new DirectionalLight(0x070B34, 0.2)
    dLight.position.set(-5, 10, 0)
    const aLight = new AmbientLight(0x090909, 0.1)

    const grid = new GridHelper()
    const axes = new AxesHelper(10)

    const scene = new Scene()
    // scene.add(dLight)
    scene.add(aLight)
    // scene.add(grid)
    // scene.add(axes)

    return {
        renderer,
        camera,
        scene,
        stats
    }
}

export default setup