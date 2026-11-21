import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function App() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current!

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 1, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    // FONDO QUE SE MUEVE: esfera gigante con la imagen por dentro
    const textura = new THREE.TextureLoader().load('/fondo.jpg')
    textura.colorSpace = THREE.SRGBColorSpace
    const fondo = new THREE.Mesh(
      new THREE.SphereGeometry(50, 64, 64),
      new THREE.MeshBasicMaterial({ map: textura, side: THREE.BackSide })
    )
    scene.add(fondo)

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const luz = new THREE.DirectionalLight(0xffffff, 1)
    luz.position.set(5, 5, 5)
    scene.add(luz)

    // FIGURA 1: Cono
    const cono = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      new THREE.MeshStandardMaterial({ color: 0xff8800 })
    )
    cono.position.x = -2
    scene.add(cono)

    // FIGURA 2: Dona
    const dona = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0xff3399 })
    )
    dona.position.x = 2
    scene.add(dona)

    const controls = new OrbitControls(camera, renderer.domElement)

    let id = 0
    const animar = () => {
      id = requestAnimationFrame(animar)
      cono.rotation.y += 0.01
      dona.rotation.x += 0.01
      dona.rotation.y += 0.01
      fondo.rotation.y += 0.0008 // el fondo gira lento solo
      controls.update()
      renderer.render(scene, camera)
    }
    animar()

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
}

export default App