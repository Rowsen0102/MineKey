import { useEffect, useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import {
  FaUpload,
  FaDownload,
  FaTrash,
  FaSearch,
  FaFileAlt,
} from "react-icons/fa";

function Files() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const loadFiles = async () => {
    try {
      const res = await API.get("/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFiles(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Не удалось загрузить файлы");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const uploadFile = async () => {
    if (!selectedFile) {
      toast.error("Выберите файл");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await API.post("/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Файл успешно загружен");

      setSelectedFile(null);
      loadFiles();
    } catch (err) {
      console.log(err);
      toast.error("Ошибка загрузки");
    }
  };

  const deleteFile = async (id) => {
    if (!window.confirm("Удалить файл?")) return;

    try {
      await API.delete(`/files/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("🗑 Файл удалён");
      loadFiles();
    } catch (err) {
      console.log(err);
      toast.error("Ошибка удаления");
    }
  };

  const downloadFile = async (id, filename) => {
    try {
      const res = await API.get(`/files/download/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("📥 Скачивание началось");
    } catch (err) {
      console.log(err);
      toast.error("Ошибка скачивания");
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: "900px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "35px",
          borderRadius: "25px",
          boxShadow: "0 15px 35px rgba(0,0,0,.12)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#17365f",
          }}
        >
          📁 Мои файлы
        </h2>

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={{
            width: "100%",
            padding: "15px",
            border: "2px dashed #4f83ff",
            borderRadius: "15px",
            marginBottom: "20px",
          }}
        />

        <button
          onClick={uploadFile}
          style={{
            display: "block",
            margin: "0 auto",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px 30px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          <FaUpload /> Загрузить файл
        </button>

        <div
          style={{
            marginTop: "30px",
            marginBottom: "25px",
            position: "relative",
          }}
        >
          <FaSearch
            style={{
              position: "absolute",
              left: "15px",
              top: "15px",
              color: "#999",
            }}
          />

          <input
            type="text"
            placeholder="Поиск файла..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 12px 12px 40px",
              borderRadius: "12px",
              border: "1px solid #ddd",
            }}
          />
        </div>

        <hr />

        {files.filter((file) =>
          file.originalname
            .toLowerCase()
            .includes(search.toLowerCase())
        ).length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#888",
              marginTop: "40px",
            }}
          >
            Файлов пока нет.
          </p>
        ) : (
          files
            .filter((file) =>
              file.originalname
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((file) => (
              <div
                key={file.id}
                style={{
                  marginTop: "25px",
                  padding: "30px",
                  borderRadius: "20px",
                  background: "#fff",
                  border: "1px solid #eee",
                  boxShadow: "0 10px 20px rgba(0,0,0,.08)",
                  textAlign: "center",
                }}
              >
                <FaFileAlt
                  style={{
                    fontSize: "60px",
                    color: "#2563eb",
                    marginBottom: "15px",
                  }}
                />

                <h3>{file.originalname}</h3>

                <p
                  style={{
                    color: "#666",
                  }}
                >
                  {new Date(file.created_at).toLocaleString("ru-RU")}
                </p>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() =>
                      downloadFile(file.id, file.originalname)
                    }
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <FaDownload /> Скачать
                  </button>

                  <button
                    onClick={() => deleteFile(file.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash /> Удалить
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Files;