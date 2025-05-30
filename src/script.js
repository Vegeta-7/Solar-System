import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// initialize the scene
const scene = new THREE.Scene();

// add textureLoader
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath('/textures/cubeMap2/')

// add textureLoader
const sunTexture = textureLoader.load('textures/2k_sun.jpg')
const mercuryTexture = textureLoader.load('textures/2k_mercury.jpg')
const venusTexture = textureLoader.load('textures/2k_venus_surface.jpg')
const earthTexture = textureLoader.load('textures/2k_earth_daymap.jpg')
const marsTexture = textureLoader.load('textures/2k_mars.jpg')
const jupiterTexture = textureLoader.load('textures/8k_jupiter.jpg')
const saturnTexture = textureLoader.load('textures/8k_saturn.jpg')
const ringTexture = textureLoader.load('textures/8k_saturn_ring_alpha.png')
const uranusTexture = textureLoader.load('textures/2k_uranus.jpg')
const neptuneTexture = textureLoader.load('textures/2k_neptune.jpg')
const moonTexture = textureLoader.load('textures/2k_moon.jpg')
// const bgTexture = textureLoader.load('textures/2k_stars_milky_way.jpg')   //not moving bg

const bgCubeMap = cubeTextureLoader.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
])

scene.background = bgCubeMap

// add stuff here
const sphereGeometry = new THREE.SphereGeometry(1,128,128)

const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture
})
const mercuryMaterial = new THREE.MeshStandardMaterial({
  map: mercuryTexture
})
const venusMaterial = new THREE.MeshStandardMaterial({
  map: venusTexture
})
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture
})
const marsMaterial = new THREE.MeshStandardMaterial({
  map: marsTexture
})
const jupiterMaterial = new THREE.MeshStandardMaterial({
  map: jupiterTexture
})
const saturnMaterial = new THREE.MeshStandardMaterial({
  map: saturnTexture
})
const uranusMaterial = new THREE.MeshStandardMaterial({
  map: uranusTexture
})
const neptuneMaterial = new THREE.MeshStandardMaterial({
  map: neptuneTexture
})
const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture
})
const sun = new THREE.Mesh(sphereGeometry,sunMaterial)
sun.scale.setScalar(5)

const planets = [
  {
    name: "Mercury",
    radius: 0.5,
    distance: 10,
    speed: 0.01,
    material: mercuryMaterial,
    moons: [],
  },
  {
    name: "Venus",
    radius: 0.8,
    distance: 15,
    speed: 0.007,
    material: venusMaterial,
    moons: [],
  },  
  {
    name: "Earth",
    radius: 1,
    distance: 20,
    speed: 0.005,
    material: earthMaterial,
    moons: [
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },
    ],
  },
  {
    name: "Mars",
    radius: 0.7,
    distance: 25,
    speed: 0.003,
    material: marsMaterial,
    moons: [
      {
        name: "Phobos",
        radius: 0.1,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Deimos",
        radius: 0.2,
        distance: 3,
        speed: 0.015,
        color: 0xffffff,
      },
    ],
  },
  {
    name: "Jupiter",
    radius: 1.7,
    distance: 35,
    speed: 0.0025,
    material: jupiterMaterial,
    moons: [],
  },
  {
    name: "Saturn",
    radius: 1.3,
    distance: 40,
    speed: 0.002,
    material: saturnMaterial,
    // moons: [],
    moons: [
      {      
        name: "Ring",
        radius: 0.4,
        distance: 2,
        speed: 0.02,
      },
      {
        name: "Moon",
        radius: 0.3,
        distance: 3,
        speed: 0.015,
      },      
    ],
  },
  {
    name: "Uranus",
    radius: 1.2,
    distance: 45,
    speed: 0.0015,
    material: uranusMaterial,
    moons: [],
  },
  {
    name: "Neptune",
    radius: 1.1,
    distance: 50,
    speed: 0.001,
    material: neptuneMaterial,
    moons: [],
  },
];

const createPlanet = (planet) => {
  // create mesh and add to the scene
  const planetMesh = new THREE.Mesh(sphereGeometry,planet.material)
  planetMesh.position.x = planet.distance
  planetMesh.scale.setScalar(planet.radius)        
  return planetMesh
}
const createMoon = (moon) => {
  // create mesh and add to the scene
  const moonMesh = new THREE.Mesh(sphereGeometry,moonMaterial)
  moonMesh.scale.setScalar(moon.radius)
  moonMesh.position.x = moon.distance
  return moonMesh
}
const createOrbit = (planet) => {
  const orbitGeometry = new THREE.TorusGeometry(planet.distance, 0.03, 100);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xadd8e6,
    side: THREE.DoubleSide,
    antialias: true,
  });
  const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitMesh.rotation.x = Math.PI / 2;
  return orbitMesh
}

// add lights
const ambientLight = new THREE.AmbientLight(0xffffff,0.1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 500)
scene.add(pointLight)

const planetMeshes = planets.map((planet)=>{
  const planetMesh = createPlanet(planet)
  const orbitMesh = createOrbit(planet)   
  scene.add(orbitMesh) 

  // add it to our scene
  scene.add(planetMesh)
  
  if (planet.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(1.5, 2.75, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,      
      side: THREE.DoubleSide,               
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);  
    planetMesh.add(ring);
  }

  // loop through the moons
  planet.moons.forEach((moon) => {
    const moonMesh = createMoon(moon) 
    planetMesh.add(moonMesh)
  })
  return planetMesh
})

scene.add(sun)

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  400
);
camera.position.z = 100;
camera.position.y = 5;

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.maxDistance = 200;
controls.minDistance = 20

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log(planetMeshes)
// render loop
const renderloop = () => {  
  planetMeshes.forEach((planet, index) => {        
    planet.rotation.y += planets[index].speed                   
    planet.rotation.x += planets[index].speed                   
    planet.position.x = Math.sin(planet.rotation.y) * planets[index].distance
    planet.position.z = Math.cos(planet.rotation.y) * planets[index].distance
    planet.children.forEach((moon,moonInd) => {
      if(moon.geometry.type === "RingGeometry"){                         
        moon.rotation.x = Math.PI/2       
        moon.rotation.y = Math.PI/10       
        moon.rotation.z -= Math.PI/200
      }else{       
        moon.rotation.y += planets[index].moons[moonInd]?.speed
        moon.position.x = Math.sin(moon.rotation.y) * planets[index].moons[moonInd]?.distance
        moon.position.z = Math.cos(moon.rotation.y) * planets[index].moons[moonInd]?.distance
      }
    })
  })

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};
renderloop();