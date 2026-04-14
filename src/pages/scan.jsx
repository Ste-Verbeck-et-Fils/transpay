import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Scan = () => {
  return (
    <section>
      <Header />
      <div className="page-placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Scanner QR Code</h2>
        <p>Utilisez votre caméra pour scanner le QR code à bord.</p>
      </div>
      <Footer />
    </section>
  );
};

export default Scan;
