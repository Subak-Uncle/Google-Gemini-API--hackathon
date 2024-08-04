import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./App.scss";

function App() {
  const [celebrityName, setCelebrityName] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [tmdbImg, setTmdbImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const imgRef = useRef();
  const imgURL = "https://image.tmdb.org/t/p/w500";

  // Gemini API 설정
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt =
    "첨부한 이미지의 인물의 얼굴형, 머리스타일, 눈, 코, 입, 광대 부분을 식별해서 닮은 연예인을 선정하고 이름을 알려줘. 이름만 말해줘.";

  const saveImgFile = () => {
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };
  };

  const tmdbOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.REACT_APP_TMDB_API_KEY,
    },
  };

  const searchCelebrity = async (celebrityValue) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${celebrityValue}&include_adult=true&language=ko-KR&page=1`,
        tmdbOptions
      );
      const data = await response.json();
      const imgValue = data.results[0]?.profile_path;
      if (imgValue) {
        setTmdbImg(imgURL + imgValue);
      } else {
        setError("연예인 이미지를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error(error);
      setError("TMDB API 요청 중 오류가 발생했습니다.");
    }
  };

  const analyzeImage = async (imageData) => {
    try {
      const imageParts = [
        {
          inlineData: {
            data: imageData.split(",")[1],
            mimeType: "image/jpeg",
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error("Gemini API 오류:", error);
      throw new Error(`이미지 분석 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const imageData = imgFile;
      if (!imageData) {
        throw new Error("이미지를 선택해주세요.");
      }

      const celebrityValue = await analyzeImage(imageData);
      setCelebrityName(celebrityValue);
      await searchCelebrity(celebrityValue);
    } catch (error) {
      console.error(error);
      setError(error.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>닮은 연예인 찾기</h1>
      <form name="frm" onSubmit={handleSubmit} encType="multipart/form-data">
        <label className="input-file-button" htmlFor="input-file">
          업로드
        </label>
        <input
          type="file"
          id="input-file"
          name="uploadFile"
          accept="image/*"
          onChange={saveImgFile}
          ref={imgRef}
          style={{ display: "none" }}
        />
        <div className="label-container">
          <label htmlFor="yourImg">
            <h1>나</h1>
          </label>
          <label htmlFor="resultImg">
            <h1>연예인</h1>
          </label>
        </div>
        <div className="image-container">
          <img id="yourImg" src={imgFile} alt="Your Image" />
          <img id="resultImg" src={tmdbImg} alt="Celebrity Image" />
        </div>
        <center>
          <input
            type="submit"
            id="resultBtn"
            className="btn"
            value="결과 보기"
            disabled={loading}
          />
        </center>
      </form>

      {loading && <p>분석 중...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {celebrityName && <h1>닮은 연예인: "{celebrityName}"</h1>}
    </div>
  );
}

export default App;
