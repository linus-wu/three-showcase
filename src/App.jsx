import { useState } from "react";
import BasicScene from "./components/scenes/BasicScene";
import TextureScene from "./components/scenes/TextureScene";
import ModelScene from "./components/scenes/ModelScene";
import Header from "./components/layout/Header";

function App() {
  const [currentItem, setCurrentItem] = useState("Basic");

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header currentItem={currentItem} setCurrentItem={setCurrentItem} />

      {currentItem === "Basic" && <BasicScene />}
      {currentItem === "Texture" && <TextureScene />}
      {currentItem === "3D Model" && <ModelScene />}
    </div>
  );
}

export default App;
