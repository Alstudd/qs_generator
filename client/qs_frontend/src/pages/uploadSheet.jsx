import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const UploadSheet = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(false);
  const handlePreviewButton = () => {
    setPreview(!preview);
    fetchData(subject);
  };

  const [data, setData] = useState([]);
  const [uploaded, setUploaded] = useState(false);

  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");

  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadLoadingDisabled, setUploadLoadingDisabled] = useState(false);
  const [uploadImagesLoading, setUploadImagesLoading] = useState(false);
  const [uploadImagesLoadingDisabled, setUploadImagesLoadingDisabled] =
    useState(false);

  const [subjectsInDB, setSubjectsInDB] = useState([]);
  const [subjectNames, setSubjectNames] = useState([
    "Computer Networks (CN)",
    "Operating System (OS)",
    "Design and Analysis of Algorithms (DAA)",
    "Digital Logic Design and Computer Architecture (DLD & COA)",
    "Computer Graphics (CG)",
    "Microprocessor (MP)",
    "Data Base & Management System (DBMS)",
    "Theory of Computation (TOC)",
    "Introduction to Intelligent System (IIS)",
    "Compiler Design (CD)",
    "Maths-3 (M3)",
    "Maths-4 (M4)",
  ]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}collections`
      );
      const data = await response.json();
      const subjects = data.collections.filter(
        (collection) => collection !== "questions" && collection !== "subinfos"
      );
      setSubjectsInDB(
        subjects.map((subject) => {
          if (subject === "cn" || subject === "cns") {
            return "Computer Networks (CN)";
          } else if (subject === "os" || subject === "oss") {
            return "Operating System (OS)";
          } else if (subject === "daa" || subject === "daas") {
            return "Design and Analysis of Algorithms (DAA)";
          } else if (subject === "dldcoa" || subject === "dldcoas") {
            return "Digital Logic Design and Computer Architecture (DLD & COA)";
          } else if (subject === "cg" || subject === "cgs") {
            return "Computer Graphics (CG)";
          } else if (subject === "mp" || subject === "mps") {
            return "Microprocessor (MP)";
          } else if (subject === "dbms" || subject === "dbmss") {
            return "Data Base & Management System (DBMS)";
          } else if (subject === "toc" || subject === "tocs") {
            return "Theory of Computation (TOC)";
          } else if (subject === "iis" || subject === "iiss") {
            return "Introduction to Intelligent System (IIS)";
          } else if (subject === "cd" || subject === "cds") {
            return "Compiler Design (CD)";
          } else if (subject === "m3" || subject === "m3s") {
            return "Maths-3 (M3)";
          } else if (subject === "m4" || subject === "m4s") {
            return "Maths-4 (M4)";
          }
        })
      );
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    subjectsInDB.forEach((subject) => {
      if (subjectNames.includes(subject)) {
        setSubjectNames((prevNames) =>
          prevNames.filter((name) => name !== subject)
        );
      }
    });
  }, [subjectsInDB]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadLoadingDisabled(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("subject", subject);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}upload`, formData);
      setUploadLoading(false);
      setUploaded(true);
      console.log("Excel sheet uploaded successfully");
      alert("Uploaded successfully");
    } catch (error) {
      console.error("Error submitting form data:", error.message);
    }
  };

  const [error, setError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState({});

  const handleUploadImage = (sr_no, file) => {
    setData((prevData) => {
      const newData = prevData.map((item) =>
        item.sr_no === sr_no ? { ...item, image: file } : item
      );
      return newData;
    });
    setImagePreviews((prevPreviews) => ({
      ...prevPreviews,
      [sr_no]: URL.createObjectURL(file),
    }));
  };

  const fetchData = async (subject) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }questionsWithImages?subject=${subject}`
      );
      console.log(response.data);
      setData(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUploadImages = async () => {
    setUploadImagesLoading(true);
    setUploadImagesLoadingDisabled(true);
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("sub", subject);
      const srNoArr = data.map((item) => item.sr_no);
      const imagesArr = data.map((item) => item.image);
      console.log(srNoArr, imagesArr);
      for (let i = 0; i < srNoArr.length; i++) {
        formData.append("sr_no", srNoArr[i]);
        formData.append("images", imagesArr[i]);

        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}storeImage`,
          formData
        );
      }
      setUploadImagesLoading(false);
      console.log("Images uploaded successfully");
      alert("Images uploaded successfully");
      navigate("/questionGenerator");
    } catch (error) {
      console.error("Error uploading images:", error.message);
    }
  };

  return (
    <div className="flex-col">
      <div
        subject={subject}
        className="flex justify-center items-center h-[50vh] bg-gray-900"
      >
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
          <div className="mb-5">
            <label
              htmlFor="selectedSubjects"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Subject
            </label>
            <select
              id="selectedSubjects"
              name="selectedSubjects"
              value={subject}
              onChange={handleSubjectChange}
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              required
            >
              <option value="">Select Subject</option>
              {subjectNames.map(
                (subject) =>
                  subject && (
                    <option
                      value={subject
                        .match(/\(([^)]+)\)/)[1]
                        .replace(/[ &]/g, "")}
                      key={subject}
                    >
                      {subject}
                    </option>
                  )
              )}
              {subjectsInDB.map(
                (subject) =>
                  subject && (
                    <option
                      disabled={true}
                      value={subject
                        .match(/\(([^)]+)\)/)[1]
                        .replace(/[ &]/g, "")}
                      key={subject}
                    >
                      {subject}
                    </option>
                  )
              )}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="file-upload"
              className="block text-white font-bold mb-2"
            >
              Upload Excel File
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              disabled={uploadLoadingDisabled}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out flex gap-2 items-center justify-center"
              onClick={handleSubmit}
            >
              <span>Upload</span>
              {uploadLoading && (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              )}
            </button>
            {uploaded && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out"
                onClick={handlePreviewButton}
              >
                Preview
              </button>
            )}
          </div>
        </div>
      </div>
      {preview && (
        <div className="container mx-auto p-6">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <table className="w-full border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border border-gray-400">Sr. No.</th>
                  <th className="p-2 border border-gray-400">Question</th>
                  <th className="p-2 border border-gray-400">Upload Image</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.sr_no} className="bg-white">
                    <td className="p-2 border border-gray-400">{item.sr_no}</td>
                    <td className="p-2 border border-gray-400">
                      {item.questions}
                    </td>
                    <td className="p-2 border border-gray-400">
                      <div className="flex sm:flex-row flex-col items-center space-x-2">
                        <label
                          htmlFor={`file-upload-${item.sr_no}`}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 cursor-pointer"
                        >
                          Choose File
                        </label>
                        <input
                          id={`file-upload-${item.sr_no}`}
                          type="file"
                          className="hidden"
                          onChange={(e) =>
                            handleUploadImage(item.sr_no, e.target.files[0])
                          }
                        />
                        {imagePreviews[item.sr_no] && (
                          <img
                            src={imagePreviews[item.sr_no]}
                            alt={`Preview for question ${item.sr_no}`}
                            className="w-48 h-36 object-cover"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex justify-center mt-4">
            <button
              disabled={uploadImagesLoadingDisabled}
              onClick={handleUploadImages}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 ease-in-out flex gap-2 items-center justify-center"
            >
              <span>Upload Images</span>
              {uploadImagesLoading && (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSheet;
