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
                    <img 
                        src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                        alt="Médicos analisando relatórios em um tablet" 
                    />
                </div>
            </section>

            {/* Seção Sobre (Foco no Gestor e no Fluxo do Hospital) */}
            <section id="about" className="info-section alternate-bg">
                <div className="section-content">
                    <h2>Sobre o Plantão Já</h2>
                    <p>
                        O <strong>Plantão Já</strong> nasce para desburocratizar a gestão de escalas médicas. Oferecemos aos diretores e gestores hospitalares a conveniência de <strong>cadastrar seus hospitais e publicar ofertas de plantões</strong> em tempo real, eliminando a bagunça dos grupos de mensagens. 
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                        Tenha o controle total de quem cobre suas escalas: visualize o perfil dos profissionais interessados e preencha furos na agenda com apenas alguns cliques.
                    </p>
                </div>
            </section>

            {/* Seção Serviços (Foco nos Médicos e no Fluxo de Aprovação) */}
            <section id="services" className="info-section">
                <div className="section-content">
                    <h2>Como Funciona Nosso Serviço</h2>
                    <div className="services-flow" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                        <div className="flow-step">
                            <strong>1. Publicação de Ofertas:</strong> O gestor do hospital cria e publica as vagas de plantão especificando a especialidade, horários e valores.
                        </div>
                        <div className="flow-step">
                            <strong>2. Inscrição de Médicos:</strong> Médicos cadastrados na plataforma navegam pelas oportunidades disponíveis, filtram por suas preferências e se <strong>inscrevem nos plantões</strong> desejados.
                        </div>
                        <div className="flow-step">
                            <strong>3. Aprovação e Match:</strong> O gestor avalia as inscrições recebidas e <strong>aprova o médico ideal</strong> para aquela vaga. Uma vez aprovado, o profissional está pronto para trabalhar no hospital com tudo alinhado de forma transparente!
                        </div>
                    </div>
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