import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const Ticket = () => {
  return (
    <section>
      <Header />
      <div className="page-placeholder" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <h2>Mes Tickets</h2>
        <p>Vos titres de transport disponibles.</p>
      </div>
      <Footer />
    </section>
  );
};

export default Ticket;
