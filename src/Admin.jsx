import { useState, useEffect, useRef } from "react";
import { db, storage } from "./firebase";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL, deleteObject,
} from "firebase/storage";

const CATEGORIES = ["Video Ads", "Banners", "Store Assets", "Creative Strategy"];
const PRESET_COLORS = [
  { label: "Red", value: "#FF3366" },
  { label: "Green", value: "#00E5A0" },
  { label: "Yellow", value: "#FFD600" },
  { label: "Blue", value: "#00B4FF" },
  { label: "Purple", value: "#B44AFF" },
  { label: "Orange", value: "#FF6B2B" },
  { label: "Cyan", value: "#00D4FF" },
  { label: "Pink", value: "#FF6B9D" },
];
const ADMIN_PASSWORD = "pixai2026";

const inputStyle = {
  width: "100%", padding: "12px 16px", borderRadius: 10,
  border: "1px solid #2a2a35", background: "#13131A", color: "#F0F0F5",
  fontFamily: "'Outfit', sans-serif", fontSize: 14, outline: "none",
  transition: "border-color 0.3s",
};

const labelStyle = {
  display: "block", marginBottom: 6, fontSize: 12,
  fontFamily: "'Space Mono', monospace", letterSpacing: 1.5,
  textTransform: "uppercase", color: "#888",
};

const btnStyle = {
  padding: "10px 24px", borderRadius: 10, border: "none",
  fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
  cursor: "pointer", transition: "all 0.3s",
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: "", description: "", category: "Video Ads",
    tags: [], color: "#FF3366", mediaType: "video",
    videoUrl: "", visible: true, order: 0,
  });
  const [tagInput, setTagInput] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const thumbnailRef = useRef(null);
  const mediaRef = useRef(null);

  // Listen to Firestore
  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, "projects"), orderBy("order", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Firestore error:", err);
      showNotif("Erro ao carregar projetos. Verifica a configuração do Firebase.", "error");
    });
    return () => unsub();
  }, [authed]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const resetForm = () => {
    setForm({
      title: "", description: "", category: "Video Ads",
      tags: [], color: "#FF3366", mediaType: "video",
      videoUrl: "", visible: true, order: projects.length,
    });
    setTagInput("");
    setThumbnailFile(null);
    setMediaFile(null);
    setThumbnailPreview(null);
    setMediaPreview(null);
    setEditing(null);
    setShowForm(false);
  };

  const startEdit = (project) => {
    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "Video Ads",
      tags: project.tags || [],
      color: project.color || "#FF3366",
      mediaType: project.mediaType || "video",
      videoUrl: project.videoUrl || "",
      visible: project.visible !== false,
      order: project.order || 0,
    });
    setThumbnailPreview(project.thumbnailUrl || null);
    setMediaPreview(project.mediaType === "image" ? project.mediaUrl : null);
    setEditing(project.id);
    setShowForm(true);
    setThumbnailFile(null);
    setMediaFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === "thumbnail") {
      setThumbnailFile(file);
      setThumbnailPreview(url);
    } else {
      setMediaFile(file);
      setMediaPreview(url);
    }
  };

  const uploadFile = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      showNotif("O título é obrigatório!", "error");
      return;
    }
    setSaving(true);
    try {
      let thumbnailUrl = editing ? (thumbnailPreview || "") : "";
      let mediaUrl = "";

      if (thumbnailFile) {
        const path = `projects/${Date.now()}_thumb_${thumbnailFile.name}`;
        thumbnailUrl = await uploadFile(thumbnailFile, path);
      }

      if (mediaFile) {
        const path = `projects/${Date.now()}_media_${mediaFile.name}`;
        mediaUrl = await uploadFile(mediaFile, path);
      } else if (editing) {
        const existing = projects.find((p) => p.id === editing);
        mediaUrl = existing?.mediaUrl || "";
      }

      const data = {
        ...form,
        thumbnailUrl,
        mediaUrl,
        updatedAt: serverTimestamp(),
      };

      if (editing) {
        await updateDoc(doc(db, "projects", editing), data);
        showNotif("Projeto atualizado com sucesso!");
      } else {
        data.createdAt = serverTimestamp();
        data.order = projects.length;
        await addDoc(collection(db, "projects"), data);
        showNotif("Projeto adicionado com sucesso!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      showNotif("Erro ao guardar. Verifica a consola.", "error");
    }
    setSaving(false);
  };

  const handleDelete = async (project) => {
    if (deleting === project.id) {
      try {
        // Try to delete uploaded files
        if (project.thumbnailUrl?.includes("firebasestorage")) {
          try { await deleteObject(ref(storage, project.thumbnailUrl)); } catch (e) {}
        }
        if (project.mediaUrl?.includes("firebasestorage")) {
          try { await deleteObject(ref(storage, project.mediaUrl)); } catch (e) {}
        }
        await deleteDoc(doc(db, "projects", project.id));
        showNotif("Projeto eliminado.");
        setDeleting(null);
      } catch (err) {
        console.error(err);
        showNotif("Erro ao eliminar.", "error");
      }
    } else {
      setDeleting(project.id);
      setTimeout(() => setDeleting(null), 3000);
    }
  };

  const moveProject = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;
    try {
      await updateDoc(doc(db, "projects", projects[index].id), { order: newIndex });
      await updateDoc(doc(db, "projects", projects[newIndex].id), { order: index });
    } catch (err) {
      console.error(err);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0A0A0F", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <div style={{
          background: "#13131A", borderRadius: 20, padding: 48,
          border: "1px solid rgba(255,255,255,0.06)", maxWidth: 400, width: "90%",
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #FF3366, #B44AFF)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 18, color: "white",
              marginBottom: 16,
            }}>P</div>
            <h1 style={{ color: "#F0F0F5", fontSize: 24, fontWeight: 800 }}>
              PIX<span style={{ color: "#00E5A0" }}>AI</span> Admin
            </h1>
            <p style={{ color: "#666", fontSize: 14, marginTop: 8 }}>Painel de gestão de projetos</p>
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              style={{ ...inputStyle, borderColor: pwError ? "#FF3366" : "#2a2a35" }}
              placeholder="Introduz a password"
            />
            {pwError && <p style={{ color: "#FF3366", fontSize: 13, marginTop: 8 }}>Password incorreta</p>}
            <button
              onClick={handleLogin}
              style={{
                ...btnStyle, width: "100%", marginTop: 20,
                background: "linear-gradient(135deg, #FF3366, #FF6B2B)", color: "white",
              }}
            >Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div style={{
      minHeight: "100vh", background: "#0A0A0F", fontFamily: "'Outfit', sans-serif",
      color: "#F0F0F5",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Notification */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          padding: "14px 24px", borderRadius: 12,
          background: notification.type === "error" ? "#FF336620" : "#00E5A020",
          border: `1px solid ${notification.type === "error" ? "#FF336640" : "#00E5A040"}`,
          color: notification.type === "error" ? "#FF3366" : "#00E5A0",
          fontWeight: 600, fontSize: 14,
          animation: "slideLeft 0.3s ease-out",
        }}>
          {notification.msg}
        </div>
      )}

      <style>{`
        @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        input:focus, textarea:focus, select:focus { border-color: #00E5A0 !important; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #FF3366, #B44AFF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: "white",
          }}>P</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: 2 }}>
            PIX<span style={{ color: "#00E5A0" }}>AI</span>
            <span style={{ color: "#666", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>Admin</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/" style={{
            ...btnStyle, background: "rgba(255,255,255,0.06)", color: "#999",
            textDecoration: "none", fontSize: 13,
          }}>
            Ver site →
          </a>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* Add button */}
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            style={{
              ...btnStyle, width: "100%", padding: "20px",
              background: "rgba(0,229,160,0.08)", border: "2px dashed rgba(0,229,160,0.3)",
              color: "#00E5A0", fontSize: 16, borderRadius: 16, marginBottom: 32,
            }}
          >
            + Adicionar Novo Projeto
          </button>
        )}

        {/* ── FORM ── */}
        {showForm && (
          <div style={{
            background: "#13131A", borderRadius: 20, padding: 32,
            border: "1px solid rgba(255,255,255,0.06)", marginBottom: 32,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>
                {editing ? "Editar Projeto" : "Novo Projeto"}
              </h2>
              <button onClick={resetForm} style={{ ...btnStyle, background: "rgba(255,255,255,0.06)", color: "#888", fontSize: 13 }}>
                Cancelar
              </button>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Título *</label>
              <input
                style={inputStyle}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Sniper Battle"
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Descrição</label>
              <textarea
                style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descrição do projeto, o que fizeste, que resultados teve..."
              />
            </div>

            {/* Category + Color row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Categoria</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Cor do Projeto</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setForm({ ...form, color: c.value })}
                      title={c.label}
                      style={{
                        width: 36, height: 36, borderRadius: 10, border: "2px solid",
                        borderColor: form.color === c.value ? "white" : "transparent",
                        background: c.value, cursor: "pointer",
                        transform: form.color === c.value ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Tags</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="Escreve uma tag e carrega Enter"
                />
                <button onClick={addTag} style={{ ...btnStyle, background: "rgba(255,255,255,0.08)", color: "#ccc" }}>
                  +
                </button>
              </div>
              {form.tags.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                  {form.tags.map((tag) => (
                    <span key={tag} style={{
                      padding: "6px 12px", borderRadius: 20, fontSize: 12,
                      fontFamily: "'Space Mono', monospace",
                      background: "rgba(255,255,255,0.08)", color: "#ccc",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        style={{
                          background: "none", border: "none", color: "#FF3366",
                          cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1,
                        }}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Media type */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Tipo de Conteúdo</label>
              <div style={{ display: "flex", gap: 10 }}>
                {["video", "image"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setForm({ ...form, mediaType: type })}
                    style={{
                      ...btnStyle, flex: 1, padding: "14px",
                      background: form.mediaType === type
                        ? "linear-gradient(135deg, #FF3366, #B44AFF)" : "rgba(255,255,255,0.04)",
                      color: form.mediaType === type ? "white" : "#888",
                      border: `1px solid ${form.mediaType === type ? "transparent" : "#2a2a35"}`,
                    }}
                  >
                    {type === "video" ? "🎬 Vídeo" : "🖼️ Imagem / Banner"}
                  </button>
                ))}
              </div>
            </div>

            {/* Video URL (if video) */}
            {form.mediaType === "video" && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>URL do Vídeo (YouTube ou Vimeo)</label>
                <input
                  style={inputStyle}
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
                />
                <p style={{ color: "#555", fontSize: 12, marginTop: 6 }}>
                  Cola o link do YouTube ou Vimeo. O vídeo aparece embebido no site.
                </p>
              </div>
            )}

            {/* Media upload (if image) */}
            {form.mediaType === "image" && (
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Imagem / Banner</label>
                <input type="file" accept="image/*" ref={mediaRef} style={{ display: "none" }}
                  onChange={(e) => handleFileSelect(e, "media")} />
                <button
                  onClick={() => mediaRef.current.click()}
                  style={{
                    ...btnStyle, width: "100%", padding: "24px",
                    background: "rgba(255,255,255,0.03)",
                    border: "2px dashed #2a2a35", color: "#888",
                    borderRadius: 14,
                  }}
                >
                  {mediaPreview ? "Mudar imagem" : "📁 Clica para selecionar imagem"}
                </button>
                {mediaPreview && (
                  <img src={mediaPreview} alt="preview"
                    style={{ marginTop: 12, maxHeight: 200, borderRadius: 10, display: "block" }} />
                )}
              </div>
            )}

            {/* Thumbnail */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Thumbnail (imagem de capa do projeto)</label>
              <input type="file" accept="image/*" ref={thumbnailRef} style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e, "thumbnail")} />
              <button
                onClick={() => thumbnailRef.current.click()}
                style={{
                  ...btnStyle, width: "100%", padding: "24px",
                  background: "rgba(255,255,255,0.03)",
                  border: "2px dashed #2a2a35", color: "#888",
                  borderRadius: 14,
                }}
              >
                {thumbnailPreview ? "Mudar thumbnail" : "📁 Clica para selecionar thumbnail"}
              </button>
              {thumbnailPreview && (
                <img src={thumbnailPreview} alt="thumb preview"
                  style={{ marginTop: 12, maxHeight: 150, borderRadius: 10, display: "block" }} />
              )}
            </div>

            {/* Visibility */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <div
                  onClick={() => setForm({ ...form, visible: !form.visible })}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: form.visible ? "#00E5A0" : "#2a2a35",
                    position: "relative", cursor: "pointer", transition: "all 0.3s",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    position: "absolute", top: 3,
                    left: form.visible ? 23 : 3, transition: "all 0.3s",
                  }} />
                </div>
                <span style={{ color: form.visible ? "#00E5A0" : "#666" }}>
                  {form.visible ? "Visível no site" : "Escondido (rascunho)"}
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                ...btnStyle, width: "100%", padding: "16px",
                background: saving ? "#333" : "linear-gradient(135deg, #00E5A0, #00B4FF)",
                color: saving ? "#666" : "#0A0A0F", fontSize: 16, fontWeight: 700,
                borderRadius: 14,
              }}
            >
              {saving ? "A guardar..." : editing ? "Guardar Alterações" : "Adicionar Projeto"}
            </button>
          </div>
        )}

        {/* ── PROJECT LIST ── */}
        <div>
          <h3 style={{
            fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: 3,
            textTransform: "uppercase", color: "#666", marginBottom: 16,
          }}>
            Projetos ({projects.length})
          </h3>

          {projects.length === 0 && (
            <div style={{
              textAlign: "center", padding: 60, color: "#444",
              border: "1px solid #1a1a25", borderRadius: 16,
            }}>
              <p style={{ fontSize: 36, marginBottom: 12 }}>📂</p>
              <p>Ainda não tens projetos.</p>
              <p style={{ fontSize: 13 }}>Clica em "Adicionar Novo Projeto" para começar!</p>
            </div>
          )}

          {projects.map((project, index) => (
            <div key={project.id} style={{
              background: "#13131A", borderRadius: 16, padding: 20,
              border: "1px solid rgba(255,255,255,0.06)",
              marginBottom: 12, display: "flex", gap: 16, alignItems: "center",
              opacity: project.visible === false ? 0.5 : 1,
            }}>
              {/* Thumbnail */}
              <div style={{
                width: 80, height: 60, borderRadius: 10, flexShrink: 0,
                background: project.thumbnailUrl
                  ? `url(${project.thumbnailUrl}) center/cover`
                  : `linear-gradient(135deg, ${project.color}30, ${project.color}10)`,
                border: `1px solid ${project.color}30`,
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 16 }}>{project.title}</h4>
                  {project.visible === false && (
                    <span style={{
                      padding: "2px 8px", borderRadius: 6, fontSize: 10,
                      background: "rgba(255,255,255,0.06)", color: "#666",
                      fontFamily: "'Space Mono', monospace",
                    }}>RASCUNHO</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 11, color: project.color,
                    letterSpacing: 0.5,
                  }}>{project.category}</span>
                  {project.tags?.map((tag) => (
                    <span key={tag} style={{
                      padding: "2px 8px", borderRadius: 10, fontSize: 10,
                      background: "rgba(255,255,255,0.05)", color: "#777",
                      fontFamily: "'Space Mono', monospace",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => moveProject(index, -1)} disabled={index === 0}
                  style={{ ...btnStyle, padding: "6px 10px", background: "rgba(255,255,255,0.04)", color: index === 0 ? "#333" : "#888", fontSize: 13 }}
                  title="Mover para cima">↑</button>
                <button onClick={() => moveProject(index, 1)} disabled={index === projects.length - 1}
                  style={{ ...btnStyle, padding: "6px 10px", background: "rgba(255,255,255,0.04)", color: index === projects.length - 1 ? "#333" : "#888", fontSize: 13 }}
                  title="Mover para baixo">↓</button>
                <button onClick={() => startEdit(project)}
                  style={{ ...btnStyle, padding: "6px 14px", background: "rgba(0,229,160,0.1)", color: "#00E5A0", fontSize: 13 }}>
                  Editar
                </button>
                <button onClick={() => handleDelete(project)}
                  style={{
                    ...btnStyle, padding: "6px 14px", fontSize: 13,
                    background: deleting === project.id ? "#FF3366" : "rgba(255,51,102,0.1)",
                    color: deleting === project.id ? "white" : "#FF3366",
                  }}>
                  {deleting === project.id ? "Confirmar?" : "Apagar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
