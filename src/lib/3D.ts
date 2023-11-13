import { browser } from '$app/environment';
import * as THREE from "three"

if(browser) {
    let camera : THREE.PerspectiveCamera;
    let scene : THREE.Scene;
    let renderer : THREE.WebGLRenderer;
    let clock: THREE.Clock;
    let torus : THREE.Mesh<THREE.TorusKnotGeometry, THREE.MeshStandardMaterial>;

    let a: number = 0;

    const aspectRatio = window.innerWidth / window.innerHeight;

    const init = () => {
        //----------- init ---------------------------------------------------------
        scene = new THREE.Scene();                                              // |
        camera = new THREE.PerspectiveCamera( 50, aspectRatio, 0.1, 2000 );     // |
        clock = new THREE.Clock(true);                                          // |
        scene.background = new THREE.Color(0x06001D);                           // |
        //--------------------------------------------------------------------------

        //----------- renderer ---------------------------------------------------
        renderer = new THREE.WebGLRenderer({ antialias: true });                // |
        renderer.setSize( window.innerWidth, window.innerHeight );              // |
        renderer.setPixelRatio(window.devicePixelRatio);                        // |
                                                                                // |
        window.addEventListener('resize', () => {                               // |
            // update camera aspect                                             // |
            camera.aspect = window.innerWidth / window.innerHeight;             // |
            camera.updateProjectionMatrix()                                     // |
            // update renderer                                                  // |
            renderer.setSize( window.innerWidth, window.innerHeight );          // |
            renderer.setPixelRatio(window.devicePixelRatio);                    // |
            renderer.render(scene, camera)                                      // |
        });                                                                     // |
                                                                                // |
        renderer.toneMapping = THREE.ACESFilmicToneMapping;                     // |
        renderer.toneMappingExposure = 1.0;                                     // |
        document.body.appendChild(renderer.domElement);                         // |
        //--------------------------------------------------------------------------

        //----------- torus --------------------------------------------------------
        const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16, 2, 3 );   // |
        const material = new THREE.MeshStandardMaterial( { color: 0xc23b22 } ); // |
        torus = new THREE.Mesh( geometry, material );                           // |
        scene.add( torus );                                                     // |
        //--------------------------------------------------------------------------

        //----------- lights -------------------------------------------------------
        const light = new THREE.AmbientLight(0xffffff, 2); // soft white light     |
        scene.add( light );                                                     // |
                                                                                // |
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );   // |
        scene.add( directionalLight );                                          // |
        // -------------------------------------------------------------------------

        //----------- camera -------------------------------------------------------
        camera.position.z = 70;                                                 // |
        camera.position.y = -5;                                                 // |
        camera.position.x = -20;                                                // |
        // -------------------------------------------------------------------------
    }

    const render = () => {
        renderer.clear()
        renderer.render(scene, camera);
    }

    const animate = () => {
        requestAnimationFrame(animate);

        torus.rotation.x += 0.01; // * a
        torus.rotation.y += 0.01; // * a

        // a += Math.random() * 2 - 1;

        render()
    }

    init()
    animate()
}
