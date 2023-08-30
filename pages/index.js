import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [goodNameInput, setgoodNameInput] = useState("");
  const [goodStrengthsInput, setgoodStrengthsInput] = useState("");
  const [targetAudienceInput, settargetAudienceInput] = useState("");
  const [personality, setPersonalityInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goodName: goodNameInput
          , goodStrengths: goodStrengthsInput
          , targetAudience: targetAudienceInput
          , personality: personality
         }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.log(data.result)
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>SDG Demo</title>
        <link rel="icon" href="/tiktok.png" />
      </Head>

      <main className={styles.main}>
        <img src="/tiktok.png" className={styles.icon} />
        <h3>Demo for TikTok</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="goodName"
            placeholder="What is the name of your good?"
            value={goodNameInput}
            onChange={(e) => setgoodNameInput(e.target.value)}
          />
          <input
            type="text"
            name="goodStrengths"
            placeholder="What are the strengths of your good?"
            value={goodStrengthsInput}
            onChange={(e) => setgoodStrengthsInput(e.target.value)}
          />
          <input
            type="text"
            name="targetAudience"
            placeholder="Who is your target audience?"
            value={targetAudienceInput}
            onChange={(e) => settargetAudienceInput(e.target.value)}
          />
          <input
            type="text"
            name="personality"
            placeholder="What is your personality?"
            value={personality}
            onChange={(e) => setPersonalityInput(e.target.value)}
          />
          <input type="submit" value="Generate" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
