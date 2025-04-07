import React, { useEffect } from "react";
import { Viewer, KSplatLoader } from "../GS-Engine";

const KSplatViewer = () => {
  const file = "/test2.splat";
  const baseUrl =
    import.meta.env.MODE === "development"
      ? "/models"
      : import.meta.env.VITE_S3_BASE_URL;

  useEffect(() => {
    const filePath = `${baseUrl}${file}`;
    const alphaRemovalThreshold = 10;
    const antialiased = false;
    const cameraUp = [0, -1, 0];
    const cameraPosition = [2.16031, -1.03819, 2.38419];
    const cameraLookAt = [-10.24165, 2.29482, -10.74862];
    const sphericalHarmonicsDegree = 1;

    fetch(filePath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load file: ${response.statusText}`);
        }
        return response.arrayBuffer();
      })
      .then((arrayBuffer) =>
        KSplatLoader.loadFromFileData(
          arrayBuffer,
          alphaRemovalThreshold,
          0, // color offset (if any)
          sphericalHarmonicsDegree
        )
      )
      .then((splatBuffer) => {
        const viewer = new Viewer({
          cameraUp: cameraUp,
          initialCameraPosition: cameraPosition,
          initialCameraLookAt: cameraLookAt,
          halfPrecisionCovariancesOnGPU: false,
          antialiased: antialiased,
          sphericalHarmonicsDegree: sphericalHarmonicsDegree,
        });

        viewer
          .addSplatBuffers(
            [splatBuffer],
            [{ splatAlphaRemovalThreshold: alphaRemovalThreshold }]
          )
          .then(() => {
            viewer.start();
          });
      })
      .catch((error) => {
        console.error("Error loading .ksplat file:", error);
      });
  }, []);

  return (
    <div
      id="viewer-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
};

export default KSplatViewer;
