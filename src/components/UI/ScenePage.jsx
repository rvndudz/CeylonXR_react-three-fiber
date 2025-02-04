import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import KSplatViewer from "../KSplatViewer";

const sceneConfigMapping = {
  ella: {
    filePath: "/models/ella.ksplat",
    alphaRemovalThreshold: 10,
    antialiased: true,
    cameraUp: [0, -1, 0],
    cameraPosition: [-3.99198, -6.83456, -0.16008],
    cameraLookAt: [0, 0, 0],
    sphericalHarmonicsDegree: 2,
    viewerOptions: {},
  },
  sigiriya: {
    filePath: "/models/sigiriya.ksplat",
    alphaRemovalThreshold: 10,
    antialiased: false,
    cameraUp: [0, -1, 0],
    cameraPosition: [20, 20, 20],
    cameraLookAt: [2.26601, -3.31786, 1.17009],
    sphericalHarmonicsDegree: 1,
    viewerOptions: {},
  },
  // Add more scene configurations as needed.
};

const ScenePage = () => {
  const { sceneName } = useParams();
  const navigate = useNavigate();

  const config = sceneConfigMapping[sceneName];

  if (!config) {
    return <div>Scene not found.</div>;
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Back button to return to main page */}
      <button
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          padding: "8px 12px",
        }}
        onClick={() => navigate("/")}
      >
        Back
      </button>

      {/* Render the KSplatViewer with the selected scene configuration */}
      <KSplatViewer
        {...config}
        onError={(msg) => console.error("Viewer error:", msg)}
      />
    </div>
  );
};

export default ScenePage;
