import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import '../styles/profile.css'

// Assets
import taxiChauffeur from '../assets/images/taxichauffeur.png'

const Profile = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success) {
          const user = data.user
          setUserData({
            name: user.nom_complet,
            phone: user.telephone,
            trajets: '128',
            eco: '15.5k',
            points: '2.4k',
            identite: user.nom_complet
              .split(' ')
              .map(n => n[0])
              .join('. '),
            membre: 'Jan. 2023'
          })
          setFormData({ name: user.nom_complet, phone: user.telephone })
        } else {
          setError(data.message)
          if (response.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/login')
          }
        }
      } catch (err) {
        setError('Erreur de chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleLogout = async () => {
    const token = localStorage.getItem('token')
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch (error) {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/home')
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom complet est requis'
    }
    if (!formData.phone) {
      newErrors.phone = 'Le numéro de téléphone est requis'
    } else if (formData.phone.toString().length < 9) {
      newErrors.phone =
        'Le numéro de téléphone doit contenir au moins 9 chiffres'
    }
    setError(Object.values(newErrors).join('. '))
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async e => {
    e.preventDefault()
    setMessage(null)
    if (!validateForm()) {
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/home')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nom_complet: formData.name,
          telephone: formData.phone
        })
      })
      const data = await response.json()
      if (data.success) {
        const updatedUser = data.data.user
        setUserData(current => ({
          ...current,
          name: updatedUser.nom_complet,
          phone: updatedUser.telephone,
          identite: updatedUser.nom_complet
            .split(' ')
            .map(n => n[0])
            .join('. ')
        }))
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setMessage('Profil mis à jour avec succès.')
        setError(null)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil.')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value })
    setError(null)
    setMessage(null)
  }

  if (loading) {
    return <div>Chargement...</div>
  }

  if (error && !userData) {
    return <div>Erreur: {error}</div>
  }

  if (!userData) {
    return <div>Utilisateur non trouvé</div>
  }

  return (
    <div className='profile-container'>
      <Header />

      <main className='profile-main'>
        <div className='profile-banner'></div>

        <div className='user-header'>
          <div className='avatar-section'>
            <div className='avatar-box'>
              <img
                src={taxiChauffeur}
                alt='Profil utilisateur'
                className='profile-img'
              />
              <div className='edit-badge'>
                <i className='bi bi-pencil-fill'></i>
              </div>
            </div>
          </div>
          <div className='user-info-text'>
            <h2>{userData.name}</h2>
            <div className='user-phone'>
              <i className='bi bi-telephone-fill'></i>
              <span>{userData.phone}</span>
            </div>
          </div>
        </div>

        <div className='profile-edit-card'>
          <h3>Modifier mes informations</h3>
          {message && <div className='alert-success'>{message}</div>}
          {error && <div className='alert-danger'>{error}</div>}
          <form className='profile-edit-form' onSubmit={handleSave}>
            <div className='detail-text'>
              <span className='detail-label'>IDENTITÉ</span>
              <span className='detail-value'>{userData.identite}</span>
            </div>
            <Input
              label='Nom complet'
              placeholder='Entrez votre nom'
              value={formData.name}
              onChange={e => handleChange(e, 'name')}
            />
            <Input
              label='Numéro de téléphone'
              isPhone={true}
              placeholder='000000 000'
              value={formData.phone}
              onChange={e => handleChange(e, 'phone')}
            />
            <Button
              text={saving ? 'Enregistrement...' : 'Enregistrer'}
              type='submit'
              isLoading={saving}
            />
          </form>
        </div>

        <div className='logout-section'>
          <div className='logout-btn' onClick={handleLogout}>
            <div className='icon-box red'>
              <i className='bi bi-box-arrow-right'></i>
            </div>
            <span>Déconnexion</span>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Profile
