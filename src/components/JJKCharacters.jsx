import { useEffect, useState } from 'react'

// JJK character silhouettes positioned throughout the page
const characters = [
    {
        id: 'sukuna',
        name: 'Sukuna',
        position: { top: '15%', right: '5%' },
        size: 'w-48 h-64 lg:w-64 lg:h-80',
        gradient: 'from-jjk-sukuna/20 via-jjk-domain/10 to-transparent',
        delay: 0,
    },
    {
        id: 'gojo',
        name: 'Gojo',
        position: { top: '45%', left: '3%' },
        size: 'w-40 h-56 lg:w-56 lg:h-72',
        gradient: 'from-jjk-infinity/20 via-jjk-sixEyes/10 to-transparent',
        delay: 0.5,
    },
    {
        id: 'itadori',
        name: 'Itadori',
        position: { bottom: '20%', right: '8%' },
        size: 'w-36 h-48 lg:w-48 lg:h-64',
        gradient: 'from-jjk-curse/15 via-jjk-sukuna/10 to-transparent',
        delay: 1,
    },
    {
        id: 'megumi',
        name: 'Megumi',
        position: { top: '70%', left: '6%' },
        size: 'w-32 h-44 lg:w-44 lg:h-60',
        gradient: 'from-jjk-curseDark/20 via-jjk-curse/10 to-transparent',
        delay: 1.5,
    },
]

// Sukuna marks SVG pattern
const SukunaMarks = ({ className }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 10 L55 40 L85 45 L55 50 L50 80 L45 50 L15 45 L45 40 Z" opacity="0.6" />
        <circle cx="50" cy="45" r="8" opacity="0.4" />
    </svg>
)

// Abstract character silhouette shapes
const CharacterShape = ({ type, className }) => {
    const shapes = {
        sukuna: (
            <svg viewBox="0 0 200 280" className={className} fill="url(#sukunaGrad)">
                <defs>
                    <linearGradient id="sukunaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#dc2626" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                {/* Abstract Sukuna silhouette */}
                <path d="M100 20 C140 20 160 60 160 100 C160 140 150 180 140 220 C130 250 110 270 100 270 C90 270 70 250 60 220 C50 180 40 140 40 100 C40 60 60 20 100 20 Z" />
                <circle cx="75" cy="80" r="8" fill="#f43f5e" opacity="0.5" />
                <circle cx="125" cy="80" r="8" fill="#f43f5e" opacity="0.5" />
                <path d="M70 110 Q100 130 130 110" stroke="#f43f5e" strokeWidth="3" fill="none" opacity="0.4" />
            </svg>
        ),
        gojo: (
            <svg viewBox="0 0 200 260" className={className} fill="url(#gojoGrad)">
                <defs>
                    <linearGradient id="gojoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                {/* Abstract Gojo silhouette with blindfold */}
                <ellipse cx="100" cy="60" rx="45" ry="50" />
                <rect x="50" y="50" width="100" height="15" rx="7" fill="#1e293b" opacity="0.6" />
                <path d="M60 85 C60 200 80 250 100 250 C120 250 140 200 140 85" />
            </svg>
        ),
        itadori: (
            <svg viewBox="0 0 180 240" className={className} fill="url(#itadoriGrad)">
                <defs>
                    <linearGradient id="itadoriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#dc2626" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                {/* Abstract Itadori silhouette */}
                <ellipse cx="90" cy="50" rx="40" ry="45" />
                <path d="M50 70 C50 180 70 230 90 230 C110 230 130 180 130 70" />
                {/* Sukuna marks on face */}
                <line x1="70" y1="45" x2="70" y2="60" stroke="#f43f5e" strokeWidth="2" opacity="0.5" />
                <line x1="110" y1="45" x2="110" y2="60" stroke="#f43f5e" strokeWidth="2" opacity="0.5" />
            </svg>
        ),
        megumi: (
            <svg viewBox="0 0 160 220" className={className} fill="url(#megumiGrad)">
                <defs>
                    <linearGradient id="megumiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.25" />
                        <stop offset="50%" stopColor="#1e1b4b" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                {/* Abstract Megumi silhouette with spiky hair */}
                <path d="M80 10 L95 30 L110 15 L105 40 L120 35 L100 55 L85 50 L80 55 L75 50 L60 55 L40 35 L55 40 L50 15 L65 30 L80 10 Z" />
                <ellipse cx="80" cy="65" rx="35" ry="40" />
                <path d="M45 80 C45 170 60 210 80 210 C100 210 115 170 115 80" />
            </svg>
        ),
    }
    return shapes[type] || null
}

export default function JJKCharacters() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 500)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
            {characters.map((char) => (
                <div
                    key={char.id}
                    className={`absolute ${char.size} transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                    style={{
                        ...char.position,
                        transitionDelay: `${char.delay}s`,
                    }}
                >
                    <CharacterShape
                        type={char.id}
                        className="w-full h-full drop-shadow-lg"
                    />

                    {/* Floating curse energy particles */}
                    <div
                        className="absolute inset-0 rounded-full bg-gradient-radial from-jjk-curse/10 to-transparent animate-curse-flicker"
                        style={{ animationDelay: `${char.delay * 0.5}s` }}
                    />
                </div>
            ))}

            {/* Scattered curse energy orbs */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-jjk-curse/30 animate-float" />
            <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-jjk-sukuna/40 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/2 w-4 h-4 rounded-full bg-jjk-infinity/20 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-jjk-reverse/30 animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
    )
}
