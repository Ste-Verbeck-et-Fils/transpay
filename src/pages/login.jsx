import React, { useState } from "react";
import { Link } from "react-router";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "../styles/login.css";

function Login() {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.phone) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (formData.phone.length < 9) {
      newErrors.phone = "Le numéro doit contenir au moins 9 chiffres";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 4) {
      newErrors.password = "Le mot de passe est trop court";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            telephone: formData.phone,
            motdepasse: formData.password,
          }),
        });
        const data = await response.json();
        if (data.success) {
          // Store token
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          // Navigate to home or profile
          window.location.href = '/profile';
        } else {
          setErrors({ general: data.message });
        }
      } catch (error) {
        setErrors({ general: 'Erreur de connexion au serveur' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
    if (errors.general) {
      setErrors({ ...errors, general: null });
    }
  };

  return (
    <section className="login-section">
      <h1>Bienvenue</h1>
      <p>Connectez-vous pour gérer vos courses</p>

      {errors.general && (
        <div className="alert-danger">
          <i className="bi bi-exclamation-triangle-fill"></i>
          {errors.general}
        </div>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          type="number"
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
          placeholder={"..................."}
          value={formData.password}
          onChange={(e) => handleChange(e, "password")}
          error={errors.password}
        />

        <Button text="Se connecter" type="submit" isLoading={isLoading} />
      </form>

      <div id="text-bottom">
        <p>
          Vous n'avez pas de compte ? <Link to="/register">S'inscrire</Link>
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

export default Login;
