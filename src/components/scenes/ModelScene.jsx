import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { addSceneResize } from "../../utils/sceneResize";
import ProgressLayout from "../progressLayout/ProgressLayout";
import TouchIcon from "../icons/TouchIcon";

const ModelScene = () => {
  const modelSceneContainer = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingPercentage, setLoadingPercentage] = useState({
    rolex: 0,
    table: 0,
  });

  const lastLoadingPercentage = Math.min(
    loadingPercentage.rolex,
    loadingPercentage.table
  );

  useEffect(() => {
    if (!modelSceneContainer.current) return;
    const currentContainer = modelSceneContainer.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#111111");

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    currentContainer.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const ambientLight = new THREE.AmbientLight("#FFFFFF", 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#FFFFFF", 3);
    directionalLight.position.set(-2, 1, -1);
    scene.add(directionalLight);

    const subDirectionalLight = new THREE.DirectionalLight("#FFFFFF", 10);
    subDirectionalLight.position.set(0, -0.12, 1);
    scene.add(subDirectionalLight);

    const loader = new GLTFLoader();

    const loadModel = (url, key) => {
      return new Promise((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            resolve(gltf.scene);
          },
          (progressEvent) => {
            setLoadingPercentage((prev) => ({
              ...prev,
              [key]: (
                (progressEvent.loaded / progressEvent.total) *
                100
              ).toFixed(0),
            }));
          },
          (error) => {
            console.error("An error happened", error);
            reject(error);
          }
        );
      });
    };

    let rolex;
    let table;

    const loadModels = async () => {
      try {
        const [rolexModel, tableModel] = await Promise.all([
          loadModel(
            `${import.meta.env.VITE_BASE_PATH}/models/rolex.glb`,
            "rolex"
          ),
          loadModel(
            `${import.meta.env.VITE_BASE_PATH}/models/table.glb`,
            "table"
          ),
        ]);

        rolex = rolexModel;
        table = tableModel;

        rolex.position.y = -0.43;
        rolex.scale.set(8, 8, 8);
        scene.add(rolex);

        table.position.y = -3;
        table.scale.set(1.5, 1.5, 1.5);
        scene.add(table);

        setIsLoading(false);
      } catch (error) {
        console.error("An error occurred while loading models", error);
        setIsLoading(false);
      }
    };

    loadModels();

    const diskGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.02, 32);
    const diskMaterial = new THREE.MeshStandardMaterial({
      color: "#ADADAD",
    });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    disk.position.y = -0.45;
    scene.add(disk);

    const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: "#272727",
      transparent: true,
      opacity: 0.3,
      roughness: 0,
      metalness: 0,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0,
      envMapIntensity: 1,
    });
    const transparentCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    transparentCube.position.set(0, 0.25, 0);
    scene.add(transparentCube);

    const edges = new THREE.EdgesGeometry(cubeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: "#272727",
    });
    const lineSegments = new THREE.LineSegments(edges, lineMaterial);
    transparentCube.add(lineSegments);

    function animate() {
      requestAnimationFrame(animate);

      if (rolex) {
        rolex.rotation.y += 0.005;
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
      {isLoading ? (
        <ProgressLayout loadingPercentage={lastLoadingPercentage} />
      ) : (
        <TouchIcon />
      )}
      <div ref={modelSceneContainer} />
    </div>
  );
};

export default ModelScene;
