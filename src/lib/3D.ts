import { browser } from '$app/environment'; 
import * as THREE from "three"

if(browser) {
    let camera : THREE.PerspectiveCamera;
    let scene : THREE.Scene;
    let renderer : THREE.WebGLRenderer;
    let torus : THREE.Mesh<THREE.TorusKnotGeometry, THREE.MeshBasicMaterial>;

    const aspectRatio = window.innerWidth / window.innerHeight;

    const init = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 50, aspectRatio, 0.1, 2000 ); 
        // scene.background = new THREE.Color(0x111111);
 
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.0;

        document.body.appendChild( renderer.domElement );

        const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16, 2, 3 );

        // lights
        const light = new THREE.AmbientLight(0xffffff, 2); // soft white light
        scene.add( light );

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        scene.add( directionalLight );

        const spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 1000, 100 );
        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        scene.add( spotLight );
        // lights

        const material = new THREE.MeshStandardMaterial( { color: 0x0000ff } );
        torus = new THREE.Mesh( geometry, material );
        scene.add( torus );

        camera.position.z = 70;
        camera.position.y = -10;
        camera.position.x = -20;
    }

    const render = () => {
        renderer.clear()
        renderer.render(scene, camera);
    }

    const animate = () => {
        requestAnimationFrame(animate)

        torus.rotation.x += 0.005
        torus.rotation.y += 0.005

        render()
    }

    init()
    animate()
}