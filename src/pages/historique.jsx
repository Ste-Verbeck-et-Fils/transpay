import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Historique = () => {
  return (
    <section>
      <Header />
      <div className="page-placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Mon Historique</h2>
        <p>Vos transactions récentes s'afficheront ici.</p>
      </div>
      <Footer />
    </section>
  );
};

export default Historique;
