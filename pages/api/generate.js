import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const goodName = req.body.goodName || '';
  if (goodName.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid goodName",
      }
    });
    return;
  }

  const goodStrengths = req.body.goodStrengths || '';
  if (goodStrengths.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid goodStrengths",
      }
    });
    return;
  }

  const targetAudience = req.body.targetAudience || '';
  if (targetAudience.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid targetAudience",
      }
    });
    return;
  }

  const personality = req.body.personality || '';

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generatePrompt(goodName, goodStrengths, targetAudience, personality),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(goodName, goodStrengths, targetAudience, personality) {
  return [{role:"user", content:`Imagine that you are an influncer on TikTok. You are trying to sell your good, ${goodName}, 
  to your audience, who are ${targetAudience}.
  Your good's strengths are ${goodStrengths}.
  ${personality ? `You are ${personality}.` : ''}
  You want to convince them to buy your good. 
  What would you include in your video, and what would your script be?
}`}];
}
