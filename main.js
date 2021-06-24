import * as THREE from './vendors/three.module.js'
import setup from './src/setup.js'
import Particle from './src/particle.js'

(function main() {
    const canvas = document.getElementById('canvas')
    const { renderer, camera, scene, stats } = setup(canvas)

    const particle = new Particle()
    scene.add(particle.Point)

    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const boxGeo = new THREE.BoxGeometry()
    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })

    const ground = new THREE.Mesh(planeGeo, material)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    const boxA = new THREE.Mesh(boxGeo, material)
    boxA.position.set(2, 0.5, -3)
    boxA.castShadow = true
    const boxB = new THREE.Mesh(boxGeo, material)
    boxB.position.set(-3, 0.5, 1.5)
    boxB.castShadow = true

    const pLight = new THREE.PointLight(0xE25822, 1, 6, 2)
    pLight.position.set(0, 2, 0)
    pLight.castShadow = true
    scene.add(pLight)

    scene.add(ground)
    scene.add(boxA)
    scene.add(boxB)

    function run(dt) {
        renderer.render(scene, camera)

        particle.update(dt / 1000)

        stats.update()
        requestAnimationFrame(run)
    }
    run(0.0)
})()