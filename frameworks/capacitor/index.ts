import { CoreModule, LicenseManager, CameraView, CameraEnhancer, CaptureVisionRouter, CapturedResultReceiver, MultiFrameResultCrossFilter } from "dynamsoft-barcode-reader-bundle";

// Configures the paths where the .wasm files and other necessary resources for modules are located.
CoreModule.engineResourcePaths.rootDirectory = 'https://cdn.jsdelivr.net/npm/';

LicenseManager.initLicense("DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxMjkzMzk1LU1UQXhNamt6TXprMUxYZGxZaTFVY21saGJGQnliMm8iLCJtYWluU2VydmVyVVJMIjoiaHR0cHM6Ly9tZGxzLmR5bmFtc29mdG9ubGluZS5jb20vIiwib3JnYW5pemF0aW9uSUQiOiIxMDEyOTMzOTUiLCJzdGFuZGJ5U2VydmVyVVJMIjoiaHR0cHM6Ly9zZGxzLmR5bmFtc29mdG9ubGluZS5jb20vIiwiY2hlY2tDb2RlIjotMjAwNjc1NDA0OX0=");
(async () => {
  const cameraView = await CameraView.createInstance();
  const cameraEnhancer = await CameraEnhancer.createInstance(cameraView);
  const cvRouter = await CaptureVisionRouter.createInstance();

  cvRouter.setInput(cameraEnhancer);

  const resultReceiver = new CapturedResultReceiver();
  resultReceiver.onDecodedBarcodesReceived = (result) => {
    alert(result.barcodeResultItems[0].text);
  };
  await cvRouter.addResultReceiver(resultReceiver);

  // Filter out unchecked and duplicate results.
  const filter = new MultiFrameResultCrossFilter();
  // Filter out unchecked barcodes.
  filter.enableResultCrossVerification("barcode", true);
  // Filter out duplicate barcodes within 3 seconds.
  filter.enableResultDeduplication("barcode", true);
  await cvRouter.addResultFilter(filter);

  const uiElement = cameraView.getUIElement();
  document.querySelector(".barcode-scanner-view")!.append(uiElement);

  await cameraEnhancer.open();
  await cvRouter.startCapturing("ReadBarcodes_SpeedFirst");
})();