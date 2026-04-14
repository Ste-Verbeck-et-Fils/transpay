import React, { useState } from "react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est requis";
    }

    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (formData.phone.length < 9) {
      newErrors.phone = "Le numéro doit contenir au moins 9 chiffres";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 4) {
      newErrors.password = "Le mot de passe doit faire au moins 4 caractères";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <section className="register-section">
      <h1>Bienvenue</h1>
      <p>Inscrivez-vous pour gérer vos courses</p>
      {errors.general && (
        <div className="alert-danger">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {errors.general}
        </div>
      )}
      <form className="register-form" onSubmit={handleSubmit}>
        <Input
          icon="person"
          label={"Nom complet"}
          placeholder={"Kiza Kambasu Faty"}
          value={formData.name}
          onChange={(e) => handleChange(e, "name")}
          error={errors.name}
        />
        <Input
          label={"Numéro de téléphone"}
          isPhone={true}
          placeholder={"000000 000"}
          value={formData.phone}
          onChange={(e) => handleChange(e, "phone")}
          error={errors.phone}
        />
        <Input
          label={"Mot de passe"}
          type="password"
          placeholder={"................"}
          value={formData.password}
          onChange={(e) => handleChange(e, "password")}
          error={errors.password}
        />
        <Input
          type="password"
          label={"Confirmer le mot de passe"}
          placeholder={"................"}
          value={formData.confirmPassword}
          onChange={(e) => handleChange(e, "confirmPassword")}
          error={errors.confirmPassword}
        />

        <Button text="S'inscrire" type="submit" isLoading={isLoading} />
      </form>
      <div id="text-bottom">
        <p>
          Déja un compte ?{" "}
          <a href="#" onClick={() => navigate("/login")}>
            Se connecter
          </a>
        </p>
      </div>
      <div className="back-link">
        <a href="/">
          <i className="bi bi-arrow-left"></i> Retour à l'accueil
        </a>
      </div>
    </section>
  );
}

export default Register;
