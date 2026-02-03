import { useState, useEffect } from 'react'

export default function HollowPurpleIntro({ onComplete }) {
    const [phase, setPhase] = useState(0)
    const [isSkipping, setIsSkipping] = useState(false)

    useEffect(() => {
        // Animation timeline
        const timers = [
            setTimeout(() => setPhase(1), 100),      // Start: Gojo appears
            setTimeout(() => setPhase(2), 1200),     // Red & Blue orbs appear
            setTimeout(() => setPhase(3), 2600),     // Orbs merge - Purple charges
            setTimeout(() => setPhase(4), 3800),     // Purple fires at screen
            setTimeout(() => setPhase(5), 5000),     // Fade out, reveal portfolio
            setTimeout(() => onComplete?.(), 5800),  // Animation complete
        ]

        return () => timers.forEach(clearTimeout)
    }, [onComplete])

    const handleSkip = () => {
        setIsSkipping(true)
        setTimeout(() => onComplete?.(), 400)
    }

    return (
        <div
            className={`hollow-purple-intro ${phase >= 5 || isSkipping ? 'intro-fade-out' : ''}`}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10000,
                background: 'radial-gradient(ellipse at center, #0a0515 0%, #030308 70%)',
                overflow: 'hidden',
            }}
        >
            {/* Curse energy particles background */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="curse-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    />
                ))}
            </div>

            {/* Gojo Silhouette */}
            <div
                className={`gojo-container ${phase >= 1 ? 'gojo-visible' : ''} ${phase >= 4 ? 'gojo-fade' : ''}`}
            >
                <svg
                    viewBox="0 0 200 400"
                    className="gojo-silhouette"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Body silhouette */}
                    <defs>
                        <linearGradient id="gojoGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#9333ea" stopOpacity="0.1" />
                        </linearGradient>
                        <filter id="gojoBlur">
                            <feGaussianBlur stdDeviation="1" />
                        </filter>
                    </defs>

                    {/* Head */}
                    <ellipse cx="100" cy="50" rx="28" ry="35" fill="#1a1a2e" />

                    {/* Blindfold */}
                    <rect x="65" y="40" width="70" height="15" rx="3" fill="#0f0f1a" />
                    <rect x="65" y="40" width="70" height="15" rx="3" fill="url(#gojoGlow)" />

                    {/* Hair spikes */}
                    <path
                        d="M70 30 L75 5 L85 25 L95 0 L105 25 L115 5 L125 25 L130 30"
                        fill="#e2e8f0"
                        opacity="0.9"
                    />

                    {/* Neck */}
                    <rect x="90" y="80" width="20" height="20" fill="#1a1a2e" />

                    {/* Torso - High collar uniform */}
                    <path
                        d="M60 100 L80 90 L100 95 L120 90 L140 100 L150 200 L50 200 Z"
                        fill="#0f0f1a"
                    />

                    {/* Collar details */}
                    <path
                        d="M80 90 L100 110 L120 90"
                        fill="none"
                        stroke="#2a2a4e"
                        strokeWidth="2"
                    />

                    {/* Arms spread */}
                    <path
                        d="M60 110 L20 160 L15 155 L25 165 L10 180"
                        fill="none"
                        stroke="#0f0f1a"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />
                    <path
                        d="M140 110 L180 160 L185 155 L175 165 L190 180"
                        fill="none"
                        stroke="#0f0f1a"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />

                    {/* Hands */}
                    <circle cx="10" cy="185" r="12" fill="#1a1a2e" />
                    <circle cx="190" cy="185" r="12" fill="#1a1a2e" />

                    {/* Lower body */}
                    <path
                        d="M50 200 L45 350 L70 350 L85 250 L100 350 L115 250 L130 350 L155 350 L150 200 Z"
                        fill="#0f0f1a"
                    />

                    {/* Aura glow */}
                    <ellipse
                        cx="100"
                        cy="200"
                        rx="90"
                        ry="150"
                        fill="url(#gojoGlow)"
                        filter="url(#gojoBlur)"
                        className="gojo-aura"
                    />
                </svg>

                {/* Six Eyes glow behind blindfold */}
                <div className="six-eyes-glow" />
            </div>

            {/* Red Orb - Reversal Red (Left hand) */}
            <div
                className={`orb orb-red ${phase >= 2 ? 'orb-visible' : ''} ${phase >= 3 ? 'orb-merge' : ''}`}
            >
                <div className="orb-core" />
                <div className="orb-glow" />
                <div className="orb-ring" />
            </div>

            {/* Blue Orb - Lapse Blue (Right hand) */}
            <div
                className={`orb orb-blue ${phase >= 2 ? 'orb-visible' : ''} ${phase >= 3 ? 'orb-merge' : ''}`}
            >
                <div className="orb-core" />
                <div className="orb-glow" />
                <div className="orb-ring" />
            </div>

            {/* Hollow Purple - Forms from collision */}
            <div
                className={`hollow-purple ${phase >= 3 ? 'purple-visible' : ''} ${phase >= 4 ? 'purple-fire' : ''}`}
            >
                <div className="purple-core" />
                <div className="purple-glow" />
                <div className="purple-ring purple-ring-1" />
                <div className="purple-ring purple-ring-2" />
                <div className="purple-ring purple-ring-3" />
                <div className="purple-distortion" />
            </div>

            {/* Impact flash */}
            <div className={`impact-flash ${phase >= 4 ? 'flash-active' : ''}`} />

            {/* Skip button */}
            <button
                onClick={handleSkip}
                className={`skip-button ${phase >= 4 ? 'skip-hidden' : ''}`}
            >
                Skip Intro
                <span className="skip-underline" />
            </button>

            {/* Hollow Purple text */}
            <div className={`technique-name ${phase >= 3 && phase < 5 ? 'name-visible' : ''}`}>
                <span className="technique-kanji">虚式</span>
                <span className="technique-english">Hollow Purple</span>
            </div>
        </div>
    )
}
