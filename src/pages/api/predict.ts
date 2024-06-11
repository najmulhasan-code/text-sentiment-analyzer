import { NextApiRequest, NextApiResponse } from "next";
import { spawn } from "child_process";
import path from "path";

/**
 * Run the python script to get sentiment prediction.
 * @param text The input text for sentiment analysis.
 * @param callback The callback function to handle the script output.
 */

const runPythonScript = (text: string, callback: (output: string) => void) => {
  const scriptPath = path.join(process.cwd(), "python-scripts", "predict.py");
  const pythonProcess = spawn("python", [scriptPath, text]);

  let result = "";
  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
  });

  pythonProcess.stdout.on("end", () => {
    callback(result);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`child_process exited with code ${code}`);
  });
};

/**
 * API route handler for sentiment prediction.
 */

const sentimentPredictionHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("Received request:", req.method, req.url);
  if (req.method === "POST") {
    const { text } = req.body;
    console.log("Received text:", text);

    if (!text) {
      return res.status(400).json({ message: "Text input is required" });
    }

    runPythonScript(text, (prediction) => {
      try {
        console.log("Python script output:", prediction);
        const parsedPrediction = JSON.parse(prediction);
        console.log("Parsed prediction:", parsedPrediction);
        res.status(200).json(parsedPrediction);
      } catch (error) {
        console.error("Erros parsing prediction:", error);
        res.status(500).json({ message: "Error parsing prediction", error });
      }
    });
  } else {
    console.log("Method not allowed");
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default sentimentPredictionHandler;
