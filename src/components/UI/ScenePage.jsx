import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import KSplatViewer from "../KSplatViewer";

const sceneConfigMapping = {
  ella: {
    placeName: "Ella",
    filePath: "/ella.ksplat",
    alphaRemovalThreshold: 10,
    antialiased: true,
    cameraUp: [-0.13537, -0.98928, -0.05483],
    cameraPosition: [-2.10205, -5.5146, -0.96031],
    cameraLookAt: [3.16803, -2.51469, 2.81781],
    sphericalHarmonicsDegree: 2,
    viewerOptions: {},
    doYouKnowTexts: [
      "Ella was named after a famous explorer",
      "The architecture here dates back to the 12th century",
      "Local legends speak of hidden treasures in the area",
    ],
  },
  sigiriya: {
    placeName: "Sigiriya",
    filePath: "/ella.ksplat",
    alphaRemovalThreshold: 10,
    antialiased: false,
    cameraUp: [0, -1, 0],
    cameraPosition: [20, 20, 20],
    cameraLookAt: [2.26601, -3.31786, 1.17009],
    sphericalHarmonicsDegree: 1,
    viewerOptions: {},
    doYouKnowTexts: [
      "Sigiriya is known as the Lion Rock",
      "It served as a royal palace in ancient times",
    ],
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
    <div>
      {/* Back button to return to main page */}
      <button
        className="absolute top-5 right-5 z-[1000] px-3 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
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
