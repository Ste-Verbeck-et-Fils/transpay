import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "../styles/profile.css";

const Profile = () => {
  return (
    <section>
      <Header />
      <div className="page-placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Mon Profil</h2>
        <p>Gérez vos informations personnelles.</p>
      </div>
      <Footer />
    </section>
  );
};

export default Profile;
