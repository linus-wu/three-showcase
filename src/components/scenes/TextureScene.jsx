import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { addSceneResize } from "../../utils/sceneResize";

const TextureScene = () => {
  const textureSceneContainer = useRef(null);
  const [isLoading, setIsLoading] = useState({
    earth: true,
    moon: true,
  });

  const isAllTextureLoaded = !isLoading.earth && !isLoading.moon;

  useEffect(() => {
    if (!textureSceneContainer.current) return;
    const currentContainer = textureSceneContainer.current;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight("#FFFFFF", 0.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#FFFFFF", 5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 500;
    const positionArray = new Float32Array(starsCount * 2);

    for (let i = 0; i < starsCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 12;
    }
    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );

    const starsMaterial = new THREE.PointsMaterial({
      color: "#FFFFFF",
      size: 0.001,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const loader = new THREE.TextureLoader();

    const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: loader.load(
        `${import.meta.env.VITE_BASE_PATH}/textures/2k_earth_daymap.jpg`,
        () => {
          setIsLoading((prev) => ({ ...prev, earth: false }));
        }
      ),
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(0, 0, 0);
    scene.add(earth);

    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
      map: loader.load(
        `${import.meta.env.VITE_BASE_PATH}/textures/2k_moon.jpg`,
        () => {
          setIsLoading((prev) => ({ ...prev, moon: false }));
        }
      ),
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(5, 0, 0);
    scene.add(moon);

    let moonAngle = 0;
    const moonOrbitRadius = 3;

    let cameraDirection = -0.02;

    function animate() {
      requestAnimationFrame(animate);

      earth.rotation.y += 0.003;

      moon.rotation.y += 0.003;

      moonAngle += 0.006;
      moon.position.x = moonOrbitRadius * Math.cos(moonAngle);
      moon.position.z = moonOrbitRadius * Math.sin(moonAngle);

      if (camera.position.z <= 12 && camera.position.z >= 3) {
        camera.position.z += cameraDirection;
      } else {
        cameraDirection *= -1;
        camera.position.z += cameraDirection;
      }

      renderer.render(scene, camera);
    }

    animate();

    const removeResizeHandler = addSceneResize({ camera, renderer });

    return () => {
      removeResizeHandler();

      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative">
      {!isAllTextureLoaded && (
        <div className="absolute top-16 left-0 w-full h-full bg-black z-10" />
      )}
      <div ref={textureSceneContainer} />
    </div>
  );
};

export default TextureScene;
