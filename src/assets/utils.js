import * as cv from "../opencv/opencv";

class Utils {
  constructor(errorMessageElementId) {
    this.errorMessageElementId = errorMessageElementId;
    this.errorOutput = document.getElementById(errorMessageElementId);
    this.OPENCV_URL = "opencv.js";
  }

  // Method to print error messages to a specific element
  printError(message) {
    const errorMessageElement = document.getElementById(
      this.errorMessageElementId
    );
    if (errorMessageElement) {
      errorMessageElement.textContent = message;
    } else {
      console.error(message);
    }
  }

  // Method to load OpenCV
  loadOpenCv(onloadCallback) {
    const script = document.createElement("script");
    script.setAttribute("async", "");
    script.setAttribute("type", "text/javascript");
    script.addEventListener("load", async () => {
      if (cv.getBuildInformation) {
        console.log(cv.getBuildInformation());
        onloadCallback();
      } else {
        // WASM
        if (cv instanceof Promise) {
          cv = await cv;
          console.log(cv.getBuildInformation());
          onloadCallback();
        } else {
          cv["onRuntimeInitialized"] = () => {
            console.log(cv.getBuildInformation());
            onloadCallback();
          };
        }
      }
    });
    script.addEventListener("error", () => {
      this.printError(`Failed to load ${this.OPENCV_URL}`);
    });
    script.src = this.OPENCV_URL;
    const node = document.getElementsByTagName("script")[0];
    node.parentNode.insertBefore(script, node);
  }

  // Method to create a file from a URL using modern JavaScript features
  async createFileFromUrl(path, url, callback) {
    try {
      // Fetch the file from the URL
      const response = await fetch(url);

      // Check if the response is OK (status 200-299)
      if (!response.ok) {
        throw new Error(`Failed to load ${url}. Status: ${response.status}`);
      }

      // Convert the response to an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Create a Uint8Array from the ArrayBuffer
      const data = new Uint8Array(arrayBuffer);

      // Create the file in the virtual file system
      cv.FS_createDataFile("/", path, data, true, false, false);
      callback();
      // Return a success message
      return `File ${path} created successfully.`;
    } catch (error) {
      // Print error messages
      this.printError(`Error creating file from URL: ${error.message}`);
      throw error;
    }
  }
}

// this.createFileFromUrl = function(path, url, callback) {
//     let request = new XMLHttpRequest();
//     request.open('GET', url, true);
//     request.responseType = 'arraybuffer';
//     request.onload = function(ev) {
//         if (request.readyState === 4) {
//             if (request.status === 200) {
//                 let data = new Uint8Array(request.response);
//                 cv.FS_createDataFile('/', path, data, true, false, false);
//                 callback();
//             } else {
//                 self.printError('Failed to load ' + url + ' status: ' + request.status);
//             }
//         }
//     };
//     request.send();
// };

// this.createFileFromUrl = function(path, url, callback) {
//     const request = new XMLHttpRequest();

//     request.open('GET', url, true);
//     request.responseType = 'arraybuffer';

//     request.onload = () => {
//         if (request.readyState === XMLHttpRequest.DONE) {
//             if (request.status === 200) {
//                 const data = new Uint8Array(request.response);
//                 cv.FS_createDataFile('/', path, data, true, false, false);
//                 callback();
//             } else {
//                 console.error(`Failed to load ${url}. Status: ${request.status}`);
//             }
//         }
//     };

//     request.onerror = () => {
//         console.error(`Network error while trying to load ${url}`);
//     };

//     request.send();
// };

// this.loadImageToCanvas = function(url, cavansId) {
//     let canvas = document.getElementById(cavansId);
//     let ctx = canvas.getContext('2d');
//     let img = new Image();
//     img.crossOrigin = 'anonymous';
//     img.onload = function() {
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0, img.width, img.height);
//     };
//     img.src = url;
// };

// this.executeCode = function(textAreaId) {
//     try {
//         this.clearError();
//         let code = document.getElementById(textAreaId).value;
//         eval(code);
//     } catch (err) {
//         this.printError(err);
//     }
// };

// this.clearError = function() {
//     this.errorOutput.innerHTML = '';
// };

// this.printError = function(err) {
//     if (typeof err === 'undefined') {
//         err = '';
//     } else if (typeof err === 'number') {
//         if (!isNaN(err)) {
//             if (typeof cv !== 'undefined') {
//                 err = 'Exception: ' + cv.exceptionFromPtr(err).msg;
//             }
//         }
//     } else if (typeof err === 'string') {
//         let ptr = Number(err.split(' ')[0]);
//         if (!isNaN(ptr)) {
//             if (typeof cv !== 'undefined') {
//                 err = 'Exception: ' + cv.exceptionFromPtr(ptr).msg;
//             }
//         }
//     } else if (err instanceof Error) {
//         err = err.stack.replace(/\n/g, '<br>');
//     }
//     this.errorOutput.innerHTML = err;
// };

// this.loadCode = function(scriptId, textAreaId) {
//     let scriptNode = document.getElementById(scriptId);
//     let textArea = document.getElementById(textAreaId);
//     if (scriptNode.type !== 'text/code-snippet') {
//         throw Error('Unknown code snippet type');
//     }
//     textArea.value = scriptNode.text.replace(/^\n/, '');
// };

// this.addFileInputHandler = function(fileInputId, canvasId) {
//     let inputElement = document.getElementById(fileInputId);
//     inputElement.addEventListener('change', (e) => {
//         let files = e.target.files;
//         if (files.length > 0) {
//             let imgUrl = URL.createObjectURL(files[0]);
//             self.loadImageToCanvas(imgUrl, canvasId);
//         }
//     }, false);
// };

// function onVideoCanPlay() {
//     if (self.onCameraStartedCallback) {
//         self.onCameraStartedCallback(self.stream, self.video);
//     }
// };

// this.startCamera = function(resolution, callback, videoId) {
//     const constraints = {
//         'qvga': {width: {exact: 320}, height: {exact: 240}},
//         'vga': {width: {exact: 640}, height: {exact: 480}}};
//     let video = document.getElementById(videoId);
//     if (!video) {
//         video = document.createElement('video');
//     }

//     let videoConstraint = constraints[resolution];
//     if (!videoConstraint) {
//         videoConstraint = true;
//     }

//     navigator.mediaDevices.getUserMedia({video: videoConstraint, audio: false})
//         .then(function(stream) {
//             video.srcObject = stream;
//             video.play();
//             self.video = video;
//             self.stream = stream;
//             self.onCameraStartedCallback = callback;
//             video.addEventListener('canplay', onVideoCanPlay, false);
//         })
//         .catch(function(err) {
//             self.printError('Camera Error: ' + err.name + ' ' + err.message);
//         });
// };

// this.stopCamera = function() {
//     if (this.video) {
//         this.video.pause();
//         this.video.srcObject = null;
//         this.video.removeEventListener('canplay', onVideoCanPlay);
//     }
//     if (this.stream) {
//         this.stream.getVideoTracks()[0].stop();
//     }
// };

export default Utils;
