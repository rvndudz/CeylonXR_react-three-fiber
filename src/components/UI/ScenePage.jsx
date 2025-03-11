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
      "The Nine Arches Bridge was built entirely without steel, using bricks, cement, and stone",
      "This iconic bridge was constructed during British colonial rule in Sri Lanka, completed in 1921",
      "The bridge stands at 24 meters high and spans 91 meters across a lush jungle valley",
      "It is also known as the 'Bridge in the Sky' due to the breathtaking views surrounding it",
      "During World War I, steel intended for the bridge was redirected to the war effort, so local materials were used instead",
      "The bridge is part of the railway line connecting Colombo to Badulla, one of the most scenic train rides in the world",
      "Local legend says the construction was led by a Sri Lankan named P.K. Appuhami after British engineers abandoned the project",
      "The best times to see the train crossing the bridge are in the morning and afternoon, making it a favorite photography spot",
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
  test: {
    placeName: "test",
    filePath: "/test3.ksplat",
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
