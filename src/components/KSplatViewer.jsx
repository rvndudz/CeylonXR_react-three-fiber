import React, { useEffect, useRef, useState } from "react";
import {
  Viewer,
  PlyLoader,
  SplatLoader,
  KSplatLoader,
} from "../GS-Engine/index.js";

/**
 * KSplatViewer is a React component that:
 * - Loads a file (e.g., a .ksplat file) from the public folder via its URL.
 * - Uses one of the provided loaders (PlyLoader, SplatLoader, or KSplatLoader) to process the file.
 * - Configures and starts a Viewer instance with the passed-in options.
 *
 * Props:
 * - filePath (string): The URL (relative to public/) of the file to load (e.g., "/models/model.ksplat").
 * - alphaRemovalThreshold (number): The threshold value (1–255) for alpha removal.
 * - antialiased (boolean): Whether to enable antialiasing.
 * - cameraUp (array of numbers): A 3-element array for the camera up vector (e.g., [0, 1, 0]).
 * - cameraPosition (array of numbers): A 3-element array for the initial camera position.
 * - cameraLookAt (array of numbers): A 3-element array for the camera look-at vector.
 * - sphericalHarmonicsDegree (number): The degree for spherical harmonics (0, 1, or 2).
 * - loaderType (optional string): Force a specific loader ('ply', 'splat', or 'ksplat'). If not provided, the loader is chosen based on the file extension.
 * - viewerOptions (object): Any extra options to pass into the Viewer constructor.
 * - onError (function): A callback to notify errors.
 */
const KSplatViewer = ({
  filePath, // e.g., "/models/myModel.ksplat"
  alphaRemovalThreshold = 1,
  antialiased = false,
  cameraUp = [0, 1, 0],
  cameraPosition = [0, 1, 0],
  cameraLookAt = [1, 0, 0],
  sphericalHarmonicsDegree = 0,
  loaderType, // Optional: 'ply', 'splat', or 'ksplat'
  viewerOptions = {},
  onError,
}) => {
  // A ref to hold the container div that the viewer will render into.
  const containerRef = useRef(null);
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (!filePath) {
      onError && onError("No file path provided");
      return;
    }

    // Load the file from the public folder using fetch.
    fetch(filePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch file: ${filePath}`);
        }
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        // Determine the file extension.
        const extension = filePath.split(".").pop().toLowerCase();
        let splatBufferPromise;

        // Choose the loader based on the provided loaderType prop or file extension.
        if (loaderType === "ply" || extension === "ply") {
          splatBufferPromise = PlyLoader.loadFromFileData(
            arrayBuffer,
            alphaRemovalThreshold,
            0,
            sphericalHarmonicsDegree
          );
        } else if (loaderType === "splat" || extension === "splat") {
          splatBufferPromise = SplatLoader.loadFromFileData(
            arrayBuffer,
            alphaRemovalThreshold,
            0,
            sphericalHarmonicsDegree
          );
        } else if (
          loaderType === "ksplat" ||
          extension === "ksplat" ||
          !loaderType
        ) {
          // Default to KSplatLoader if no loaderType is provided.
          splatBufferPromise = KSplatLoader.loadFromFileData(
            arrayBuffer,
            alphaRemovalThreshold,
            0,
            sphericalHarmonicsDegree
          );
        } else {
          throw new Error(`Unsupported file extension: ${extension}`);
        }

        return splatBufferPromise;
      })
      .then((splatBuffer) => {
        // Initialize the viewer, passing in the container reference and configuration props.
        const viewerInstance = new Viewer({
          container: containerRef.current,
          cameraUp,
          initialCameraPosition: cameraPosition,
          initialCameraLookAt: cameraLookAt,
          halfPrecisionCovariancesOnGPU: false,
          antialiased,
          sphericalHarmonicsDegree,
          ...viewerOptions,
        });

        // Add the loaded splat buffer and start the viewer.
        return viewerInstance
          .addSplatBuffers(
            [splatBuffer],
            [{ splatAlphaRemovalThreshold: alphaRemovalThreshold }]
          )
          .then(() => {
            viewerInstance.start();
            setViewer(viewerInstance);
          });
      })
      .catch((error) => {
        console.error(error);
        onError && onError(error.message);
      });

    // Optional cleanup: dispose the viewer instance on component unmount.
    return () => {
      if (viewer && viewer.dispose) {
        viewer.dispose();
      }
    };
    // Include all the props that, when changed, require reloading.
  }, [
    filePath,
    alphaRemovalThreshold,
    antialiased,
    cameraUp,
    cameraPosition,
    cameraLookAt,
    sphericalHarmonicsDegree,
    loaderType,
    viewerOptions,
  ]);

  // Render only the container for the viewer.
  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default KSplatViewer;
