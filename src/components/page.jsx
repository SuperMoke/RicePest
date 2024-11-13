"use client";

import { useState } from "react";
import Image from "next/image";

export default function PestIdentifier() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size too large");
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Response was not JSON");
      }

      const data = await response.json();
      setPrediction(data.prediction || "Unknown");
      setConfidence(data.confidence || "0");
    } catch (error) {
      console.error("Prediction failed:", error);
      setPrediction("Error occurred");
      setConfidence("0");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageInput"
        />

        <label
          htmlFor="imageInput"
          className="cursor-pointer border-2 border-dashed p-8 rounded-lg"
        >
          {selectedImage ? (
            <Image
              src={URL.createObjectURL(selectedImage)}
              alt="Selected"
              width={300}
              height={300}
              className="object-contain"
            />
          ) : (
            <div className="text-center">
              <p>Click to Upload Image</p>
            </div>
          )}
        </label>

        <button
          onClick={handleSubmit}
          disabled={!selectedImage || isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isLoading ? "Processing..." : "Identify"}
        </button>

        {prediction && !isLoading && (
          <div className="text-center">
            <h3>Pest Name:</h3>
            <h2>{prediction}</h2>
            <p>Accuracy: {confidence}%</p>
          </div>
        )}

        {prediction === "Error occurred" && (
          <div className="text-center text-red-500">
            <p>An error occurred while processing your request.</p>
          </div>
        )}
      </div>
    </div>
  );
}
