const root = document.getElementById("root");
let isDrawingStarted = false;
const circles = [];
let currPath = [];
const alreadyOverlapped = {};

const fillCircle = (circle) => {
  const { id } = circle;
  if (alreadyOverlapped[id]) return;
  const canvas = document.getElementById(id);
  const context = canvas.getContext("2d");
  context.fillStyle = "green";
  context.strokeStyle = "green";
  context.fill();
  alreadyOverlapped[id] = true;
};

const checkOverlappingAndFill = () => {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const distance = Math.sqrt(
        (circles[i].center[0] - circles[j].center[0]) ** 2 +
          (circles[i].center[1] - circles[j].center[1]) ** 2
      );
      if (distance < circles[i].radius + circles[j].radius) {
        for (const circle of [circles[i], circles[j]]) {
          fillCircle(circle);
        }
      }
    }
  }
};

const createCanvas = (canvasId, center, radius) => {
  const canvas = document.createElement("canvas");
  canvas.id = canvasId;
  canvas.width = 2 * radius;
  canvas.height = 2 * radius;
  canvas.style.position = "absolute";
  canvas.style.left = `${center[0] - radius}px`;
  canvas.style.top = `${center[1] - radius}px`;
  canvas.style.backgroundColor = "transparent";
  return canvas;
};

const createACircle = () => {
  if (currPath.length > 0) {
    const n = currPath.length;
    const startPoint = currPath[0];
    const endPoint = currPath[Math.floor(n / 2)];
    const center = [
      Math.floor((startPoint[0] + endPoint[0]) / 2),
      Math.floor((startPoint[1] + endPoint[1]) / 2),
    ];
    const radius = Math.floor(
      Math.sqrt(
        Math.abs(
          (startPoint[0] - endPoint[0]) ** 2 +
            (startPoint[1] - endPoint[1]) ** 2
        )
      ) / 2
    );
    const canvasId = `canvas-${circles.length}`;
    const canvas = createCanvas(canvasId, center, radius);
    root.append(canvas);
    const context = canvas.getContext("2d");
    context.beginPath();
    context.arc(radius, radius, radius, 0, 2 * Math.PI);
    context.stroke();
    circles.push({ id: canvasId, center, radius });
    checkOverlappingAndFill();
  }
};

root.addEventListener("mousedown", () => {
  isDrawingStarted = true;
});

root.addEventListener("mousemove", (e) => {
  if (isDrawingStarted) {
    currPath.push([e.clientX, e.clientY]);
  }
});

root.addEventListener("mouseup", () => {
  isDrawingStarted = false;
  createACircle();
  currPath = [];
});
