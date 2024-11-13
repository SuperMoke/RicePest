import { NextResponse } from "next/server";
import path from "path";

let tf;
let model;
let modelPromise;

async function initialize() {
  tf = await import("@tensorflow/tfjs");
  const modelPath = path.join(process.cwd(), "public", "model", "model.json");
  model = await tf.loadLayersModel(`file://${modelPath}`);
}

modelPromise = initialize();

export async function POST(request) {
  try {
    await modelPromise;

    const formData = await request.formData();
    const imageFile = formData.get("image");
    if (!imageFile) {
      throw new Error("No image file found in the request.");
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const tensor = tf.tidy(() => {
      let img = tf.node.decodeImage(buffer, 3);
      img = tf.image.resizeBilinear(img, [180, 180]);
      img = img.cast("float32").div(255.0);
      return img.expandDims(0);
    });

    const prediction = await model.predict(tensor);
    const scores = prediction.arraySync()[0];
    const maxScore = Math.max(...scores);
    const predictedIndex = scores.indexOf(maxScore);

    // Clean up tensors
    tensor.dispose();
    prediction.dispose();

    const classLabels = [
      "Green Leafhopper",
      "Leaf Folders",
      "Non Pest",
      "Rice Bug",
      "Stem Borer",
    ];

    const predictedClass = classLabels[predictedIndex];

    return NextResponse.json({
      prediction: predictedClass,
      confidence: (maxScore * 100).toFixed(2),
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
