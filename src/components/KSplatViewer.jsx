import React, { useEffect, useRef, useState } from "react";
import {
  Viewer,
  PlyLoader,
  SplatLoader,
  KSplatLoader,
} from "../GS-Engine/index.js";
import LoadingScreen from "./UI/LoadingScreen";

const KSplatViewer = ({
  filePath,
  alphaRemovalThreshold = 1,
  antialiased = false,
  cameraUp = [0, 1, 0],
  cameraPosition = [0, 1, 0],
  cameraLookAt = [1, 0, 0],
  sphericalHarmonicsDegree = 0,
  loaderType,
  viewerOptions = {},
  onError,
  placeName,
  doYouKnowTexts,
}) => {
  const containerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedSize, setLoadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    if (!filePath) {
      onError && onError("No file path provided");
      return;
    }

    const baseUrl =
      import.meta.env.MODE === "development"
        ? "/models"
        : import.meta.env.VITE_S3_BASE_URL;

    const fullUrl = `${baseUrl}${filePath}`;

    fetch(fullUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch file: ${filePath}`);
        }
        const contentLength = res.headers.get("Content-Length");
        // If no Content-Length header, fall back without progress tracking.
        if (!contentLength) {
          return res.arrayBuffer();
        }
        const total = parseInt(contentLength, 10);
        setTotalSize(total);
        let loaded = 0;

        const reader = res.body.getReader();
        const chunks = [];

        const pump = () =>
          reader.read().then(({ done, value }) => {
            if (done) {
              return;
            }
            loaded += value.length;
            setLoadedSize(loaded);
            setProgress(loaded / total);
            chunks.push(value);
            return pump();
          });

        return pump().then(() => {
          const arrayBuffer = new Uint8Array(loaded);
          let offset = 0;
          for (const chunk of chunks) {
            arrayBuffer.set(chunk, offset);
            offset += chunk.length;
          }
          return arrayBuffer.buffer;
        });
      })
      .then((arrayBuffer) => {
        // Determine the file extension.
        const extension = filePath.split(".").pop().toLowerCase();
        let splatBufferPromise;

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
        // Initialize the viewer.
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

        return viewerInstance
          .addSplatBuffers(
            [splatBuffer],
            [{ splatAlphaRemovalThreshold: alphaRemovalThreshold }]
          )
          .then(() => {
            viewerInstance.start();
            setViewer(viewerInstance);
            // Loading is complete.
            setIsLoading(false);
            setProgress(1);
          });
      })
      .catch((error) => {
        console.error(error);
        onError && onError(error.message);
      });

    return () => {
      if (viewer && viewer.dispose) {
        viewer.dispose();
      }
    };
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

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Main container for 3D viewer */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Show overlay loading screen if still loading */}
      {isLoading && (
        <LoadingScreen
          progress={progress}
          placeName={placeName || "Loading..."}
          doYouKnowTexts={doYouKnowTexts || []}
          loadedSize={loadedSize}
          totalSize={totalSize}
        />
      )}
    </div>
  );
};

export default KSplatViewer;
