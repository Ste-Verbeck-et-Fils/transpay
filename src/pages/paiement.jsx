import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Paiement = () => {
  return (
    <section>
      <Header />
      <div className="page-placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Paiement</h2>
        <p>Effectuez vos paiements en toute sécurité.</p>
      </div>
      <Footer />
    </section>
  );
};

export default Paiement;
