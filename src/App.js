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
    <div className="min-h-screen bg-purple-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-400 mb-8">
        닮은 연예인 찾기
      </h1>
      <form
        name="frm"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-7xl mx-auto"
      >
        <label
          className="bg-purple-300 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-purple-500 transition duration-300 inline-block mb-6 text-lg"
          htmlFor="input-file"
        >
          이미지 업로드
        </label>
        <input
          type="file"
          id="input-file"
          name="uploadFile"
          accept="image/*"
          onChange={saveImgFile}
          ref={imgRef}
          className="hidden"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">나</h2>
            <div className="w-full h-80 md:h-[600px] border-4 border-purple-300 rounded-3xl overflow-hidden">
              {imgFile ? (
                <img
                  id="yourImg"
                  src={imgFile}
                  alt="Your Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                  <p className="text-purple-200 text-lg">
                    이미지를 업로드해주세요
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-300">연예인</h2>
            <div className="w-full h-80 md:h-[600px] border-4 border-purple-300 rounded-3xl overflow-hidden">
              {tmdbImg ? (
                <img
                  id="resultImg"
                  src={tmdbImg}
                  alt="Celebrity Image"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100">
                  <p className="text-purple-400 text-lg">
                    결과가 여기에 표시됩니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            id="resultBtn"
            className="bg-white text-purple-400 border-2 border-purple-400 px-8 py-4 rounded-xl font-bold text-xl hover:bg-purple-400 hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            결과 보기
          </button>
        </div>
      </form>

      {loading && (
        <p className="text-center mt-6 text-xl text-purple-400">분석 중...</p>
      )}
      {error && (
        <p className="text-center mt-6 text-xl text-red-400">{error}</p>
      )}
      {celebrityName && (
        <h2 className="text-3xl font-bold text-center mt-8 text-purple-400">
          닮은 연예인: "{celebrityName}"
        </h2>
      )}
    </div>
  );
}

export default App;
