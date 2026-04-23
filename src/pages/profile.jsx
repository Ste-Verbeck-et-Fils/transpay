import API_BASE_URL from "../config.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/profile.css";

import taxiChauffeur from "../assets/images/taxichauffeur.png";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch( `${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          const user = data.user;
          setUserData({
            name: user.nom_complet,
            phone: user.telephone,
            trajets: "128",
            eco: "15.5k",
            points: "2.4k",
            identite: user.nom_complet
              .split(" ")
              .map((n) => n[0])
              .join(". "),
            membre: "Jan. 2023",
          });
          setFormData({ name: user.nom_complet, phone: user.telephone });
        } else {
          setError(data.message);
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
        }
      } catch (err) {
        setError("Erreur de chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch( `${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est requis";
    }
    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (formData.phone.toString().length < 9) {
      newErrors.phone =
        "Le numéro de téléphone doit contenir au moins 9 chiffres";
    }
    setError(Object.values(newErrors).join(". "));
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/home");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch( `${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom_complet: formData.name,
          telephone: formData.phone,
        }),
      });
      const data = await response.json();
      if (data.success) {
        const updatedUser = data.data.user;
        setUserData((current) => ({
          ...current,
          name: updatedUser.nom_complet,
          phone: updatedUser.telephone,
          identite: updatedUser.nom_complet
            .split(" ")
            .map((n) => n[0])
            .join(". "),
        }));
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setMessage("Profil mis à jour avec succès.");
        setError(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    setError(null);
    setMessage(null);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordMessage(null);

    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("Tous les champs sont requis");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "Le nouveau mot de passe doit contenir au moins 6 caractères",
      );
      return;
    }

    const token = localStorage.getItem("token");
    setPasswordLoading(true);
    try {
      const response = await fetch( `${API_BASE_URL}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ancienne_mot_de_passe: passwordData.oldPassword,
            nouveau_mot_de_passe: passwordData.newPassword,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setPasswordMessage("Mot de passe mis à jour avec succès.");
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setPasswordError(data.message);
      }
    } catch (err) {
      setPasswordError("Erreur lors du changement de mot de passe.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordInputChange = (e, field) => {
    setPasswordData({ ...passwordData, [field]: e.target.value });
    setPasswordError(null);
    setPasswordMessage(null);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error && !userData) {
    return <div>Erreur: {error}</div>;
  }

  if (!userData) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <div className="profile-container">
      <Header />

      <main className="profile-main">
        <div className="profile-banner"></div>

        <div className="user-header">
          <div className="avatar-section">
            <div className="avatar-box">
              <img
                src={taxiChauffeur}
                alt="Profil utilisateur"
                className="profile-img"
              />
              <div className="edit-badge">
                <i className="bi bi-pencil-fill"></i>
              </div>
            </div>
          </div>
          <div className="user-info-text">
            <h2>{userData.name}</h2>
            <div className="user-phone">
              <i className="bi bi-telephone-fill"></i>
              <span>{userData.phone}</span>
            </div>
          </div>
        </div>

        <div className="profile-edit-card">
          <h3>
            <i className="bi bi-person-lines-fill"></i> Modifier mes
            informations
          </h3>
          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-danger">{error}</div>}
          <form className="profile-edit-form" onSubmit={handleSave}>
            <div className="form-grid">
              <div className="detail-text compact">
                <span className="detail-label">IDENTITÉ</span>
                <span className="detail-value">{userData.identite}</span>
              </div>
              <Input
                label="Nom complet"
                placeholder="Entrez votre nom"
                value={formData.name}
                onChange={(e) => handleChange(e, "name")}
              />
              <Input
                label="Numéro de téléphone"
                isPhone={true}
                placeholder="000000 000"
                value={formData.phone}
                onChange={(e) => handleChange(e, "phone")}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Button
                text={saving ? "Enregistrement..." : "Enregistrer"}
                type="submit"
                isLoading={saving}
                style={{ width: "auto", minWidth: "180px" }}
              />
            </div>
          </form>
        </div>

        <div className="profile-edit-card">
          <h3>
            <i className="bi bi-shield-lock-fill"></i> Changer le mot de passe
          </h3>
          {passwordMessage && (
            <div className="alert-success">{passwordMessage}</div>
          )}
          {passwordError && <div className="alert-danger">{passwordError}</div>}
          <form className="profile-edit-form" onSubmit={handlePasswordChange}>
            <div className="form-grid">
              <div className="full-width">
                <Input
                  label="Ancien mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={passwordData.oldPassword}
                  onChange={(e) => handlePasswordInputChange(e, "oldPassword")}
                />
              </div>
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordInputChange(e, "newPassword")}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handlePasswordInputChange(e, "confirmPassword")
                }
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <Button
                text={
                  passwordLoading ? "Mise à jour..." : "Changer le mot de passe"
                }
                type="submit"
                isLoading={passwordLoading}
                style={{ width: "auto", minWidth: "220px" }}
              />
            </div>
          </form>
        </div>

        <div className="logout-card" onClick={handleLogout}>
          <div className="logout-content">
            <div className="icon-box red">
              <i className="bi bi-box-arrow-right"></i>
            </div>
            <span>Déconnexion</span>
          </div>
          <i className="bi bi-chevron-right logout-arrow"></i>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
