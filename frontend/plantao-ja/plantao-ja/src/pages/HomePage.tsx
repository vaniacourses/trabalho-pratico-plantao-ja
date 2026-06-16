import React from "react";
import "./HomePage.css";

const HomePage: React.FC = () => {
    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>O plantão certo, na hora certa.</h1>
                    <p className="hero-subtitle">
                        A plataforma que conecta médicos em busca de oportunidades aos hospitais que precisam de uma gestão ágil e eficiente.
                    </p>
                    <div className="hero-buttons">
                        <a href="#services" className="btn-primary">Para Médicos</a>
                        <a href="#about" className="btn-secondary">Para Hospitais</a>
                    </div>
                </div>
                <div className="hero-image">
                    {/* Imagem Free License do Unsplash focada em ambiente médico/tecnologia */}
                    <img 
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                        alt="Médicos analisando relatórios em um tablet" 
                    />
                </div>
            </section>

            {/* Seção Sobre / Gestores */}
            <section id="about" className="info-section alternate-bg">
                <div className="section-content">
                    <h2>Gestão de Escalas Sem Dor de Cabeça</h2>
                    <p>
                        Para diretores e gestores hospitalares, o <strong>Plantão Já</strong> reduz o tempo gasto preenchendo furos na escala. Publique vagas instantaneamente, gerencie confirmações e tenha um dashboard completo da cobertura do seu hospital em tempo real.
                    </p>
                </div>
            </section>

            {/* Seção Serviços / Médicos */}
            <section id="services" className="info-section">
                <div className="section-content">
                    <h2>Encontre Seu Próximo Plantão</h2>
                    <p>
                        Chega de dezenas de grupos de WhatsApp. Aqui você filtra os plantões por especialidade, valor e localização. Inscreva-se com um clique e organize sua agenda médica de forma totalmente digital e transparente.
                    </p>
                </div>
            </section>

            {/* Seção Contato Simples */}
            <section id="contact" className="info-section alternate-bg contact-footer-spacing">
                <div className="section-content">
                    <h2>Fale Conosco</h2>
                    <p>Tem alguma dúvida sobre como integrar o sistema ao seu hospital? Entre em contato pelo e-mail: <strong>suporte@plantaoja.com.br</strong></p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;