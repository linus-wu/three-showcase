import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { addSceneResize } from "../../utils/sceneResize";
import TouchIcon from "../icons/TouchIcon";

const BasicScene = () => {
  const basicSceneContainer = useRef(null);

  useEffect(() => {
    if (!basicSceneContainer.current) return;
    const currentContainer = basicSceneContainer.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("black");
    scene.fog = new THREE.Fog("black", 3, 8);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const ambientLight = new THREE.AmbientLight("#FFFFFF");
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#FFFFFF", 8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const octahedronGeometry = new THREE.OctahedronGeometry();
    const octahedronMaterial = new THREE.MeshStandardMaterial({
      color: "#004B97",
    });

    const octahedronOne = new THREE.Mesh(
      octahedronGeometry,
      octahedronMaterial
    );
    octahedronOne.position.set(0, 0, 0);
    scene.add(octahedronOne);

    const octahedronTwo = new THREE.Mesh(
      octahedronGeometry,
      octahedronMaterial
    );
    octahedronTwo.position.set(1, 1, 1);
    octahedronOne.add(octahedronTwo);

    const octahedronThree = new THREE.Mesh(
      octahedronGeometry,
      octahedronMaterial
    );
    octahedronThree.position.set(-1, -1, -1);
    octahedronOne.add(octahedronThree);

    function animate() {
      requestAnimationFrame(animate);

      octahedronOne.rotation.y += 0.005;

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
    <>
      <div ref={basicSceneContainer} />
      <TouchIcon />
    </>
  );
};

export default BasicScene;
